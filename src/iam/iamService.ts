import * as core from '@actions/core';
import * as context from '../context';
import * as utils from '../utils';

const iam = require('@huaweicloud/huaweicloud-sdk-iam');

/**
 * 查询项目详情获取项目租户id
 * @param
 * @returns
 */
export async function keystoneListAuthDomains(
  inputs: context.Inputs
): Promise<string> {
  const client = iam.IamClient.newBuilder()
    .withCredential(utils.getGlobalCredentials(inputs))
    .withEndpoint(
      utils.getEndpoint(inputs.region, context.EndpointServiceName.IAM)
    )
    .build();
  const request = new iam.KeystoneListAuthDomainsRequest();
  const result = await client.keystoneListAuthDomains(request);
  if (result.httpStatusCode >= 300) {
    core.setFailed('Keystone List Auth Domains Failed.');
  }
  if (result.domains instanceof Array) {
    if (result.domains.length <= 0) {
      core.setFailed('Keystone List Auth Domains Failed.');
    }
    const id = result.domains[0].id;
    if (typeof id == 'string') {
      return Promise.resolve(id);
    }
  }
  throw new Error('Keystone List Auth Domains Failed.');
}
