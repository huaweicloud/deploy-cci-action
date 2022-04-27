import * as utils from '../src/utils';
import * as validator from '../src/validator';

beforeEach(() => {
  jest.resetAllMocks();
});

// describe('test whether at least one of the deployment and manifest parameter', () => {
//         const testCase = [
//         {   description: 'deployment和manifest同时存在',
//             input: {
//                 accessKey: '', secretKey: '', projectId: '', region: '', namespace: '',
//                 deployment: 'cci-deployment', manifest: './test/deployment-files/test.deployment.manifest.same.yaml',
//                 image: ''
//             }, result: true
//         },
//         {   description: 'deployment存在和manifest不存在',
//             input: {
//                 accessKey: '', secretKey: '', projectId: '', region: '', namespace: '',
//                 deployment: 'cci-deployment', manifest: '',
//                 image: ''
//             }, result: true
//         },
//     ]
//     testCase.forEach(item => {
//         const { description, input, result } = item
//         test(`${description}，返回值为${result}`, () => {
//             jest.spyOn(validator, 'checkAkSk').mockReturnValue(true);
//             jest.spyOn(validator, 'checkProjectId').mockReturnValue(true);
//             jest.spyOn(validator, 'checkRegion').mockReturnValue(true);
//             jest.spyOn(validator, 'checkNamespace').mockReturnValue(true);
//             jest.spyOn(validator, 'checkDeployment').mockReturnValue(true);
//             jest.spyOn(validator, 'checkManifest').mockReturnValue(true);
//             jest.spyOn(validator, 'checkImage').mockReturnValue(true);
//             expect(utils.checkInputs(input)).toBe(result)
//         });
//     })
// })

// describe('test whether the deployment and manifest parameter is same', () => {
//     const testCase = [
//         {   description: 'deployment和manifest同时存在且一致',
//             input: {
//                 accessKey: '', secretKey: '', projectId: '', region: '', namespace: '',
//                 deployment: 'cci-deployment', manifest: './test/deployment-files/test.deployment.manifest.same.yaml',
//                 image: ''
//             }, result: true
//         },
//         {   description: 'deployment和manifest同时存在且不一致',
//             input: {
//                 accessKey: '', secretKey: '', projectId: '', region: '', namespace: '',
//                 deployment: 'cci-deploymendddt', manifest: './test/deployment-files/test.deployment.manifest.same.yaml',
//                 image: ''
//             }, result: false
//         },
//     ]
//     testCase.forEach(item => {
//         const { description, input, result } = item
//         test(`${description}，返回值为${result}`, () => {
//             jest.spyOn(validator, 'checkAkSk').mockReturnValue(true);
//             jest.spyOn(validator, 'checkProjectId').mockReturnValue(true);
//             jest.spyOn(validator, 'checkRegion').mockReturnValue(true);
//             jest.spyOn(validator, 'checkNamespace').mockReturnValue(true);
//             jest.spyOn(validator, 'checkDeployment').mockReturnValue(true);
//             jest.spyOn(validator, 'checkManifest').mockReturnValue(true);
//             jest.spyOn(validator, 'checkImage').mockReturnValue(true);
//             expect(utils.checkInputs(input)).toBe(result)
//         });
//     })
// })

// describe('test get normal random by digit ', () => {
//     const testCase = [
//         { digitNumber: 1},
//         { digitNumber: 8},
//         { digitNumber: 16}
//     ]
//     testCase.forEach(item => {
//         const { digitNumber} = item
//         test(`digitNumber输入为(${digitNumber})`, () => {
//             expect(utils.getRandomByDigit(digitNumber)).toBeLessThanOrEqual(Math.pow(10, digitNumber))
//         });
//     })
// })

// describe('test get invalid random by digit ', () => {
//     const testCase = [
//         { digitNumber: -1},
//         { digitNumber: 0},
//         { digitNumber: 17}
//     ]
//     testCase.forEach(item => {
//         const { digitNumber } = item
//         test(`digitNumber输入为(${digitNumber})`, () => {
//             expect(() => utils.getRandomByDigit(digitNumber)).toThrow(
//                 'Number of digits between 1 and 16.'
//               )
//         });
//     })
// })

describe('test exec command ', () => {
  const testCase = [{command: 'echo hello', result: 'hello'}];
  testCase.forEach(item => {
    const {command, result} = item;
    test(`command输入为(${command})`, async () => {
      expect(await utils.execCommand(command)).toContain(result);
    });
  });
});
