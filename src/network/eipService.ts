import * as core from '@actions/core';
import * as utils from '../utils';
import * as context from '../context';

const eip = require('@huaweicloud/huaweicloud-sdk-eip');

/**
 * 购买弹性公网IP
 * @param
 * @returns
 */
export async function createPublicip(inputs: context.Inputs): Promise<string> {
  const bandwidthName = 'bandwidth-' + utils.getRandomByDigit(8);

  const client = eip.EipClient.newBuilder()
    .withCredential(utils.getBasicCredentials(inputs))
    .withEndpoint(
      utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC)
    )
    .build();
  const request = new eip.CreatePublicipRequest();
  const body = new eip.CreatePublicipRequestBody();
  const publicipbody = new eip.CreatePublicipOption();
  publicipbody.withType('5_bgp');
  const bandwidthbody = new eip.CreatePublicipBandwidthOption();
  bandwidthbody
    .withChargeMode('traffic')
    .withName(bandwidthName)
    .withShareType('PER')
    .withSize(5);
  body.withPublicip(publicipbody);
  body.withBandwidth(bandwidthbody);
  request.withBody(body);
  const result = await client.createPublicip(request);
  core.info(result);
  if (result.httpStatusCode != 200) {
    core.setFailed('Create Public IP Failed.');
  }
  if (Object.prototype.hasOwnProperty.call(result, 'publicip')) {
    const id = result.publicip.id;
    if (typeof(id) == 'string') {
      return Promise.resolve(id);
    }
  }
  throw new Error(
    'Create Public IP Failed.'
  );
}

/**
 * 更新弹性公网IP。更新EIP，将EIP跟一个网卡绑定或者解绑定，转换IP地址版本类型。
 * @param
 * @returns
 */
export async function updatePublicip(
  publicipId: string,
  portId: string,
  inputs: context.Inputs
): Promise<void> {
  const client = eip.EipClient.newBuilder()
    .withCredential(utils.getBasicCredentials(inputs))
    .withEndpoint(
      utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC)
    )
    .build();
  const request = new eip.UpdatePublicipRequest();
  request.publicipId = publicipId;
  const body = new eip.UpdatePublicipsRequestBody();
  const publicipbody = new eip.UpdatePublicipOption();
  publicipbody.withPortId(portId);
  body.withPublicip(publicipbody);
  request.withBody(body);
  const result = await client.updatePublicip(request);
  core.info(result);
  if (result.httpStatusCode >= 300) {
    core.setFailed('Update Public IP Failed.');
  }
}
