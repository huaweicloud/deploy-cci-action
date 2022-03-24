import * as core from '@actions/core'
import * as cp from 'child_process'

export async function deployCCI(manifest: string): Promise<void> {
  core.info('start deploy cci');
  await (
    cp.execSync(
      `kubectl apply -f ${manifest}`
    ) || ''
  ).toString()
}
