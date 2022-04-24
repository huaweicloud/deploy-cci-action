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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCCINetwork = exports.getCCINetworkSubnetID = exports.applyIngress = exports.applyService = exports.applyDeployment = exports.applyNetwork = exports.applyNamespace = exports.isDeploymentExist = exports.isNamespaceExist = exports.getAvailableZone = void 0;
const core = __importStar(require("@actions/core"));
const cp = __importStar(require("child_process"));
const huaweicore = require("@huaweicloud/huaweicloud-sdk-core");
const CciClient_1 = require("./CciClient");
const ListNetworkingCciIoV1beta1NamespacedNetworkRequest_1 = require("./model/ListNetworkingCciIoV1beta1NamespacedNetworkRequest");
const DEFAULT_AVAILABLE_ZONE_MAP = new Map([
    ["cn-north-4", "cn-north-4a"],
    ["cn-east-3", "cn-east-3a"],
    ["cn-east-2", "cn-east-2c"],
    ["cn-south-1", "cn-south-1f"]
]);
/**
 * 获取容器实例的可用区
 * @param inputs
 * @returns
 */
function getAvailableZone(region) {
    if (!DEFAULT_AVAILABLE_ZONE_MAP.has(region)) {
        core.info(`${region}` + ' available zone does not exist.');
    }
    return DEFAULT_AVAILABLE_ZONE_MAP.get(region) || '';
}
exports.getAvailableZone = getAvailableZone;
/**
 * 检查命名空间是否存在
 * @param inputs
 * @returns
 */
function isNamespaceExist(inputs) {
    let isExist = false;
    try {
        const result = cp.execSync(`kubectl get ns | awk '{if (NR > 1) {print $1}}'`).toString();
        if (result.includes(inputs.namespace)) {
            isExist = true;
        }
    }
    catch (error) {
        core.info(`${inputs.namespace}` + ' namespace does not exist.');
        isExist = false;
    }
    return isExist;
}
exports.isNamespaceExist = isNamespaceExist;
/**
 * 检查负载是否存在
 * @param inputs
 * @returns
 */
function isDeploymentExist(inputs) {
    let isExist = false;
    try {
        const result = cp.execSync(`kubectl get deployment -n ${inputs.namespace} | awk '{if (NR > 1) {print $1}}'`).toString();
        if (result.includes(inputs.deployment)) {
            isExist = true;
        }
    }
    catch (error) {
        core.info('xxxx deployment does not exist.');
        isExist = false;
    }
    return isExist;
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
        const result = yield (cp.execSync(`kubectl apply -f ${filePath}`) || '').toString();
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
        const result = yield (cp.execSync(`kubectl apply -f ${filePath} -n ${namespace}`) || '').toString();
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
        const result = yield (cp.execSync(`kubectl apply -f ${filePath} -n ${namespace}`) || '').toString();
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
        const result = yield (cp.execSync(`kubectl apply -f ${filePath} -n ${namespace}`) || '').toString();
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
        const result = yield (cp.execSync(`kubectl apply -f ${filePath} -n ${namespace}`) || '').toString();
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
        if (spec == null && spec == undefined) {
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
        const endpoint = "https://cci." + inputs.region + ".myhuaweicloud.com";
        const credentials = new huaweicore.BasicCredentials()
            .withAk(inputs.accessKey)
            .withSk(inputs.secretKey)
            .withProjectId(inputs.projectId);
        const client = CciClient_1.CciClient.newBuilder()
            .withCredential(credentials)
            .withEndpoint(endpoint)
            .build();
        const request = new ListNetworkingCciIoV1beta1NamespacedNetworkRequest_1.ListNetworkingCciIoV1beta1NamespacedNetworkRequest();
        request.withNamespace(inputs.namespace);
        return yield client.listNetworkingCciIoV1beta1NamespacedNetwork(request);
    });
}
exports.getCCINetwork = getCCINetwork;
