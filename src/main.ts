import * as core from '@actions/core';
import * as utils from './utils';
import * as context from './context';
import * as install from './install';
import * as auth from './auth';
import * as cci from './cci/cciService';

export async function run() {
  const inputs: context.Inputs = context.getInputs();

  // 如果参数输入有问题，终止操作
  if (!utils.checkInputs(inputs)) {
    core.setFailed('input parameters is not correct.');
    return;
  }

  // 安装cci-iam-authenticator
  await install.downloadCciIamAuthenticator();

  // 配置iam的aksk
  await auth.configCciAuth();

  // 新建CCI命名空间
  await cci.createNamespace(inputs);

  // CCI负载创建或者更新
  await cci.createOrUpdateDeployment(inputs);
}

run().catch(core.setFailed);
