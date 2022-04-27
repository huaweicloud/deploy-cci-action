import * as cci from '../src/cci/cciService';
import * as fs from 'fs';

describe('test get available zone', () => {
  const testCase = [
    {region: 'cn-north-4', result: 'cn-north-4a'},
    {region: 'cn-east-3', result: 'cn-east-3a'},
    {region: 'cn-east-2', result: 'cn-east-2c'},
    {region: 'cn-south-1', result: 'cn-south-1f'},
    {region: 'cn-north-1', result: ''},
    {region: 'dsdasa', result: ''}
  ];
  testCase.forEach(item => {
    const {region, result} = item;
    test(`region输入为(${region})，可用区返回值为${result}`, () => {
      expect(cci.getAvailableZone(region)).toBe(result);
    });
  });
});

describe('update images', () => {
  it('test update one image', async () => {
    const data = fs.readFileSync(
      './test/deployment-files/test.update.one.image.yaml',
      'utf8'
    );
    fs.writeFileSync(
      './test/deployment-files/test.update.one.image.copy.yaml',
      data,
      'utf8'
    );

    const mockInputs = {
      manifest: './test/deployment-files/test.update.one.image.copy.yaml',
      image: 'swr.repace.myhuaweicloud.com/repace/repace:v1.1'
    };
    await cci.updateImage(mockInputs.manifest, mockInputs.image);
    const testData = fs.readFileSync(
      './test/deployment-files/test.update.one.image.copy.yaml',
      'utf8'
    );
    const replaceData = fs.readFileSync(
      './test/deployment-files/test.update.one.image.replace.yaml',
      'utf8'
    );
    expect(testData).toEqual(replaceData);

    fs.unlinkSync('./test/deployment-files/test.update.one.image.copy.yaml');
  });
});
