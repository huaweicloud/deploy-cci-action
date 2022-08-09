import * as core from '@actions/core';
import * as context from '../context';
import * as utils from '../utils';
const vpc = require('@huaweicloud/huaweicloud-sdk-vpc');
import vpcv3 = require('@huaweicloud/huaweicloud-sdk-vpc/v3/public-api');
import {SubnetInfo} from './model/SubnetInfo';
import {SecurityGroupRule} from './model/SecurityGroupRule';

const DAFAULT_CIDR = '192.168.0.0/16';
const DEFAULT_SUBNET_CIDR = '192.168.0.0/18';
const DEFAULT_GATEWAY_IP = '192.168.0.1';
const DEFAULT_SECURITY_GROUP = 'kubernetes.io-default-sg';

/**
 * 查询某租户下默认的安全组列表
 * @param
 * @returns
 */
export async function listDefaultCCISecurityGroups(
  inputs: context.Inputs
): Promise<string> {
  const client = vpcv3.VpcClient.newBuilder()
    .withCredential(utils.getBasicCredentials(inputs))
    .withEndpoint(
      utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC)
    )
    .withOptions({customUserAgent: context.CUSTOM_USER_AGENT})
    .build();
  const request = new vpcv3.ListSecurityGroupsRequest();
  const listRequestName = [];
  listRequestName.push(DEFAULT_SECURITY_GROUP);
  request.name = listRequestName;
  let obj
  try {
    const result: vpcv3.ListSecurityGroupsResponse =
    await client.listSecurityGroups(request);
    obj = JSON.parse(JSON.stringify(result));
    if (obj.httpStatusCode >= 300) {
      core.setFailed('List Security Groups Failed.');
    }
  } catch (error) {
    core.setFailed('List Security Groups Error.');
  }
  const securityGroups = obj.security_groups;
  if (securityGroups instanceof Array) {
    if (securityGroups.length <= 0) {
      const securityGroupId = await createDefaultCCISecurityGroups(inputs);
      await createDefaultCCISecurityGroupRule(securityGroupId, inputs);
      return Promise.resolve(securityGroupId);
    }
    const id = securityGroups[0].id;
    if (typeof id == 'string') {
      return Promise.resolve(id);
    }
  }
  throw new Error('List Security Groups Failed.');
}

/**
 * 创建安全组
 * @param
 * @returns
 */
export async function createDefaultCCISecurityGroups(
  inputs: context.Inputs
): Promise<string> {
  const client = vpc.VpcClient.newBuilder()
    .withCredential(utils.getBasicCredentials(inputs))
    .withEndpoint(
      utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC)
    )
    .withOptions({customUserAgent: context.CUSTOM_USER_AGENT})
    .build();
  const request = new vpc.CreateSecurityGroupRequest();
  const body = new vpc.CreateSecurityGroupRequestBody();
  const securityGroupbody = new vpc.CreateSecurityGroupOption();
  securityGroupbody.withName(DEFAULT_SECURITY_GROUP);
  body.withSecurityGroup(securityGroupbody);
  request.withBody(body);
  try {
    const result = await client.createSecurityGroup(request);
    const obj = JSON.parse(JSON.stringify(result));
    if (obj.httpStatusCode >= 300) {
      core.setFailed('Create Default CCI Security Groups Failed.');
    }
    if (Object.prototype.hasOwnProperty.call(obj, 'security_group')) {
      const id = obj.security_group.id;
      if (typeof id == 'string') {
        return Promise.resolve(id);
      }
    }
  } catch (error) {
    core.setFailed('Create Default CCI Security Groups Error.');
  }
  
  throw new Error('Create Default CCI Security Groups Failed.');
}

/**
 * 创建安全组规则
 * @param
 * @returns
 */
