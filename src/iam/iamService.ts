import * as core from '@actions/core'
import * as context from '../context'
import * as utils from '../utils'

const iam = require("@huaweicloud/huaweicloud-sdk-iam");

/**
 * 查询项目详情获取项目租户id
 * @param 
 * @returns
 */
export async function keystoneListAuthDomains(inputs: context.Inputs): Promise<string> {
  const client = iam.IamClient.newBuilder()
                            .withCredential(utils.getGlobalCredentials(inputs))
                            .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.IAM))
                            .build();
  const request = new iam.KeystoneListAuthDomainsRequest();
  const result = await client.keystoneListAuthDomains(request);
  core.info(JSON.stringify(result));
  if (result.httpStatusCode >= 300) {
    core.setFailed('Keystone List Auth Domains Failed.');
   } 
  return Promise.resolve((result.domains)[0].id);
}
