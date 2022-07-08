import * as validator from '../src/validator';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('test whether the aksk parameter is valid', () => {
  const testCase = [
    {
      accessKey: '1234567890',
      secretKey: '123456789012345678901234567890',
      result: true
    },
    {accessKey: '', secretKey: '', result: false},
    {accessKey: '', secretKey: '123456789012345678901234567890', result: false},
    {accessKey: '1234567890', secretKey: '', result: false},
    {
      accessKey: '12345',
      secretKey: '123456789012345678901234567890',
      result: false
    },
    {accessKey: '1234567890', secretKey: '1234567890', result: false},
    {
      accessKey: '1234567890123456789012345678901',
      secretKey: '123456789012345678901234567890123456789012345678901',
      result: false
    },
    {
      accessKey: '1234567890123456789012345678901',
      secretKey: '123456789012345678901234567890',
      result: false
    },
    {
      accessKey: '1234567890',
      secretKey: '123456789012345678901234567890123456789012345678901',
      result: false
    },
    {
      accessKey: '1234%^890',
      secretKey: '1234567890123456#$12345678901234567890',
      result: false
    }
  ];
  testCase.forEach(item => {
    const {accessKey, secretKey, result} = item;
    test(`AK,SK输入为(${accessKey})and(${secretKey})，返回值为${result}`, () => {
      expect(validator.checkAkSk(accessKey, secretKey)).toBe(result);
    });
  });
});

describe('test whether the projectId parameter is valid', () => {
  const testCase = [
    {projectId: '1234567890123456', result: true},
    {projectId: '1234567890', result: false},
    {
      projectId:
        '12345678901234567890123456789012345678901234567890123456789012345',
      result: false
    },
    {projectId: '123456789&0123456', result: false}
  ];
  testCase.forEach(item => {
    const {projectId, result} = item;
    test(`region输入为(${projectId})，返回值为${result}`, () => {
      expect(validator.checkProjectId(projectId)).toBe(result);
    });
  });
});

describe('test whether the region parameter is valid', () => {
  const testCase = [
    {region: 'cn-north-4', result: true},
    {region: 'cn-east-2', result: true},
    {region: 'cn-east-3', result: true},
    {region: 'cn-south-1', result: true},
    {region: 'cn-north-1', result: false},
    {region: 'ap-southeastst', result: false},
    {region: 'dsdasa', result: false}
  ];
  testCase.forEach(item => {
    const {region, result} = item;
    test(`region输入为(${region})，返回值为${result}`, () => {
      expect(validator.checkRegion(region)).toBe(result);
    });
  });
});

describe('test whether the namespace parameter is valid', () => {
  const testCase = [
    {namespace: '1', result: true},
    {namespace: 'f', result: true},
    {namespace: 'dd-dfd3', result: true},
    {namespace: '-dhk', result: false},
    {namespace: 'sds-', result: false},
    {namespace: 'dd.dfd3', result: false},
    {
      namespace:
        'dd-123456789012345678901234567890123456789012345678901234567890d',
      result: false
    }
  ];
  testCase.forEach(item => {
    const {namespace, result} = item;
    test(`namespace输入为(${namespace})，返回值为${result}`, () => {
      expect(validator.checkNamespace(namespace)).toBe(result);
    });
  });
});

describe('test whether the deployment parameter is valid', () => {
  const testCase = [
    {deployment: '1', result: true},
    {deployment: 'f', result: true},
    {deployment: 'dd-dfd3', result: true},
    {deployment: '-dhk', result: false},
    {deployment: 'sds-', result: false},
    {deployment: 'dd.dfd3', result: true},
    {deployment: 'dd.-fd3', result: false},
    {deployment: 'dd-.fd3', result: false},
    {deployment: 'dd..fd3', result: false},
    {
      deployment:
        'dd-123456789012345678901234567890123456789012345678901234567890d',
      result: false
    }
  ];
  testCase.forEach(item => {
    const {deployment, result} = item;
    test(`deployment输入为(${deployment})，返回值为${result}`, () => {
      expect(validator.checkDeployment(deployment)).toBe(result);
    });
  });
});

describe('test whether the manifest parameter is valid', () => {
  const testCase = [
    {
      description: '文件存在且内容合法',
      manifest: './test/deployment-files/test.manifest.yaml',
      result: true
    },
    {
      description: '文件不存在',
      manifest: './test/deployment-files/no-exist-file',
      result: false
    },
    {
      description: '文件类型不正确',
      manifest: './test/deployment-files/test.manifest.txt',
      result: false
    },
    {
      description: 'manifest为文件夹',
      manifest: './test/deployment-files/test.manifest.yml',
      result: false
    },
    {
      description: 'manifest大于20KB',
      manifest: './test/deployment-files/test.manifest.large.yml',
      result: false
    },
    {
      description: 'manifest大小0KB',
      manifest: './test/deployment-files/test.manifest.zero.yml',
      result: false
    }
  ];
  testCase.forEach(item => {
    const {description, manifest, result} = item;
    test(`${description}，返回值为${result}`, () => {
      expect(validator.checkManifest(manifest)).toBe(result);
    });
  });
});

describe('test whether the imageList parameter is valid', () => {
  const testCase = [
    {
      description: '镜像地址非swr地址',
      region: '',
      image: 'nginx:latest',
      result: true
    },
    {
      description: '镜像region和cci的region不一致',
      region: 'cn-north-4',
      image: 'swr.cn-south-1.myhuaweicloud.com/demo-test/demo:v1.2',
      result: false
    },
    {
      description: 'swr镜像地址不合法-字符开头不是swr.',
      region: 'cn-north-4',
      image: 'swrcn-north-4.myhuaweicloud.com/demo-test/demo:v1.2',
      result: false
    },
    {
      description: 'swr镜像地址不合法-域名不对',
      region: 'cn-north-4',
      image: 'swrcn-north-4myhuaweicloudcom/demo-test/demo:v1.2',
      result: false
    }
  ];
  testCase.forEach(item => {
    const {description, region, image, result} = item;
    test(`${description}，返回值为${result}`, () => {
      expect(validator.checkImage(image, region)).toBe(result);
    });
  });
});
