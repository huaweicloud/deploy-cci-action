import * as context from './context'
import * as core from '@actions/core'
import * as fs from 'fs'
import yaml from 'yaml'
import * as path from 'path'
import * as mime from 'mime'

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
]

/**
 * 检查输入的各参数是否正常
 * @param inputs
 * @returns
 */
export function checkInputs(inputs: context.Inputs): boolean {
  if (!checkAkSk(inputs.accessKey, inputs.secretKey)) {
    core.info('ak or sk is not correct.')
    return false
  }
  if (!checkProjectId(inputs.projectId)) {
    core.info('projectId is not correct.')
    return false
  }
  if (!checkRegion(inputs.region)) {
    core.info('region is not correct.')
    return false
  }
  if (!checkNamespace(inputs.namespace)) {
    core.info('namespace is not correct.')
    return false
  }

  if (!checkDeployment(inputs.deployment)) {
    core.info('deployment is not correct.')
    return false
  }
  if (!checkManifest(inputs.manifest)) {
    core.info('manifest is not correct.')
    return false
  }

  // deployment和manifest不能同时不传
  if (!inputs.deployment && !inputs.manifest) {
    core.info('At least one of the deployment, manifest parameters')
    return false
  }

  // deployment和manifest同时传的时候负载名称需要一致
  if (inputs.deployment && inputs.manifest) {
    if (!iskDeploymentNameConsistent(inputs.deployment, inputs.manifest)) {
      core.info('At least one of the deployment, manifest parameters')
      return false
    }
  }

  if (!checkImageList(inputs)) {
    core.info('image_list is not correct.')
    return false
  }
  return true
}

/**
 * 检查aksk是否合法
 * @param inputs
 * @returns
 */
export function checkAkSk(accessKey: string, secretKey: string): boolean {
  const akReg = new RegExp('^[a-zA-Z0-9]{10,30}$')
  const skReg = new RegExp('^[a-zA-Z0-9]{30,50}$')
  return akReg.test(accessKey) && skReg.test(secretKey)
}

/**
 * 检查projectId是否合法
 * @param projectId
 * @returns
 */
 export function checkProjectId(projectId: string): boolean {
  const projectIdReg = new RegExp('^[a-zA-Z0-9]{16,64}$')
  return projectIdReg.test(projectId)
}

/**
 * 检查region是否合法
 * @param inputs
 * @returns
 */
export function checkRegion(region: string): boolean {
  return regionArray.includes(region)
}

/**
 * 检查namespace是否合法
 * @param namespace
 * @returns
 */
 export function checkNamespace(namespace: string): boolean {
  const namespaceReg = new RegExp('^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$')
  return namespaceReg.test(namespace)
}

/**
 * 检查deployment是否合法
 * @param deployment
 * @returns
 */
 export function checkDeployment(deployment: string): boolean {
   if (deployment) {
    const deploymentReg = new RegExp('^[a-z0-9][a-z0-9-.]{0,61}[a-z0-9]$')
    const isSpecialCharacterConnector = deployment.includes("..") || deployment.includes(".-") || deployment.includes("-.");
    return deploymentReg.test(deployment) && !isSpecialCharacterConnector;
   }
  return true;
}

/**
 * 检查manifest文件是否合法
 * @param string
 * @returns
 */
export function checkManifest(manifest: string): boolean {
  const manifestPath = path.resolve(manifest)
  if (!fs.existsSync(manifestPath)) {
    core.info('Manifest file does not exist.')
    return false
  }
  const mimeType = mime.getType(manifestPath)
  if (mimeType != 'text/yaml') {
    core.info('Manifest file must be yaml/yml file.')
    return false
  }
  const stat = fs.statSync(manifestPath)
  if (stat.isDirectory()) {
    core.info('Manifest file can not be a directory.')
    return false
  }
  if (stat.size / 1024 > 20 || stat.size <= 0) {
    core.info('The file cannot be larger than 20KB.')
    return false
  }
  return true
}

/**
 * 检查负载参数一致
 * @param deployment
 * @returns
 */
 export function iskDeploymentNameConsistent(deployment: string, manifest: string): boolean {
  const file = fs.readFileSync(manifest, 'utf8')
  const obsJson = yaml.parse(file);
  const metadata = obsJson.metadata;
  const deploymentName = metadata.name;
  if (metadata == null && metadata == undefined) {
    core.info('manifest file is not correct.')
    return false
  }
  if (deploymentName == null && deploymentName == undefined) {
    core.info('manifest file is not correct.')
    return false
  }
  if(deployment != obsJson.metadata.name) {
    core.info('deployment, manifest parameters must be the same.')
    return false
  }
  return true;
}

/**
 * 检查镜像列表是否合法
 * @param string[]
 * @returns
 */
export function checkImageList(inputs: context.Inputs): boolean {
  const manifestPath = path.resolve(inputs.manifest)
  const data = fs.readFileSync(manifestPath, 'utf8')
  const len = data.split('image: ').length - 1
  if (len != inputs.imageList.length) {
    core.info('The length of image_list is the same as that of list manifest.')
    return false
  }

  // cci region和swr region需要一致
  const imageArray = inputs.imageList
  for (let i = 0; i < imageArray.length; i++) {
    if (
      new RegExp('swr..{5,20}.myhuaweicloud.com').test(imageArray[i]) &&
      !imageArray[i].includes(inputs.region)
    ) {
      core.info('The regions of cci and swr must be the same.')
      return false
    }
  }
  return true
}

/**
 * 返回随机数
 * @param number
 * @returns number
 */
export function getRandomByDigit(digitNumber: number): number {
  return Math.round(Math.random() * Math.pow(10, digitNumber));
}
