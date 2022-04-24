import * as core from '@actions/core'
import * as context from '../context'

const huaweicore = require('@huaweicloud/huaweicloud-sdk-core');
const iam = require("@huaweicloud/huaweicloud-sdk-iam");

/**
 * 查询项目详情获取项目租户id
 * @param 
 * @returns
 */
export async function keystoneListAuthDomains(): Promise<string> {
  const inputs: context.Inputs = context.getInputs()
  const ak = inputs.accessKey;
  const sk = inputs.secretKey;
  const endpoint = "https://iam." + inputs.region + ".myhuaweicloud.com";

  const credentials = new huaweicore.GlobalCredentials()
                       .withAk(ak)
                       .withSk(sk)
  const client = iam.IamClient.newBuilder()
                            .withCredential(credentials)
                            .withEndpoint(endpoint)
                            .build();
  const request = new iam.KeystoneListAuthDomainsRequest();
  const result = await client.keystoneListAuthDomains(request);
  core.info(JSON.stringify(result));
  if (result.httpStatusCode != 200) {
    core.setFailed('Keystone List Auth Domains Failed.');
   } 
  return Promise.resolve((result.domains)[0].id);
}
