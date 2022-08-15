import * as auth from '../src/auth';
import * as core from '@actions/core';

jest.mock('@actions/core');
const mockGetInputs = jest.fn();

jest.mock('../src/context', () => {
  return {
    getInputs: jest.fn(() => ({
      mockGetInputs
    }))
  };
});

jest.mock('../src/utils', () => {
  return {
    execCommand: jest.fn(() => 'ok')
  };
});

describe('config cci auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('mock config cci auth succeed', async () => {
    await auth.configCciAuth();
    expect(core.info).toHaveBeenCalledTimes(2);
    expect(core.info).toHaveBeenNthCalledWith(
      1,
      'Configuring IAM Authentication Information Using AK/SK'
    );
    expect(core.info).toHaveBeenNthCalledWith(
      2,
      'generate-kubeconfig result end.'
    );
  });
});
