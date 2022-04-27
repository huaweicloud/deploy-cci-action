import * as context from './context';
import * as validator from './validator';
import * as core from '@actions/core';
import * as cp from 'child_process';
const huaweicore = require('@huaweicloud/huaweicloud-sdk-core');

/**
 * 检查输入的各参数是否正常
 * @param inputs
 * @returns
 */
export function checkInputs(inputs: context.Inputs): boolean {
  if (!validator.checkAkSk(inputs.accessKey, inputs.secretKey)) {
    core.info('ak or sk is not correct.');
    return false;
  }
  if (!validator.checkProjectId(inputs.projectId)) {
    core.info('projectId is not correct.');
    return false;
  }
  if (!validator.checkRegion(inputs.region)) {
    core.info('region is not correct.');
    return false;
  }
  if (!validator.checkNamespace(inputs.namespace)) {
    core.info('namespace is not correct.');
    return false;
  }

  if (!validator.checkDeployment(inputs.deployment)) {
    core.info('deployment is not correct.');
    return false;
  }
  if (!validator.checkManifest(inputs.manifest)) {
    core.info('manifest is not correct.');
    return false;
  }

  // deployment和manifest同时传的时候负载名称需要一致
  if (inputs.manifest) {
    if (
      !validator.isDeploymentNameConsistent(inputs.deployment, inputs.manifest)
    ) {
      core.info('deployment, manifest parameters must be the same.');
      return false;
    }
  }

  if (!validator.checkImage(inputs.image, inputs.region)) {
    core.info('image is not correct.');
    return false;
  }
  return true;
}

/**
 * 返回随机数
 * @param number
 * @returns number
 */
export function getRandomByDigit(digitNumber: number): number {
  if (digitNumber < 1 || digitNumber > 16) {
    throw new Error('Number of digits between 1 and 16.');
  }
  return Math.round(Math.random() * Math.pow(10, digitNumber));
}

export function getBasicCredentials(inputs: context.Inputs) {
  return new huaweicore.BasicCredentials()
    .withAk(inputs.accessKey)
    .withSk(inputs.secretKey)
    .withProjectId(inputs.projectId);
}

export function getGlobalCredentials(inputs: context.Inputs) {
  return new huaweicore.GlobalCredentials()
    .withAk(inputs.accessKey)
    .withSk(inputs.secretKey);
}

export function getEndpoint(
  region: string,
  endpointServiceName: context.EndpointServiceName
) {
  return 'https://' + endpointServiceName + '.' + region + '.myhuaweicloud.com';
}

export async function execCommand(command: string): Promise<string> {
  return await (cp.execSync(command) || '').toString();
}
