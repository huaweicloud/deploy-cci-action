import * as install from '../src/install';

test('test auth download url on Linux', () => {
  expect(install.getAuthDownloadURL('Linux')).toBe(
    'https://cci-iam-authenticator.obs.cn-north-4.myhuaweicloud.com/latest/linux-amd64/cci-iam-authenticator'
  );
});

test('test auth download url on Darwin', () => {
  expect(install.getAuthDownloadURL('Darwin')).toBe(
    'https://cci-iam-authenticator-all-arch.obs.cn-south-1.myhuaweicloud.com/darwin-amd64/cci-iam-authenticator'
  );
});

test('test auth download url not Linux and Darwin', () => {
  expect(() => install.getAuthDownloadURL('Windows')).toThrow(
    'The cci-iam-authenticator supports only Linux and Darwin platforms.'
  );
});
