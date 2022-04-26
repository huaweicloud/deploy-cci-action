"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEndpoint = exports.getGlobalCredentials = exports.getBasicCredentials = exports.getRandomByDigit = exports.checkInputs = void 0;
const validator = __importStar(require("./validator"));
const core = __importStar(require("@actions/core"));
const huaweicore = require('@huaweicloud/huaweicloud-sdk-core');
/**
 * 检查输入的各参数是否正常
 * @param inputs
 * @returns
 */
function checkInputs(inputs) {
    if (!validator.checkAkSk(inputs.accessKey, inputs.secretKey)) {
        core.info('ak or sk is not correct.');
        return false;
    }
    if (!validator.checkProjectId(inputs.projectId)) {
        core.info('projectId is not correct.');
        return false;
    }
    if (!validator.checkRegion(inputs.region)) {
        core.info('region is not correct.');
        return false;
    }
    if (!validator.checkNamespace(inputs.namespace)) {
        core.info('namespace is not correct.');
        return false;
    }
    if (!validator.checkDeployment(inputs.deployment)) {
        core.info('deployment is not correct.');
        return false;
    }
    if (!validator.checkManifest(inputs.manifest)) {
        core.info('manifest is not correct.');
        return false;
    }
    // deployment和manifest同时传的时候负载名称需要一致
    if (inputs.manifest) {
        if (!validator.isDeploymentNameConsistent(inputs.deployment, inputs.manifest)) {
            core.info('deployment, manifest parameters must be the same.');
            return false;
        }
    }
    if (!validator.checkImage(inputs.image, inputs.region)) {
        core.info('image is not correct.');
        return false;
    }
    return true;
}
exports.checkInputs = checkInputs;
/**
 * 返回随机数
 * @param number
 * @returns number
 */
function getRandomByDigit(digitNumber) {
    if (digitNumber < 1 || digitNumber > 16) {
        throw new Error('Number of digits between 1 and 16.');
    }
    return Math.round(Math.random() * Math.pow(10, digitNumber));
}
exports.getRandomByDigit = getRandomByDigit;
function getBasicCredentials(inputs) {
    return new huaweicore.BasicCredentials()
        .withAk(inputs.accessKey)
        .withSk(inputs.secretKey)
        .withProjectId(inputs.projectId);
}
exports.getBasicCredentials = getBasicCredentials;
function getGlobalCredentials(inputs) {
    return new huaweicore.GlobalCredentials()
        .withAk(inputs.accessKey)
        .withSk(inputs.secretKey);
}
exports.getGlobalCredentials = getGlobalCredentials;
function getEndpoint(region, endpointServiceName) {
    return "https://" + endpointServiceName + "." + region + ".myhuaweicloud.com";
}
exports.getEndpoint = getEndpoint;
