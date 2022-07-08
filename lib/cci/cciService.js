"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCCINetwork = exports.getCCINetworkSubnetID = exports.applyIngress = exports.applyService = exports.applyDeployment = exports.applyNetwork = exports.applyNamespace = exports.isDeploymentExist = exports.isNamespaceExist = exports.updateImage = exports.updateDeployment = exports.createDeployment = exports.createOrUpdateDeployment = exports.createNamespace = exports.getAvailableZone = void 0;
const core = __importStar(require("@actions/core"));
const yaml_1 = __importDefault(require("yaml"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const context = __importStar(require("../context"));
const utils = __importStar(require("../utils"));
const vpc = __importStar(require("../network/vpcService"));
const iam = __importStar(require("../iam/iamService"));
const eip = __importStar(require("../network/eipService"));
const elb = __importStar(require("../network/elbService"));
const CciClient_1 = require("./CciClient");
const Namespace_1 = require("./manifest/Namespace");
const Network_1 = require("./manifest/Network");
const Deployment_1 = require("./manifest/Deployment");
const Service_1 = require("./manifest/Service");
const Ingress_1 = require("./manifest/Ingress");
const ListNetworkingCciIoV1beta1NamespacedNetworkRequest_1 = require("./model/ListNetworkingCciIoV1beta1NamespacedNetworkRequest");
const ReadCoreV1NamespaceRequest_1 = require("./model/ReadCoreV1NamespaceRequest");
const DEFAULT_AVAILABLE_ZONE_MAP = new Map([
    ['cn-north-4', 'cn-north-4a'],
    ['cn-east-3', 'cn-east-3a'],
    ['cn-east-2', 'cn-east-2c'],
    ['cn-south-1', 'cn-south-1f']
]);
/**
 * 获取容器实例的可用区
 * @param inputs
 * @returns
 */
function getAvailableZone(region) {
    if (!DEFAULT_AVAILABLE_ZONE_MAP.has(region)) {
        core.info(`${region} available zone does not exist.`);
    }
    return DEFAULT_AVAILABLE_ZONE_MAP.get(region) || '';
}
exports.getAvailableZone = getAvailableZone;
/**
 * 创建命名空间时会关联已有VPC或创建一个新的VPC
 * @param inputs
 * @returns
 */
function createNamespace(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield isNamespaceExist(inputs))) {
            // 新建Namespace
            const namespaceFileName = 'namespace-' + utils.getRandomByDigit(8) + '.yml';
            const namespaceContent = new Namespace_1.Namespace(inputs.namespace);
            fs.writeFileSync(namespaceFileName, yaml_1.default.stringify(namespaceContent), 'utf8');
            core.info(yield utils.execCommand('cat ' + namespaceFileName));
            applyNamespace(namespaceFileName);
            // 新建Network
            const securityGroupId = yield vpc.listDefaultCCISecurityGroups(inputs);
            const domainId = yield iam.keystoneListAuthDomains(inputs);
            const availableZone = getAvailableZone(inputs.region);
            const networkFileName = 'network-' + utils.getRandomByDigit(8) + '.yml';
            const vpcId = yield vpc.createVpc(inputs);
            const subnetInfo = yield vpc.createSubnet(vpcId);
            const networkContent = new Network_1.Network(inputs.namespace, securityGroupId, domainId, inputs.projectId, availableZone, subnetInfo.cidr, vpcId, subnetInfo.neutron_network_id, subnetInfo.neutron_subnet_id);
            fs.writeFileSync(networkFileName, yaml_1.default.stringify(networkContent), 'utf8');
            applyNetwork(networkFileName, inputs.namespace);
        }
    });
}
exports.createNamespace = createNamespace;
/**
 * 负载创建或者更新
 * @param inputs
 * @returns
 */
