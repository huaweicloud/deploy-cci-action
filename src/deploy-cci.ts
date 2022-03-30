import * as core from '@actions/core'
import * as context from './context'
import * as cp from 'child_process'

export async function deployCCI(): Promise<void> {
  const inputs: context.Inputs = context.getInputs()
  core.info('start deploy cci')
  const result = await (
    cp.execSync(`kubectl apply -f ${inputs.manifest}`) || ''
  ).toString()
  core.info('deploy cci result: ' + result)
}
