import * as core from '@actions/core';

const HUAWEI_ClOUD_CREDENTIALS_ENVIRONMENT_VARIABLE_MAP = new Map<string, string | undefined>([
    ['access_key', process.env.HUAWEI_CLOUD_ACCESS_KEY_ID],
    ['secret_key', process.env.HUAWEI_CLOUD_SECRET_ACCESS_KEY],
    ['region', process.env.HUAWEI_CLOUD_REGION],
    ['project_id', process.env.HUAWEI_CLOUD_PROJECT_ID]
  ]);

export function getCredential(actionName: string, isRequired: boolean): string {
    const credFromEnv = HUAWEI_ClOUD_CREDENTIALS_ENVIRONMENT_VARIABLE_MAP.get(actionName);
    const cred = credFromEnv ? credFromEnv : core.getInput(actionName, {required: false});
    if (isRequired && !cred) {
        core.setFailed('The HUawei Cloud credential input is not correct. ' + 
        'Please switch to using huaweicloud/auth-action which supports authenticating to Huawei Cloud.');
    }
    return cred
}


