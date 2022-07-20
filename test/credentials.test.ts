import * as cred from '../src/credentials';
import * as core from '@actions/core';

jest.mock('@actions/core');

describe('test get credential from environment variable and input is empty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.HUAWEI_CLOUD_REGION;
  });

  test(`test get credential from environment variable when is required and is existing `, () => {
    const actionName = 'region';
    const value = 'test-region';
    process.env.HUAWEI_CLOUD_REGION = value;
    expect(cred.getCredential(actionName, true)).toBe(value);
  });

  test(`test get credential from environment variable when is required and is not existing`, () => {
    const actionName = 'region';
    cred.getCredential(actionName, true);
    expect(core.setFailed).toHaveBeenCalledWith(
      `The Huawei Cloud credential input ${actionName} is not correct. Please switch to using huaweicloud/auth-action which supports authenticating to Huawei Cloud.`
    );
  });

  test(`test get credential from environment variable when is not required and is existing `, () => {
    const actionName = 'region';
    const value = 'test-region';
    process.env.HUAWEI_CLOUD_REGION = value;
    expect(cred.getCredential(actionName, false)).toBe(value);
  });

  test(`test get credential from environment variable when is not required and is not existing`, () => {
    const actionName = 'region';
    cred.getCredential(actionName, false);
    expect(core.setFailed).toBeCalledTimes(0);
  });

  test(`test get credential from environment variable when is required and is not existing in environment variable map`, () => {
    const actionName = 'region123';
    cred.getCredential(actionName, true);
    expect(core.setFailed).toBeCalledTimes(1);
  });
});

describe('test get credential from input and  environment variable is empty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.HUAWEI_CLOUD_REGION;
  });

  test(`test get credential from input when is required and is existing`, () => {
    const value = 'test-region';
    jest.spyOn(core, 'getInput').mockReturnValue(value);
    const actionName = 'region';
    expect(cred.getCredential(actionName, true)).toBe(value);
  });

  test(`test get credential from input when is required and is not existing`, () => {
    jest.spyOn(core, 'getInput').mockReturnValue('');
    const actionName = 'region';
    cred.getCredential(actionName, true);
    expect(core.setFailed).toBeCalledTimes(1);
  });

  test(`test get credential from input when is not required and is existing`, () => {
    const value = 'test-region';
    jest.spyOn(core, 'getInput').mockReturnValue(value);
    const actionName = 'region';
    expect(cred.getCredential(actionName, false)).toBe(value);
  });

  test(`test get credential from input when is not required and is not existing`, () => {
    jest.spyOn(core, 'getInput').mockReturnValue('');
    const actionName = 'region';
    cred.getCredential(actionName, false);
    expect(core.setFailed).not.toBeCalled();
  });
});
