import * as utils from '../utils';
import * as context from '../context';
import {ElbClient} from './ElbClient';
import {CreateLoadbalancerRequest} from './model/CreateLoadbalancerRequest';
import {CreateLoadbalancerResponse} from './model/CreateLoadbalancerResponse';
import {CreateLoadbalancerRequestBody} from './model/CreateLoadbalancerRequestBody';
import {CreateLoadbalancerLoadbalancerOption} from './model/CreateLoadbalancerLoadbalancerOption';

/**
 * 获取负载均衡器的VipPortId
 * @param LoadbalancerResponse
 * @returns
 */
export async function getLoadbalancerVipPortIdByLoadbalancer(
  createLoadbalancerResponse: CreateLoadbalancerResponse
): Promise<string> {
  let loadbalancerResp;
  if (
    createLoadbalancerResponse !== null &&
    createLoadbalancerResponse !== undefined
  ) {
    loadbalancerResp = createLoadbalancerResponse.loadbalancer;
  }

  let vipPortId;
  if (loadbalancerResp !== null && loadbalancerResp !== undefined) {
    vipPortId = loadbalancerResp.vip_port_id;
  }

  if (vipPortId === null && vipPortId == undefined) {
    throw new Error(
      'Get Loadbanlancer vipPortId Faild: ' + JSON.stringify(loadbalancerResp)
    );
  }

  return Promise.resolve(vipPortId || '');
}

/**
 * 获取负载均衡器的id
 * @param LoadbalancerResponse
 * @returns
 */
export async function getLoadbalancerIdByLoadbalancer(
  createLoadbalancerResponse: CreateLoadbalancerResponse
): Promise<string> {
  let loadbalancerResp;
  if (
    createLoadbalancerResponse !== null &&
    createLoadbalancerResponse !== undefined
  ) {
    loadbalancerResp = createLoadbalancerResponse.loadbalancer;
  }

  let id;
  if (loadbalancerResp !== null && loadbalancerResp !== undefined) {
    id = loadbalancerResp.id;
  }

  if (id == null && id == undefined) {
    throw new Error(
      'get Loadbanlancer ID Faild: ' + JSON.stringify(loadbalancerResp)
    );
  }

  return Promise.resolve(id || '');
}

/**
 * 创建私网类型的负载均衡器
 * @param inputs
 * @returns
 */
export async function createLoadbalancer(
  vipSubnetId: string,
  inputs: context.Inputs
): Promise<CreateLoadbalancerResponse> {
  const client = ElbClient.newBuilder()
    .withCredential(utils.getBasicCredentials(inputs))
    .withEndpoint(
      utils.getEndpoint(inputs.region, context.EndpointServiceName.ELB)
    )
    .withOptions({customUserAgent: context.CUSTOM_USER_AHENT})
    .build();
  const request = new CreateLoadbalancerRequest();
  const body = new CreateLoadbalancerRequestBody();
  const loadbalancerbody = new CreateLoadbalancerLoadbalancerOption();
  loadbalancerbody
    .withName('elb-' + utils.getRandomByDigit(8))
    .withVipSubnetId(vipSubnetId);
  body.withLoadbalancer(loadbalancerbody);
  request.withBody(body);
  return await client.createLoadbalancer(request);
}
