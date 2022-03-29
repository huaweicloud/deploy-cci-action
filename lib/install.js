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
exports.checkCciIamAuthenticator = exports.installCciIamAuthenticator = exports.getAuthDownloadURL = exports.installCciIamAuthenticatorByPlatform = exports.downloadCciIamAuthenticator = void 0;
const core = __importStar(require("@actions/core"));
const os = __importStar(require("os"));
const cp = __importStar(require("child_process"));
function downloadCciIamAuthenticator() {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('start install cci-iam-authenticator');
        const platform = os.platform();
        core.info('platform: ' + platform);
        yield installCciIamAuthenticatorByPlatform(platform);
    });
}
exports.downloadCciIamAuthenticator = downloadCciIamAuthenticator;
/*
 * 针对不同操作系统完成cci-iam-authenticator安装
 * @param platform
 */
function installCciIamAuthenticatorByPlatform(platform) {
    return __awaiter(this, void 0, void 0, function* () {
        const downloadURL = getAuthDownloadURL(platform);
        yield installCciIamAuthenticator(downloadURL);
    });
}
exports.installCciIamAuthenticatorByPlatform = installCciIamAuthenticatorByPlatform;
/*
 * 目前cci-iam-authenticator只支持Linux和darwin
 */
function getAuthDownloadURL(platform) {
    switch (platform.toLowerCase()) {
        case 'linux':
            return 'https://cci-iam-authenticator.obs.cn-north-4.myhuaweicloud.com/latest/linux-amd64/cci-iam-authenticator';
        case 'darwin':
            return 'https://cci-iam-authenticator-all-arch.obs.cn-south-1.myhuaweicloud.com/darwin-amd64/cci-iam-authenticator';
        default:
            throw new Error('The cci-iam-authenticator supports only Linux and Darwin platforms.');
    }
}
exports.getAuthDownloadURL = getAuthDownloadURL;
function installCciIamAuthenticator(downloadURL) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (cp.execSync(`curl -LO "${downloadURL}"   && chmod +x ./cci-iam-authenticator && mv ./cci-iam-authenticator /usr/local/bin`) || '').toString();
        // 检查是否下载安装成功cci-iam-authenticator
        yield checkCciIamAuthenticator();
    });
}
exports.installCciIamAuthenticator = installCciIamAuthenticator;
/*
 * 检查是否下载安装成功cci-iam-authenticator
 */
function checkCciIamAuthenticator() {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('check download cci-iam-authenticator result.');
        const checkResult = yield (cp.execSync(`cci-iam-authenticator --help`) || '').toString();
        core.info('check download cci-iam-authenticator result: ' + checkResult);
    });
}
exports.checkCciIamAuthenticator = checkCciIamAuthenticator;
