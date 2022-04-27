import * as main from '../src/main';

import * as utils from '../src/utils';
import * as context from '../src/context';
import * as install from '../src/install';
import * as auth from '../src/auth';
import * as cci from '../src/cci/cciService';

jest.mock('../src/context');
jest.mock('../src/install');
jest.mock('../src/auth');
jest.mock('../src/cci/cciService');

test('mock checkInputs return true', async () => {
  jest.spyOn(utils, 'checkInputs').mockReturnValue(true);
  await main.run();

  expect(context.getInputs).toHaveBeenCalled();
  expect(context.getInputs).toHaveBeenCalledTimes(1);

  expect(utils.checkInputs).toHaveBeenCalled();
  expect(utils.checkInputs).toHaveBeenCalledTimes(1);

  expect(install.downloadCciIamAuthenticator).toHaveBeenCalled();
  expect(install.downloadCciIamAuthenticator).toHaveBeenCalledTimes(1);

  expect(auth.configCciAuth).toHaveBeenCalled();
  expect(auth.configCciAuth).toHaveBeenCalledTimes(1);

  expect(cci.createNamespace).toHaveBeenCalled();
  expect(cci.createNamespace).toHaveBeenCalledTimes(1);

  expect(cci.createOrUpdateDeployment).toHaveBeenCalled();
  expect(cci.createOrUpdateDeployment).toHaveBeenCalledTimes(1);
});

test('mock checkInputs return false', async () => {
  jest.spyOn(utils, 'checkInputs').mockReturnValue(false);
  await main.run();

  expect(context.getInputs).toHaveBeenCalled();
  expect(context.getInputs).toHaveBeenCalledTimes(1);

  expect(utils.checkInputs).toHaveBeenCalled();
  expect(utils.checkInputs).toHaveBeenCalledTimes(1);

  expect(install.downloadCciIamAuthenticator).not.toHaveBeenCalled();

  expect(auth.configCciAuth).not.toHaveBeenCalled();

  expect(cci.createNamespace).not.toHaveBeenCalled();

  expect(cci.createOrUpdateDeployment).not.toHaveBeenCalled();
});
