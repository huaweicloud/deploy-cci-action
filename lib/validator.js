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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkImage = exports.isDeploymentNameConsistent = exports.checkManifest = exports.checkDeployment = exports.checkNamespace = exports.checkRegion = exports.checkProjectId = exports.checkAkSk = void 0;
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const path = __importStar(require("path"));
const mime = __importStar(require("mime"));
/**
 * 目前支持云容器实例CCI功能的region列表
 * 华北-北京四	cn-north-4
 * 华东-上海二	cn-east-2
 * 华东-上海一	cn-east-3
 * 华南-广州	cn-south-1
 */
const regionArray = [
    'cn-north-4',
    'cn-east-2',
    'cn-east-3',
    'cn-south-1'
];
/**
 * 检查aksk是否合法
 * @param inputs
 * @returns
 */
function checkAkSk(accessKey, secretKey) {
    const akReg = new RegExp('^[a-zA-Z0-9]{10,30}$');
    const skReg = new RegExp('^[a-zA-Z0-9]{30,50}$');
    return akReg.test(accessKey) && skReg.test(secretKey);
}
exports.checkAkSk = checkAkSk;
/**
 * 检查projectId是否合法
 * @param projectId
 * @returns
 */
function checkProjectId(projectId) {
    const projectIdReg = new RegExp('^[a-zA-Z0-9]{16,64}$');
    return projectIdReg.test(projectId);
}
exports.checkProjectId = checkProjectId;
/**
 * 检查region是否合法
 * @param inputs
 * @returns
 */
function checkRegion(region) {
    return regionArray.includes(region);
}
exports.checkRegion = checkRegion;
/**
 * 检查namespace是否合法
 * @param namespace
 * @returns
 */
function checkNamespace(namespace) {
    const namespaceReg1 = new RegExp(/^[a-z0-9]{1}[a-z0-9\\-]{0,61}[a-z0-9]{1}$/);
    const namespaceReg2 = new RegExp(/^[a-z0-9]$/);
    return namespaceReg1.test(namespace) || namespaceReg2.test(namespace);
}
exports.checkNamespace = checkNamespace;
/**
 * 检查deployment是否合法
 * @param deployment
 * @returns
 */
function checkDeployment(deployment) {
    const deploymentReg1 = new RegExp(/^[a-z0-9][a-z0-9-.]{0,61}[a-z0-9]$/);
    const deploymentReg2 = new RegExp(/^[a-z0-9]$/);
    const isSpecialCharacterConnector = deployment.includes("..") || deployment.includes(".-") || deployment.includes("-.");
    return (deploymentReg1.test(deployment) || deploymentReg2.test(deployment)) && !isSpecialCharacterConnector;
}
exports.checkDeployment = checkDeployment;
/**
 * 检查manifest文件是否合法
 * @param string
 * @returns
 */
function checkManifest(manifest) {
    if (manifest) {
        const manifestPath = path.resolve(manifest);
        if (!fs.existsSync(manifestPath)) {
            core.info('Manifest file does not exist.');
            return false;
        }
        const stat = fs.statSync(manifestPath);
        if (stat.isDirectory()) {
            core.info('Manifest file can not be a directory.');
            return false;
        }
        const mimeType = mime.getType(manifestPath);
        if (mimeType != 'text/yaml') {
            core.info('Manifest file must be yaml/yml file.');
            return false;
        }
        if (stat.size / 1024 > 20 || stat.size <= 0) {
            core.info('The file cannot be larger than 20KB.');
            return false;
        }
    }
    return true;
}
exports.checkManifest = checkManifest;
/**
 * 检查负载参数一致
 * @param deployment
 * @returns
 */
function isDeploymentNameConsistent(deployment, manifest) {
    const file = fs.readFileSync(manifest, 'utf8');
    const obsJson = yaml_1.default.parse(file);
    const metadata = obsJson.metadata;
    if (metadata == null && metadata == undefined) {
        core.info('manifest file is not correct.');
        return false;
    }
    const deploymentName = metadata.name;
    if (deploymentName == null && deploymentName == undefined) {
        core.info('manifest file is not correct.');
        return false;
    }
    if (deployment != obsJson.metadata.name) {
        core.info('deployment, manifest parameters must be the same.');
        return false;
    }
    return true;
}
exports.isDeploymentNameConsistent = isDeploymentNameConsistent;
/**
 * 检查镜像是否合法
 * @param inputs
 * @returns
 */
function checkImage(image, region) {
    if (new RegExp('swr..{5,20}.myhuaweicloud.com').test(image)) {
        if (image.indexOf(region) == -1) {
            core.info('The region of cci and swr must be the same.');
            return false;
        }
    }
    return true;
}
exports.checkImage = checkImage;
