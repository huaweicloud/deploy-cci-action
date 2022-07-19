import * as core from '@actions/core';

const HUAWEI_ClOUD_CREDENTIALS_ENVIRONMENT_VARIABLE_MAP = new Map<
  string,
  string
>([
  ['access_key', 'HUAWEI_CLOUD_ACCESS_KEY_ID'],
  ['secret_key', 'HUAWEI_CLOUD_SECRET_ACCESS_KEY'],
  ['region', 'HUAWEI_CLOUD_REGION'],
  ['project_id', 'HUAWEI_CLOUD_PROJECT_ID']
]);

export function getCredential(actionName: string, isRequired: boolean): string {
  const environmentVariable =
    HUAWEI_ClOUD_CREDENTIALS_ENVIRONMENT_VARIABLE_MAP.get(actionName) || '';
  const credFromEnv = process.env[environmentVariable];
  const cred = credFromEnv
    ? credFromEnv
    : core.getInput(actionName, {required: false});
  if (isRequired && !cred) {
    core.setFailed(
      `The Huawei Cloud credential input ${actionName} is not correct. Please switch to using huaweicloud/auth-action which supports authenticating to Huawei Cloud.`
    );
  }
  return cred;
}