function createOrUpdateDeployment(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield isDeploymentExist(inputs))) {
            core.info('deployment does not exist.');
            yield createDeployment(inputs);
        }
        else {
            yield updateDeployment(inputs);
        }
    });
}
exports.createOrUpdateDeployment = createOrUpdateDeployment;
/**
 * 负载创建
 * @param inputs
 * @returns
 */
function createDeployment(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (inputs.manifest) {
            // 根据用户yaml文件新建Deployment
            // 替换镜像地址
            yield updateImage(inputs.manifest, inputs.image);
            applyDeployment(inputs.manifest, inputs.namespace);
        }
        else {
            const deployFileName = 'deployment-' + utils.getRandomByDigit(8) + '.yml';
            const deployContent = new Deployment_1.Deployment(inputs);
            fs.writeFileSync(deployFileName, yaml_1.default.stringify(deployContent), 'utf8');
            applyDeployment(deployFileName, inputs.namespace);
        }
        // 新建vip
        const publicipId = yield eip.createPublicip(inputs);
        const subnetID = yield getCCINetworkSubnetID(inputs);
        const loadbalancer = yield elb.createLoadbalancer(subnetID, inputs);
        const vipPortId = yield elb.getLoadbalancerVipPortIdByLoadbalancer(loadbalancer);
        yield eip.updatePublicip(publicipId, vipPortId, inputs);
        // 新建Service
        const elbId = yield elb.getLoadbalancerIdByLoadbalancer(loadbalancer);
        const serviceFileName = 'service-' + utils.getRandomByDigit(8) + '.yml';
        const serviceContent = new Service_1.Service(inputs, elbId);
        fs.writeFileSync(serviceFileName, yaml_1.default.stringify(serviceContent), 'utf8');
        applyService(serviceFileName, inputs.namespace);
        // 新建Ingress
        const ingressFileName = 'ingress-' + utils.getRandomByDigit(8) + '.yml';
        const ingressContent = new Ingress_1.Ingress(inputs, elbId);
        fs.writeFileSync(ingressFileName, yaml_1.default.stringify(ingressContent), 'utf8');
        applyIngress(ingressFileName, inputs.namespace);
    });
}
exports.createDeployment = createDeployment;
/**
 * 更新创建
 * @param inputs
 * @returns
 */
function updateDeployment(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (inputs.manifest) {
            // 根据用户yaml文件更新Deployment
            // 替换镜像地址
            yield updateImage(inputs.manifest, inputs.image);
            applyDeployment(inputs.manifest, inputs.namespace);
        }
        else {
            // 获取镜像名称
            const result = yield utils.execCommand('kubectl get deployment ' +
                inputs.deployment +
                " -o=jsonpath='{$.spec.template.spec.containers[0].name}' -n " +
                inputs.namespace);
            // 更新镜像
            yield utils.execCommand('kubectl set image deploy ' +
                inputs.deployment +
                ' ' +
                result +
                '=' +
                inputs.image +
                ' -n ' +
                inputs.namespace);
        }
    });
}
exports.updateDeployment = updateDeployment;
/*
 * 更新k8s模板文件的镜像url
 */
function updateImage(filePath, image) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('update manifest file');
        const manifestPath = path.resolve(filePath);
        const data = fs.readFileSync(manifestPath, 'utf8');
        const placeholder = data.replace(RegExp(/image: .*/), "image: '" + image + "'");
        fs.writeFileSync(manifestPath, placeholder, 'utf8');
    });
}
exports.updateImage = updateImage;
/**
 * 检查命名空间是否存在
 * @param namespace
 * @returns
 */
function isNamespaceExist(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        let isExist = false;
        const client = CciClient_1.CciClient.newBuilder()
            .withCredential(utils.getBasicCredentials(inputs))
            .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.CCI))
            .withOptions({ customUserAgent: context.CUSTOM_USER_AGENT })
            .build();
        const request = new ReadCoreV1NamespaceRequest_1.ReadCoreV1NamespaceRequest();
        request.withNamespace(inputs.namespace);
        const result = yield client.readCoreV1Namespace(request);
        if (result.httpStatusCode === 200) {
            isExist = true;
        }
        return isExist;
    });
}
exports.isNamespaceExist = isNamespaceExist;
/**
 * 检查负载是否存在
 * @param inputs
 * @returns
 */
