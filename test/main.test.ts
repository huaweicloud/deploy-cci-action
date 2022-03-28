// import * as core from '@actions/core';
import * as main from '../src/main';

import * as context from '../src/context';
import * as install from '../src/install';
import * as auth from '../src/auth';
import * as image from '../src/image-update';
import * as deploy from '../src/deploy-cci';

jest.mock('../src/context');
jest.mock('../src/install');
jest.mock('../src/auth');
jest.mock('../src/image-update');
jest.mock('../src/deploy-cci');

test('mock main.ts module', async () => {
    await main.run();
    expect(context.getInputs).toHaveBeenCalled();
    expect(context.getInputs).toHaveBeenCalledTimes(1);

    expect(install.downloadCciIamAuthenticator).toHaveBeenCalled();
    expect(install.downloadCciIamAuthenticator).toHaveBeenCalledTimes(1);

    expect(auth.configCciAuth).toHaveBeenCalled();
    expect(auth.configCciAuth).toHaveBeenCalledTimes(1);

    expect(image.updateImage).toHaveBeenCalled();
    expect(image.updateImage).toHaveBeenCalledTimes(1);

    expect(deploy.deployCCI).toHaveBeenCalled();
    expect(deploy.deployCCI).toHaveBeenCalledTimes(1);
  });