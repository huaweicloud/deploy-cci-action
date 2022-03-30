import * as utils from '../src/utils'


describe('test whether the aksk parameter is valid', () => {
    const testCase = [
        { input: { accessKey: '1234567890', secretKey: '123456789012345678901234567890', region: '', manifest: '', imageList: []}, result: true},
        { input: { accessKey: '', secretKey: '', region: '', manifest: '', imageList: []}, result: false},
        { input: { accessKey: '', secretKey: '123456789012345678901234567890', region: '', manifest: '', imageList: []}, result: false},
        { input: { accessKey: '1234567890', secretKey: '', region: '', manifest: '', imageList: []}, result: false},
        { input: { accessKey: '12345', secretKey: '123456789012345678901234567890', region: '', manifest: '', imageList: []}, result: false},
        { input: { accessKey: '1234567890', secretKey: '1234567890', region: '', manifest: '', imageList: []}, result: false},
        { input: { accessKey: '1234567890123456789012345678901', secretKey: '123456789012345678901234567890123456789012345678901', region: '', manifest: '', imageList: []}, result: false},
        { input: { accessKey: '1234567890123456789012345678901', secretKey: '123456789012345678901234567890', region: '', manifest: '', imageList: []}, result: false},
        { input: { accessKey: '1234567890', secretKey: '123456789012345678901234567890123456789012345678901', region: '', manifest: '', imageList: []}, result: false},
        { input: { accessKey: '1234%^890', secretKey: '1234567890123456#$12345678901234567890', region: '', manifest: '', imageList: []}, result: false},
    ]
    testCase.forEach(item => {
        const { input, result } = item
        test(`AK,SK输入为(${input.accessKey})and(${input.secretKey})，返回值为${result}`, () => {
            expect(utils.checkAkSk(input)).toBe(result)
        });
    })
  })

describe('test whether the region parameter is valid', () => {
    const testCase = [
        { region: 'cn-north-4', result: true},
        { region: 'cn-east-2', result: true},
        { region: 'cn-east-3', result: true},
        { region: 'cn-south-1', result: true},
        { region: 'cn-north-1', result: false},
        { region: 'ap-southeastst', result: false},
        { region: 'dsdasa', result: false},
    ]
    testCase.forEach(item => {
        const { region, result } = item
        test(`region输入为(${region})，返回值为${result}`, () => {
            expect(utils.checkRegion(region)).toBe(result)
        });
    })
})

describe('test whether the manifest parameter is valid', () => {
    const testCase = [
        { description: '文件存在且内容合法',  manifest: './test/deployment-files/test.manifest.yaml', result: true},
        { description: '文件不存在',  manifest: './test/deployment-files/no-exist-file', result: false},
        { description: '文件类型不正确',  manifest: './test/deployment-files/test.manifest.txt', result: false},
        { description: 'manifest为文件夹',  manifest: './test/deployment-files/test.manifest.yml', result: false},
        { description: 'manifest大于20KB',  manifest: './test/deployment-files/test.manifest.large.yml', result: false},
        { description: 'manifest大小0KB',  manifest: './test/deployment-files/test.manifest.zero.yml', result: false},
    ]
    testCase.forEach(item => {
        const { description, manifest, result } = item
        test(`${description}，返回值为${result}`, () => {
            expect(utils.checkManifest(manifest)).toBe(result)
        });
    })
})

describe('test whether the imageList parameter is valid', () => {
    const testCase = [
        { description: '镜像数量和manifest文件镜像个数一致',  input: { accessKey: '', secretKey: '', region: '', manifest: './test/deployment-files/test.imagelist.yaml', imageList: ['swr.cn-north-4.myhuaweicloud.com/demo-test/demo:v1.2']}, result: true},
        { description: '镜像数量和manifest文件镜像个数不一致',  input: { accessKey: '', secretKey: '', region: '', manifest: './test/deployment-files/test.imagelist.yaml', imageList: ['image1', 'image2']}, result: false},
        { description: '镜像region和cci的region不一致',  input: { accessKey: '', secretKey: '', region: 'cn-north-4', manifest: './test/deployment-files/test.imagelist.yaml', imageList: ['swr.cn-south-1.myhuaweicloud.com/demo-test/demo:v1.2']}, result: false},
    ]
    testCase.forEach(item => {
        const { description, input, result } = item
        test(`${description}，返回值为${result}`, () => {
            expect(utils.checkImageList(input)).toBe(result)
        });
    })
  })