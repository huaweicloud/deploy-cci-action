import * as core from '@actions/core'

export interface Inputs {
  accessKey: string
  secretKey: string
  projectId: string
  region: string
  namespace: string
  deployment: string
  manifest: string
  image: string
}

export function getInputs(): Inputs {
  return {
    accessKey: core.getInput('access_key', {required: true}),
    secretKey: core.getInput('secret_key', {required: true}),
    projectId: core.getInput('project_id', {required: true}),
    region: core.getInput('region', {required: true}),
    namespace: core.getInput('namespace', {required: true}),
    deployment: core.getInput('deployment', {required: true}),
    manifest: core.getInput('manifest', {required: false}),
    image: core.getInput('image', {required: true})
  }
}
