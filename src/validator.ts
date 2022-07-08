import * as core from '@actions/core';
import * as fs from 'fs';
import yaml from 'yaml';
import * as path from 'path';
import * as mime from 'mime';

/**
 * 目前支持云容器实例CCI功能的region列表
 * 华北-北京四	cn-north-4
 * 华东-上海二	cn-east-2
 * 华东-上海一	cn-east-3
 * 华南-广州	cn-south-1
 */
const regionArray: string[] = [
  'cn-north-4',
  'cn-east-2',
  'cn-east-3',
  'cn-south-1'
];

/**
 * 检查aksk是否合法
 * @param inputs
 * @returns
 */
export function checkAkSk(accessKey: string, secretKey: string): boolean {
  const akReg = new RegExp(/^[a-zA-Z0-9]{10,30}$/);
  const skReg = new RegExp(/^[a-zA-Z0-9]{30,50}$/);
  return akReg.test(accessKey) && skReg.test(secretKey);
}

/**
 * 检查projectId是否合法
 * @param projectId
 * @returns
 */
export function checkProjectId(projectId: string): boolean {
  const projectIdReg = new RegExp('^[a-zA-Z0-9]{16,64}$');
  return projectIdReg.test(projectId);
}

/**
 * 检查region是否合法
 * @param inputs
 * @returns
 */
export function checkRegion(region: string): boolean {
  return regionArray.includes(region);
}

/**
 * 检查namespace是否合法
 * @param namespace
 * @returns
 */
export function checkNamespace(namespace: string): boolean {
  const namespaceReg1 = new RegExp(/^[a-z0-9]{1}[a-z0-9\\-]{0,61}[a-z0-9]{1}$/);
  const namespaceReg2 = new RegExp(/^[a-z0-9]$/);
  return namespaceReg1.test(namespace) || namespaceReg2.test(namespace);
}

/**
 * 检查deployment是否合法
 * @param deployment
 * @returns
 */
export function checkDeployment(deployment: string): boolean {
  const deploymentReg1 = new RegExp(/^[a-z0-9][a-z0-9-.]{0,61}[a-z0-9]$/);
  const deploymentReg2 = new RegExp(/^[a-z0-9]$/);
  const isSpecialCharacterConnector =
    deployment.includes('..') ||
    deployment.includes('.-') ||
    deployment.includes('-.');
  return (
    (deploymentReg1.test(deployment) || deploymentReg2.test(deployment)) &&
    !isSpecialCharacterConnector
  );
}

/**
 * 检查manifest文件是否合法
 * @param string
 * @returns
 */
export function checkManifest(manifest: string): boolean {
  if (manifest) {
    const manifestPath = path.resolve(manifest);
    if (!fs.existsSync(manifestPath)) {
      core.info('Manifest file does not exist.');
      return false;
    }
    const stat = fs.statSync(manifestPath);
    if (stat.isDirectory()) {
      core.info('Manifest file can not be a directory.');
      return false;
    }
    const mimeType = mime.getType(manifestPath);
    if (mimeType != 'text/yaml') {
      core.info('Manifest file must be yaml/yml file.');
      return false;
    }
    if (stat.size / 1024 > 20 || stat.size <= 0) {
      core.info('The file cannot be larger than 20KB.');
      return false;
    }
  }
  return true;
}

/**
 * 检查负载参数一致
 * @param deployment
 * @returns
 */
export function isDeploymentNameConsistent(
  deployment: string,
  manifest: string
): boolean {
  const file = fs.readFileSync(manifest, 'utf8');
  const obsJson = yaml.parse(file);

  const metadata = obsJson.metadata;
  if (metadata === null && metadata == undefined) {
    core.info('manifest file is not correct.');
    return false;
  }

  const deploymentName = metadata.name;
  if (deploymentName === null && deploymentName == undefined) {
    core.info('manifest file is not correct.');
    return false;
  }
  if (deployment != obsJson.metadata.name) {
    core.info('deployment, manifest parameters must be the same.');
    return false;
  }
  return true;
}

/**
 * 检查镜像是否合法
 * @param inputs
 * @returns
 */
export function checkImage(image: string, region: string): boolean {
  if (new RegExp(/swr..{5,20}.myhuaweicloud.com/).test(image)) {
    if (image.indexOf(region) == -1) {
      core.info('The region of cci and swr must be the same.');
      return false;
    }
  }
  return true;
}
