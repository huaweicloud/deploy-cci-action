import * as core from '@actions/core'
import * as os from 'os'
import * as cp from 'child_process'

export async function downloadCciIamAuthenticator(): Promise<void> {
  core.info('start install cci-iam-authenticator')
  const platform = os.platform()
  core.info('platform: ' + platform)
  await installCciIamAuthenticatorByPlatform(platform)
}

/*
 * 针对不同操作系统完成cci-iam-authenticator安装
 * @param platform
 */
export async function installCciIamAuthenticatorByPlatform(
  platform: string
): Promise<void> {
  const downloadURL = getAuthDownloadURL(platform)

  await installCciIamAuthenticator(downloadURL)
}

/*
 * 目前cci-iam-authenticator只支持Linux和darwin
 */
export function getAuthDownloadURL(platform: string): string {
  switch (platform.toLowerCase()) {
    case 'linux':
      return 'https://cci-iam-authenticator.obs.cn-north-4.myhuaweicloud.com/latest/linux-amd64/cci-iam-authenticator'
    case 'darwin':
      return 'https://cci-iam-authenticator-all-arch.obs.cn-south-1.myhuaweicloud.com/darwin-amd64/cci-iam-authenticator'
    default:
      throw new Error(
        'The cci-iam-authenticator supports only Linux and Darwin platforms.'
      )
  }
}

export async function installCciIamAuthenticator(
  downloadURL: string
): Promise<void> {
  await (
    cp.execSync(
      `curl -LO "${downloadURL}"   && chmod +x ./cci-iam-authenticator && mv ./cci-iam-authenticator /usr/local/bin`
    ) || ''
  ).toString()

  // 检查是否下载安装成功cci-iam-authenticator
  await checkCciIamAuthenticator()
}
/*
 * 检查是否下载安装成功cci-iam-authenticator
 */
export async function checkCciIamAuthenticator(): Promise<void> {
  core.info('check download cci-iam-authenticator result.')
  const checkResult = await (
    cp.execSync(`cci-iam-authenticator --help`) || ''
  ).toString()
  core.info('check download cci-iam-authenticator result: ' + checkResult)
}
