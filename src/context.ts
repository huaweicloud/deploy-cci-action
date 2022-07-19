import * as core from '@actions/core';
import * as cred from './credentials';

export const CUSTOM_USER_AGENT = 'DevKit-GitHub:Huawei Cloud CCI Deoloy';

export enum EndpointServiceName {
  VPC = 'vpc',
  ELB = 'elb',
  IAM = 'iam',
  CCI = 'cci'
}

export interface Inputs {
  accessKey: string;
  secretKey: string;
  projectId: string;
  region: string;
  namespace: string;
  deployment: string;
  manifest: string;
  image: string;
}

export function getInputs(): Inputs {
  return {
    accessKey: cred.getCredential('access_key', true),
    secretKey: cred.getCredential('secret_key', true),
    projectId: cred.getCredential('project_id', true),
    region: cred.getCredential('region', true),
    namespace: core.getInput('namespace', {required: true}),
    deployment: core.getInput('deployment', {required: true}),
    manifest: core.getInput('manifest', {required: false}),
    image: core.getInput('image', {required: true})
  };
}


