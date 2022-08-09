import * as core from '@actions/core';
import yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as context from '../context';
import * as utils from '../utils';
import * as vpc from '../network/vpcService';
import * as iam from '../iam/iamService';
import * as eip from '../network/eipService';
import * as elb from '../network/elbService';

import {CciClient} from './CciClient';
import {Namespace} from './manifest/Namespace';
import {Network} from './manifest/Network';
import {Deployment} from './manifest/Deployment';
import {Service} from './manifest/Service';
import {Ingress} from './manifest/Ingress';
import {SubnetInfo} from '../network/model/SubnetInfo';
import {ListNetworkingCciIoV1beta1NamespacedNetworkRequest} from './model/ListNetworkingCciIoV1beta1NamespacedNetworkRequest';
import {ListNetworkingCciIoV1beta1NamespacedNetworkResponse} from './model/ListNetworkingCciIoV1beta1NamespacedNetworkResponse';
import {ReadCoreV1NamespaceRequest} from './model/ReadCoreV1NamespaceRequest';

const DEFAULT_AVAILABLE_ZONE_MAP = new Map<string, string>([
  ['cn-north-4', 'cn-north-4a'],
  ['cn-east-3', 'cn-east-3a'],
  ['cn-east-2', 'cn-east-2c'],
  ['cn-south-1', 'cn-south-1f']
]);

/**
 * 获取容器实例的可用区
 * @param inputs
 * @returns
 */
export function getAvailableZone(region: string): string {
  if (!DEFAULT_AVAILABLE_ZONE_MAP.has(region)) {
    core.info(`${region} available zone does not exist.`);
  }
  return DEFAULT_AVAILABLE_ZONE_MAP.get(region) || '';
}

/**
 * 创建命名空间时会关联已有VPC或创建一个新的VPC
 * @param inputs
 * @returns
 */
export async function createNamespace(inputs: context.Inputs): Promise<void> {
  if (!(await isNamespaceExist(inputs))) {
    // 新建Namespace
    const namespaceFileName = 'namespace-' + utils.getRandomByDigit(8) + '.yml';
    const namespaceContent = new Namespace(inputs.namespace);
    fs.writeFileSync(
      namespaceFileName,
      yaml.stringify(namespaceContent),
      'utf8'
    );
    applyNamespace(namespaceFileName);

    // 新建Network
    const securityGroupId = await vpc.listDefaultCCISecurityGroups(inputs);
    const domainId = await iam.keystoneListAuthDomains(inputs);
    const availableZone = getAvailableZone(inputs.region);
    const networkFileName = 'network-' + utils.getRandomByDigit(8) + '.yml';
    const vpcId = await vpc.createVpc(inputs);
    const subnetInfo: SubnetInfo = await vpc.createSubnet(vpcId);
    const networkContent = new Network(
      inputs.namespace,
      securityGroupId,
      domainId,
      inputs.projectId,
      availableZone,
      subnetInfo.cidr,
      vpcId,
      subnetInfo.neutron_network_id,
      subnetInfo.neutron_subnet_id
    );
    fs.writeFileSync(networkFileName, yaml.stringify(networkContent), 'utf8');
    applyNetwork(networkFileName, inputs.namespace);
  }
}

/**
 * 负载创建或者更新
 * @param inputs
 * @returns
 */
export async function createOrUpdateDeployment(
  inputs: context.Inputs
): Promise<void> {
  if (!(await isDeploymentExist(inputs))) {
    core.info('deployment does not exist.');
    await createDeployment(inputs);
  } else {
    await updateDeployment(inputs);
  }
}

/**
 * 负载创建
 * @param inputs
 * @returns
 */
export async function createDeployment(inputs: context.Inputs): Promise<void> {
  if (inputs.manifest) {
    // 根据用户yaml文件新建Deployment
    // 替换镜像地址
    await updateImage(inputs.manifest, inputs.image);
    applyDeployment(inputs.manifest, inputs.namespace);
  } else {
    const deployFileName = 'deployment-' + utils.getRandomByDigit(8) + '.yml';
    const deployContent = new Deployment(inputs);
    fs.writeFileSync(deployFileName, yaml.stringify(deployContent), 'utf8');
    applyDeployment(deployFileName, inputs.namespace);
  }

  // 新建vip
  const publicipId = await eip.createPublicip(inputs);
  const subnetID = await getCCINetworkSubnetID(inputs);
  const loadbalancer = await elb.createLoadbalancer(subnetID, inputs);
  const vipPortId = await elb.getLoadbalancerVipPortIdByLoadbalancer(
    loadbalancer
  );
  await eip.updatePublicip(publicipId, vipPortId, inputs);

  // 新建Service
  const elbId = await elb.getLoadbalancerIdByLoadbalancer(loadbalancer);
  const serviceFileName = 'service-' + utils.getRandomByDigit(8) + '.yml';
  const serviceContent = new Service(inputs, elbId);
  fs.writeFileSync(serviceFileName, yaml.stringify(serviceContent), 'utf8');
  applyService(serviceFileName, inputs.namespace);

  // 新建Ingress
  const ingressFileName = 'ingress-' + utils.getRandomByDigit(8) + '.yml';
  const ingressContent = new Ingress(inputs, elbId);
  fs.writeFileSync(ingressFileName, yaml.stringify(ingressContent), 'utf8');
  applyIngress(ingressFileName, inputs.namespace);
}

/**
 * 更新创建
 * @param inputs
 * @returns
 */
