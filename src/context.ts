import * as core from '@actions/core'

export interface Inputs {
  accessKey: string
  secretKey: string
  projectId: string
  region: string
  manifest: string
  imageList: string[]
}

export function getInputs(): Inputs {
  return {
    accessKey: core.getInput('access_key', {required: true}),
    secretKey: core.getInput('secret_key', {required: true}),
    projectId: core.getInput('project_id', {required: true}),
    region: core.getInput('region', {required: true}),
    manifest: core.getInput('manifest', {required: true}),
    imageList: core.getMultilineInput('image_list', {required: true})
  }
}
