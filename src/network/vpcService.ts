import * as core from '@actions/core'
import * as context from '../context'
import * as utils from '../utils'
const huaweicore = require('@huaweicloud/huaweicloud-sdk-core');
const vpc = require("@huaweicloud/huaweicloud-sdk-vpc");
import vpcv3 = require('@huaweicloud/huaweicloud-sdk-vpc/v3/public-api');
import { SubnetInfo } from './model/SubnetInfo';
import { SecurityGroupRule } from './model/SecurityGroupRule';


/**
 * 查询某租户下默认的安全组列表
 * @param 
 * @returns
 */
export async function listDefaultCCISecurityGroups(inputs: context.Inputs): Promise<string> {
  const client = vpcv3.VpcClient.newBuilder()
                          .withCredential(utils.getBasicCredentials(inputs))
                          .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
                          .build();
  const request = new vpcv3.ListSecurityGroupsRequest();
  const listRequestName = [];
  listRequestName.push("kubernetes.io-default-sg");
  request.name = listRequestName;
  const result: vpcv3.ListSecurityGroupsResponse = await client.listSecurityGroups(request);
  const obj = JSON.parse(JSON.stringify(result));
  if (obj.httpStatusCode != 200) {
    core.setFailed('List Security Groups Failed.');
   } 
  const securityGroups = obj.security_groups;
  if (securityGroups.length == 0) {
    const securityGroupId = await createDefaultCCISecurityGroups(inputs);
    await createDefaultCCISecurityGroupRule(securityGroupId, inputs);
  }
  return Promise.resolve(securityGroups[0].id);
}

/**
 * 创建安全组
 * @param 
 * @returns
 */
export async function createDefaultCCISecurityGroups(inputs: context.Inputs): Promise<string> {
  const client = vpc.VpcClient.newBuilder()
                              .withCredential(utils.getBasicCredentials(inputs))
                              .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
                              .build();
  const request = new vpc.CreateSecurityGroupRequest();
  const body = new vpc.CreateSecurityGroupRequestBody();
  const securityGroupbody = new vpc.CreateSecurityGroupOption();
  securityGroupbody.withName("kubernetes.io-default-sg");
  body.withSecurityGroup(securityGroupbody);
  request.withBody(body);
  const result = await client.createSecurityGroup(request);
  const obj = JSON.parse(JSON.stringify(result));
  if (obj.httpStatusCode >=300) {
    core.setFailed('Create Default CCI Security Groups Failed.');
   } 
  return Promise.resolve(obj.security_group.id);
}

/**
 * 创建安全组规则
 * @param 
 * @returns
 */
export async function createDefaultCCISecurityGroupRule(securityGroupId: string, inputs: context.Inputs): Promise<void> {
  const client = vpc.VpcClient.newBuilder()
                              .withCredential(utils.getBasicCredentials(inputs))
                              .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
                              .build();
  const securityGroupRules: Array<SecurityGroupRule> = [new SecurityGroupRule(securityGroupId, "ICMP", "8-0"), 
                                                      new SecurityGroupRule(securityGroupId, "TCP", "1-65535"),
                                                      new SecurityGroupRule(securityGroupId, "UDP", "1-65535")]; 

  securityGroupRules.forEach(async function (securityGroupRule) {
    const request = new vpc.CreateSecurityGroupRuleRequest();
    const body = new vpc.CreateSecurityGroupRuleRequestBody();
    const securityGroupRulebody = new vpc.CreateSecurityGroupRuleOption();
    securityGroupRulebody.withSecurityGroupId(securityGroupRule.securityGroupId)
     .withDirection(securityGroupRule.direction)
     .withEthertype(securityGroupRule.ethertype)
     .withProtocol(securityGroupRule.protocol)
     .withMultiport(securityGroupRule.multiport)
     .withRemoteIpPrefix(securityGroupRule.remoteIpPrefix)
     .withAction(securityGroupRule.action)
     .withPriority(securityGroupRule.priority);
    body.withSecurityGroupRule(securityGroupRulebody);
    request.withBody(body);
    const result = await client.createSecurityGroupRule(request);
    const obj = JSON.parse(JSON.stringify(result));
    if (obj.httpStatusCode >=300) {
      core.setFailed('Create Default CCI Security Groups Failed.');
     } 
  });
}

/**
 * 创建VPC
 * @param 
 * @returns
 */
export async function createVpc(inputs: context.Inputs): Promise<string> {
  const vpcName = "CCI-VPC-" + utils.getRandomByDigit(8);
  const defaultCidr = "192.168.0.0/16";

  const client = vpc.VpcClient.newBuilder()
                          .withCredential(utils.getBasicCredentials(inputs))
                          .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
                          .build();
  const request = new vpc.CreateVpcRequest();
  const body = new vpc.CreateVpcRequestBody();
  const vpcbody = new vpc.CreateVpcOption();
  vpcbody.withCidr(defaultCidr)
         .withName(vpcName);
  body.withVpc(vpcbody);
  request.withBody(body);
  const result = await client.createVpc(request);
  const obj = JSON.parse(JSON.stringify(result));
  if (obj.httpStatusCode != 200) {
    core.setFailed('List Security Groups Failed.');
   }
  return Promise.resolve(obj.vpc.id);
}

/**
 * 创建Subnet
 * @param 
 * @returns
 */
export async function createSubnet(vpcId: string): Promise<SubnetInfo> {
  const inputs: context.Inputs = context.getInputs()
  const subnetName = "cci-subnet-" + utils.getRandomByDigit(8);
  const defaultCidr = "192.168.0.0/18";
  const defaultGatewayIp = "192.168.0.1";

  const client = vpc.VpcClient.newBuilder()
                          .withCredential(utils.getBasicCredentials(inputs))
                          .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
                          .build();
  const request = new vpc.CreateSubnetRequest();
  const body = new vpc.CreateSubnetRequestBody();
  const listSubnetExtraDhcpOpts = [];
  listSubnetExtraDhcpOpts.push(
   new vpc.ExtraDhcpOption()
        .withOptName("ntp")
  );
  const subnetbody = new vpc.CreateSubnetOption();
  subnetbody.withName(subnetName)
   .withCidr(defaultCidr)
   .withVpcId(vpcId)
   .withGatewayIp(defaultGatewayIp)
   .withExtraDhcpOpts(listSubnetExtraDhcpOpts);
  body.withSubnet(subnetbody);
  request.withBody(body);
  const result = await client.createSubnet(request);
  if (result.httpStatusCode != 200) {
    core.setFailed('List Security Groups Failed.');
   }
  const subnetInfo:SubnetInfo = JSON.parse(JSON.stringify(result.subnet));
  return Promise.resolve(subnetInfo);
}