function isDeploymentExist(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        let isExist = false;
        try {
            const result = yield utils.execCommand('kubectl get deployment -n ' +
                inputs.namespace +
                " | awk '{if (NR > 1) {print $1}}'");
            if (result.includes(inputs.deployment)) {
                isExist = true;
            }
        }
        catch (error) {
            core.info(inputs.deployment + ' deployment does not exist.');
            isExist = false;
        }
        return isExist;
    });
}
exports.isDeploymentExist = isDeploymentExist;
/**
 * 新建或者升级Namespace
 * @param inputs
 * @returns
 */
function applyNamespace(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('start apply namespace');
        const result = yield utils.execCommand('kubectl apply -f ' + filePath);
        core.info('deploy cci namespace result: ' + result);
    });
}
exports.applyNamespace = applyNamespace;
/**
 * 新建或者升级Network
 * @param inputs
 * @returns
 */
function applyNetwork(filePath, namespace) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('start apply network');
        const result = yield utils.execCommand('kubectl apply -f ' + filePath + ' -n ' + namespace);
        core.info('deploy cci network result: ' + result);
    });
}
exports.applyNetwork = applyNetwork;
/**
 * 新建或者升级负载
 * @param inputs
 * @returns
 */
function applyDeployment(filePath, namespace) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('start apply deployment');
        const result = yield utils.execCommand('kubectl apply -f ' + filePath + ' -n ' + namespace);
        core.info('deploy cci result: ' + result);
    });
}
exports.applyDeployment = applyDeployment;
/**
 * 新建或者升级Service
 * @param string
 * @returns
 */
function applyService(filePath, namespace) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('start apply Service');
        const result = yield utils.execCommand('kubectl apply -f ' + filePath + ' -n ' + namespace);
        core.info('deploy cci Service result: ' + result);
    });
}
exports.applyService = applyService;
/**
 * 新建或者升级Ingress
 * @param string
 * @returns
 */
function applyIngress(filePath, namespace) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('start apply Ingress');
        const result = yield utils.execCommand('kubectl apply -f ' + filePath + ' -n ' + namespace);
        core.info('deploy cci Ingress result: ' + result);
    });
}
exports.applyIngress = applyIngress;
/**
 * 查询cci指定Network的子网ID
 * @param inputs
 * @returns
 */
function getCCINetworkSubnetID(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield getCCINetwork(inputs);
        const items = result.items;
        let itemResp;
        if (items !== null && items !== undefined) {
            itemResp = items[0];
        }
        let spec;
        if (itemResp !== null && itemResp !== undefined) {
            spec = itemResp.spec;
        }
        let subnetID;
        if (spec !== null && spec !== undefined) {
            subnetID = spec.subnetID;
        }
        if (subnetID === null || subnetID == undefined) {
            throw new Error('Get CCINetwork SubnetID Faild: ' + JSON.stringify(result));
        }
        return Promise.resolve(subnetID || '');
    });
}
exports.getCCINetworkSubnetID = getCCINetworkSubnetID;
/**
 * 查询cci指定Network对象
 * @param inputs
 * @returns
 */
function getCCINetwork(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = CciClient_1.CciClient.newBuilder()
            .withCredential(utils.getBasicCredentials(inputs))
            .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.CCI))
            .withOptions({ customUserAgent: context.CUSTOM_USER_AGENT })
            .build();
        const request = new ListNetworkingCciIoV1beta1NamespacedNetworkRequest_1.ListNetworkingCciIoV1beta1NamespacedNetworkRequest();
        request.withNamespace(inputs.namespace);
        return yield client.listNetworkingCciIoV1beta1NamespacedNetwork(request);
    });
}
exports.getCCINetwork = getCCINetwork;
