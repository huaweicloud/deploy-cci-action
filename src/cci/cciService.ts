import * as core from '@actions/core'
import * as cp from 'child_process'
import * as context from '../context'

import huaweicore = require('@huaweicloud/huaweicloud-sdk-core');
import {CciClient} from './CciClient';
import {ListNetworkingCciIoV1beta1NamespacedNetworkRequest} from './model/ListNetworkingCciIoV1beta1NamespacedNetworkRequest';
import {ListNetworkingCciIoV1beta1NamespacedNetworkResponse} from './model/ListNetworkingCciIoV1beta1NamespacedNetworkResponse';

const DEFAULT_AVAILABLE_ZONE_MAP = new Map<string, string>([
  ["cn-north-4", "cn-north-4a"],
  ["cn-east-3", "cn-east-3a"],
  ["cn-east-2", "cn-east-2c"],
  ["cn-south-1", "cn-south-1f"]
]);

/**
 * 获取容器实例的可用区
 * @param inputs
 * @returns
 */
export function getAvailableZone(region: string): string {
  if (!DEFAULT_AVAILABLE_ZONE_MAP.has(region)) {
    core.info(`${region}` + ' available zone does not exist.')
  }
  return DEFAULT_AVAILABLE_ZONE_MAP.get(region) || '';
}

/**
 * 检查命名空间是否存在
 * @param inputs
 * @returns
 */
export function isNamespaceExist(inputs: context.Inputs): boolean {
  let isExist = false
  try {
    const result = cp.execSync(`kubectl get ns | awk '{if (NR > 1) {print $1}}'`).toString()
    if (result.includes(inputs.namespace)) {
      isExist = true
    }
  } catch(error) {
    core.info(`${inputs.namespace}` + ' namespace does not exist.')
    isExist = false
  }
  return isExist
}

/**
 * 检查负载是否存在
 * @param inputs
 * @returns
 */
export function isDeploymentExist(inputs: context.Inputs): boolean {
  let isExist = false
  try {
    const result = cp.execSync(`kubectl get deployment -n ${inputs.namespace} | awk '{if (NR > 1) {print $1}}'`).toString()
    if (result.includes(inputs.deployment)) {
      isExist = true
    }
  } catch(error) {
    core.info('xxxx deployment does not exist.')
    isExist = false
  }
  return isExist
}

/**
 * 新建或者升级Namespace
 * @param inputs
 * @returns
 */
export async function applyNamespace(filePath: string): Promise<void> {
  core.info('start apply namespace')
  const result = await (
    cp.execSync(`kubectl apply -f ${filePath}`) || ''
  ).toString()
  core.info('deploy cci namespace result: ' + result)
}

/**
 * 新建或者升级Network
 * @param inputs
 * @returns
 */
export async function applyNetwork(filePath: string, namespace: string): Promise<void> {
  core.info('start apply network')
  const result = await (
    cp.execSync(`kubectl apply -f ${filePath} -n ${namespace}`) || ''
  ).toString()
  core.info('deploy cci network result: ' + result)
}

/**
 * 新建或者升级负载
 * @param inputs
 * @returns
 */
export async function applyDeployment(filePath: string, namespace: string): Promise<void> {
  core.info('start apply deployment')
  const result = await (
    cp.execSync(`kubectl apply -f ${filePath} -n ${namespace}`) || ''
  ).toString()
  core.info('deploy cci result: ' + result)
}

/**
 * 新建或者升级Service
 * @param string
 * @returns
 */
export async function applyService(filePath: string, namespace: string): Promise<void> {
  core.info('start apply Service')
  const result = await (
    cp.execSync(`kubectl apply -f ${filePath} -n ${namespace}`) || ''
  ).toString()
  core.info('deploy cci Service result: ' + result)
}

/**
 * 新建或者升级Ingress
 * @param string
 * @returns
 */
export async function applyIngress(filePath: string, namespace: string): Promise<void> {
  core.info('start apply Ingress')
  const result = await (
    cp.execSync(`kubectl apply -f ${filePath} -n ${namespace}`) || ''
  ).toString()
  core.info('deploy cci Ingress result: ' + result)
}

/**
 * 查询cci指定Network的子网ID
 * @param inputs
 * @returns
 */
export async function getCCINetworkSubnetID(inputs: context.Inputs): Promise<string> {
  const result = await getCCINetwork(inputs);
  const items = result.items;
  
  let itemResp;
  if (items !== null && items !== undefined) {
      itemResp = items[0]
   }
  
  let spec;
  if (itemResp !== null && itemResp !== undefined) {
    spec = itemResp.spec
   }
    
  let subnetID;
  if (spec !== null && spec !== undefined) {
    subnetID = spec.subnetID
   }

  if (spec == null && spec == undefined) {
    throw new Error('Get CCINetwork SubnetID Faild: ' + JSON.stringify(result))
  }
 
  return Promise.resolve(subnetID || ''); 
}

/**
 * 查询cci指定Network对象
 * @param inputs
 * @returns
 */
export async function getCCINetwork(inputs: context.Inputs): Promise<ListNetworkingCciIoV1beta1NamespacedNetworkResponse> {
  const endpoint = "https://cci." + inputs.region + ".myhuaweicloud.com";

  const credentials = new huaweicore.BasicCredentials()
                       .withAk(inputs.accessKey)
                       .withSk(inputs.secretKey)
                       .withProjectId(inputs.projectId)
  const client = CciClient.newBuilder()
                          .withCredential(credentials)
                          .withEndpoint(endpoint)
                          .build();
  const request = new ListNetworkingCciIoV1beta1NamespacedNetworkRequest();
  request.withNamespace(inputs.namespace);
  return await client.listNetworkingCciIoV1beta1NamespacedNetwork(request);
}