export async function updateDeployment(inputs: context.Inputs): Promise<void> {
  if (inputs.manifest) {
    // 根据用户yaml文件更新Deployment
    // 替换镜像地址
    await updateImage(inputs.manifest, inputs.image);
    applyDeployment(inputs.manifest, inputs.namespace);
  } else {
    // 获取镜像名称
    const result = await utils.execCommand(
      'kubectl get deployment ' +
        inputs.deployment +
        " -o=jsonpath='{$.spec.template.spec.containers[0].name}' -n " +
        inputs.namespace
    );

    // 更新镜像
    await utils.execCommand(
      'kubectl set image deploy ' +
        inputs.deployment +
        ' ' +
        result +
        '=' +
        inputs.image +
        ' -n ' +
        inputs.namespace
    );
  }
}

/*
 * 更新k8s模板文件的镜像url
 */
export async function updateImage(
  filePath: string,
  image: string
): Promise<void> {
  core.info('update manifest file');
  const manifestPath = path.resolve(filePath);

  const data = fs.readFileSync(manifestPath, 'utf8');
  const placeholder = data.replace(
    RegExp(/image: .*/),
    "image: '" + image + "'"
  );
  fs.writeFileSync(manifestPath, placeholder, 'utf8');
}

/**
 * 检查命名空间是否存在
 * @param namespace
 * @returns
 */
export async function isNamespaceExist(
  inputs: context.Inputs
): Promise<boolean> {
  let isExist = false;
  const client = CciClient.newBuilder()
    .withCredential(utils.getBasicCredentials(inputs))
    .withEndpoint(
      utils.getEndpoint(inputs.region, context.EndpointServiceName.CCI)
    )
    .withOptions({customUserAgent: context.CUSTOM_USER_AGENT})
    .build();
  const request = new ReadCoreV1NamespaceRequest();
  request.withNamespace(inputs.namespace);
  try {
    const result = await client.readCoreV1Namespace(request);
    if (result.httpStatusCode === 200) {
      isExist = true;
    }
  } catch (error) {
    core.setFailed('Query Namespace Exist Failed.');
  }
  return isExist;
}

/**
 * 检查负载是否存在
 * @param inputs
 * @returns
 */
export async function isDeploymentExist(
  inputs: context.Inputs
): Promise<boolean> {
  let isExist = false;
  try {
    const result = await utils.execCommand(
      'kubectl get deployment -n ' +
        inputs.namespace +
        " | awk '{if (NR > 1) {print $1}}'"
    );
    if (result.includes(inputs.deployment)) {
      isExist = true;
    }
  } catch (error) {
    core.info(`${inputs.deployment} deployment does not exist.`);
    isExist = false;
  }
  return isExist;
}

/**
 * 新建或者升级Namespace
 * @param inputs
 * @returns
 */
export async function applyNamespace(filePath: string): Promise<void> {
  core.info('start apply namespace');
  await utils.execCommand(`kubectl apply -f ${filePath}`);
  core.info('deploy cci namespace result end.');
}

/**
 * 新建或者升级Network
 * @param inputs
 * @returns
 */
export async function applyNetwork(
  filePath: string,
  namespace: string
): Promise<void> {
  core.info('start apply network');
  const result = await utils.execCommand(
    `kubectl apply -f ${filePath} -n ${namespace}`
  );
  core.info('deploy cci network result end.');
}

/**
 * 新建或者升级负载
 * @param inputs
 * @returns
 */
export async function applyDeployment(
  filePath: string,
  namespace: string
): Promise<void> {
  core.info('start apply deployment');
  const result = await utils.execCommand(
    `kubectl apply -f ${filePath} -n ${namespace}`
  );
  core.info('deploy cci result end.');
}

/**
 * 新建或者升级Service
 * @param string
 * @returns
 */
export async function applyService(
  filePath: string,
  namespace: string
): Promise<void> {
  core.info('start apply Service');
  const result = await utils.execCommand(
    `kubectl apply -f ${filePath} -n ${namespace}`
  );
  core.info('deploy cci Service result end.');
}

/**
 * 新建或者升级Ingress
 * @param string
 * @returns
 */
export async function applyIngress(
  filePath: string,
  namespace: string
): Promise<void> {
  core.info('start apply Ingress');
  const result = await utils.execCommand(
    `kubectl apply -f ${filePath} -n ${namespace}`
  );
  core.info('deploy cci Ingress result end.');
}

/**
 * 查询cci指定Network的子网ID
 * @param inputs
 * @returns
 */
export async function getCCINetworkSubnetID(
  inputs: context.Inputs
): Promise<string> {
  const result = await getCCINetwork(inputs);
  const items = result.items;

  let itemResp;
  if (items !== null && items !== undefined) {
    itemResp = items[0];
  }

  let spec;
  if (itemResp !== null && itemResp !== undefined) {
    spec = itemResp.spec;
  }

  let subnetID;
  if (spec !== null && spec !== undefined) {
    subnetID = spec.subnetID;
  }

  if (subnetID === null || subnetID === undefined) {
    throw new Error('Get CCINetwork SubnetID Faild: ' + JSON.stringify(result));
  }

  return Promise.resolve(subnetID || '');
}

/**
 * 查询cci指定Network对象
 * @param inputs
 * @returns
 */
export async function getCCINetwork(
  inputs: context.Inputs
): Promise<ListNetworkingCciIoV1beta1NamespacedNetworkResponse> {
  const client = CciClient.newBuilder()
    .withCredential(utils.getBasicCredentials(inputs))
    .withEndpoint(
      utils.getEndpoint(inputs.region, context.EndpointServiceName.CCI)
    )
    .withOptions({customUserAgent: context.CUSTOM_USER_AGENT})
    .build();
  const request = new ListNetworkingCciIoV1beta1NamespacedNetworkRequest();
  request.withNamespace(inputs.namespace);
  try {
    return await client.listNetworkingCciIoV1beta1NamespacedNetwork(request);
  } catch (error) {
    core.setFailed('Get CCI Network Error.');
  }
  throw new Error('Get CCI Network Failed.');
}
