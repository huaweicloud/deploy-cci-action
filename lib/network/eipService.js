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
exports.updatePublicip = exports.createPublicip = void 0;
const core = __importStar(require("@actions/core"));
const utils = __importStar(require("../utils"));
const context = __importStar(require("../context"));
const eip = require("@huaweicloud/huaweicloud-sdk-eip");
/**
 * 购买弹性公网IP
 * @param
 * @returns
 */
function createPublicip(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const bandwidthName = 'bandwidth-' + utils.getRandomByDigit(8);
        const client = eip.EipClient.newBuilder()
            .withCredential(utils.getBasicCredentials(inputs))
            .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
            .build();
        const request = new eip.CreatePublicipRequest();
        const body = new eip.CreatePublicipRequestBody();
        const publicipbody = new eip.CreatePublicipOption();
        publicipbody.withType("5_bgp");
        const bandwidthbody = new eip.CreatePublicipBandwidthOption();
        bandwidthbody.withChargeMode("traffic")
            .withName(bandwidthName)
            .withShareType("PER")
            .withSize(5);
        body.withPublicip(publicipbody);
        body.withBandwidth(bandwidthbody);
        request.withBody(body);
        const result = yield client.createPublicip(request);
        core.info(result);
        if (result.httpStatusCode != 200) {
            core.setFailed('Create Public IP Failed.');
        }
        return Promise.resolve(result.publicip.id);
    });
}
exports.createPublicip = createPublicip;
/**
 * 更新弹性公网IP。更新EIP，将EIP跟一个网卡绑定或者解绑定，转换IP地址版本类型。
 * @param
 * @returns
 */
function updatePublicip(publicipId, portId, inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = eip.EipClient.newBuilder()
            .withCredential(utils.getBasicCredentials(inputs))
            .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
            .build();
        const request = new eip.UpdatePublicipRequest();
        request.publicipId = publicipId;
        const body = new eip.UpdatePublicipsRequestBody();
        const publicipbody = new eip.UpdatePublicipOption();
        publicipbody.withPortId(portId);
        body.withPublicip(publicipbody);
        request.withBody(body);
        const result = yield client.updatePublicip(request);
        core.info(result);
        if (result.httpStatusCode >= 300) {
            core.setFailed('Update Public IP Failed.');
        }
    });
}
exports.updatePublicip = updatePublicip;
