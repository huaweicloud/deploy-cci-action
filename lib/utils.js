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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkImageList = exports.checkManifest = exports.checkRegion = exports.checkAkSk = exports.checkInputs = void 0;
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
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
 * 检查输入的各参数是否正常
 * @param inputs
 * @returns
 */
function checkInputs(inputs) {
    if (!checkAkSk(inputs)) {
        core.info('ak or sk is not correct.');
        return false;
    }
    if (!checkRegion(inputs.region)) {
        core.info('region is not correct.');
        return false;
    }
    if (!checkManifest(inputs.manifest)) {
        core.info('manifest is not correct.');
        return false;
    }
    if (!checkImageList(inputs)) {
        core.info('image_list is not correct.');
        return false;
    }
    return true;
}
exports.checkInputs = checkInputs;
/**
 * 检查aksk是否合法
 * @param inputs
 * @returns
 */
function checkAkSk(inputs) {
    const akReg = new RegExp('[a-zA-Z0-9]{10,30}$');
    const skReg = new RegExp('[a-zA-Z0-9]{30,50}$');
    return akReg.test(inputs.accessKey) && skReg.test(inputs.secretKey);
}
exports.checkAkSk = checkAkSk;
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
 * 检查manifest文件是否合法
 * @param string
 * @returns
 */
function checkManifest(manifest) {
    const manifestPath = path.resolve(manifest);
    if (!fs.existsSync(manifestPath)) {
        core.info('Manifest file does not exist.');
        return false;
    }
    const mimeType = mime.getType(manifestPath);
    if (mimeType != 'text/yaml') {
        core.info('Manifest file must be yaml/yml file.');
        return false;
    }
    const stat = fs.statSync(manifestPath);
    if (stat.isDirectory()) {
        core.info('Manifest file can not be a directory.');
        return false;
    }
    if (stat.size / 1024 > 20) {
        core.info('The file cannot be larger than 20KB.');
        return false;
    }
    return true;
}
exports.checkManifest = checkManifest;
/**
 * 检查镜像列表是否合法
 * @param string[]
 * @returns
 */
function checkImageList(inputs) {
    const manifestPath = path.resolve(inputs.manifest);
    const data = fs.readFileSync(manifestPath, 'utf8');
    const len = data.split('image: ').length - 1;
    if (len != inputs.imageList.length) {
        core.info('The length of image_list is the same as that of list manifest.');
        return false;
    }
    // cci region和swr region需要一致
    const imageArray = inputs.imageList;
    for (let i = 0; i < imageArray.length; i++) {
        if (new RegExp('swr..{5,20}.myhuaweicloud.com').test(imageArray[i]) &&
            !imageArray[i].includes(inputs.region)) {
            core.info('The regions of cci and swr must be the same.');
            return false;
        }
    }
    return true;
}
exports.checkImageList = checkImageList;