export async function createDefaultCCISecurityGroupRule(
  securityGroupId: string,
  inputs: context.Inputs
): Promise<void> {
  const client = vpcv3.VpcClient.newBuilder()
    .withCredential(utils.getBasicCredentials(inputs))
    .withEndpoint(
      utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC)
    )
    .withOptions({customUserAgent: context.CUSTOM_USER_AGENT})
    .build();
  const securityGroupRules: Array<SecurityGroupRule> = [
    new SecurityGroupRule(securityGroupId, 'ICMP', '8-0'),
    new SecurityGroupRule(securityGroupId, 'TCP', '1-65535'),
    new SecurityGroupRule(securityGroupId, 'UDP', '1-65535')
  ];

  securityGroupRules.forEach(async function (securityGroupRule) {
    const request = new vpcv3.CreateSecurityGroupRuleRequest();
    const body = new vpcv3.CreateSecurityGroupRuleRequestBody();
    const securityGroupRulebody = new vpcv3.CreateSecurityGroupRuleOption();
    securityGroupRulebody
      .withSecurityGroupId(securityGroupRule.securityGroupId)
      .withDirection(securityGroupRule.direction)
      .withEthertype(securityGroupRule.ethertype)
      .withProtocol(securityGroupRule.protocol)
      .withMultiport(securityGroupRule.multiport)
      .withRemoteIpPrefix(securityGroupRule.remoteIpPrefix)
      .withAction(securityGroupRule.action)
      .withPriority(securityGroupRule.priority);
    body.withSecurityGroupRule(securityGroupRulebody);
    request.withBody(body);
    try {
      const result = await client.createSecurityGroupRule(request);
      const obj = JSON.parse(JSON.stringify(result));
      if (obj.httpStatusCode >= 300) {
        core.setFailed('Create Default CCI Security Groups Failed.');
      }
    } catch (error) {
      core.setFailed('Create Default CCI Security Groups Error.');
    }
  });
}

/**
 * 创建VPC
 * @param
 * @returns
 */
export async function createVpc(inputs: context.Inputs): Promise<string> {
  const vpcName = 'CCI-VPC-' + utils.getRandomByDigit(8);

  const client = vpc.VpcClient.newBuilder()
    .withCredential(utils.getBasicCredentials(inputs))
    .withEndpoint(
      utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC)
    )
    .withOptions({customUserAgent: context.CUSTOM_USER_AGENT})
    .build();
  const request = new vpc.CreateVpcRequest();
  const body = new vpc.CreateVpcRequestBody();
  const vpcbody = new vpc.CreateVpcOption();
  vpcbody.withCidr(DAFAULT_CIDR).withName(vpcName);
  body.withVpc(vpcbody);
  request.withBody(body);
  const result = await client.createVpc(request);
  const obj = JSON.parse(JSON.stringify(result));
  if (obj.httpStatusCode >= 300) {
    core.setFailed('Create VPC Failed.');
  }
  if (Object.prototype.hasOwnProperty.call(obj, 'vpc')) {
    const id = obj.vpc.id;
    if (typeof id == 'string') {
      return Promise.resolve(id);
    }
  }
  throw new Error('Create VPC Failed.');
}

/**
 * 创建Subnet
 * @param
 * @returns
 */
export async function createSubnet(vpcId: string): Promise<SubnetInfo> {
  const inputs: context.Inputs = context.getInputs();
  const subnetName = 'cci-subnet-' + utils.getRandomByDigit(8);

  const client = vpc.VpcClient.newBuilder()
    .withCredential(utils.getBasicCredentials(inputs))
    .withEndpoint(
      utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC)
    )
    .withOptions({customUserAgent: context.CUSTOM_USER_AGENT})
    .build();
  const request = new vpc.CreateSubnetRequest();
  const body = new vpc.CreateSubnetRequestBody();
  const listSubnetExtraDhcpOpts = [];
  listSubnetExtraDhcpOpts.push(new vpc.ExtraDhcpOption().withOptName('ntp'));
  const subnetbody = new vpc.CreateSubnetOption();
  subnetbody
    .withName(subnetName)
    .withCidr(DEFAULT_SUBNET_CIDR)
    .withVpcId(vpcId)
    .withGatewayIp(DEFAULT_GATEWAY_IP)
    .withExtraDhcpOpts(listSubnetExtraDhcpOpts);
  body.withSubnet(subnetbody);
  request.withBody(body);
  try {
    const result = await client.createSubnet(request);
    if (result.httpStatusCode >= 300) {
      core.setFailed('Create Subnet Failed.');
    }
    const subnetInfo: SubnetInfo = JSON.parse(JSON.stringify(result.subnet));
    if (
      Object.prototype.hasOwnProperty.call(subnetInfo, 'cidr') &&
      Object.prototype.hasOwnProperty.call(subnetInfo, 'neutron_network_id') &&
      Object.prototype.hasOwnProperty.call(subnetInfo, 'neutron_subnet_id')
    ) {
      return Promise.resolve(subnetInfo);
    }
  } catch (error) {
    core.setFailed('Create Subnet Error.');
  }
  throw new Error('Create Subnet Failed.');
}
