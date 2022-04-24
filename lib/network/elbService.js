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
exports.createLoadbalancer = exports.getLoadbalancerIdByLoadbalancer = exports.getLoadbalancerVipPortIdByLoadbalancer = void 0;
const utils = __importStar(require("../utils"));
const context = __importStar(require("../context"));
const huaweicore = require("@huaweicloud/huaweicloud-sdk-core");
const ElbClient_1 = require("./ElbClient");
const CreateLoadbalancerRequest_1 = require("./model/CreateLoadbalancerRequest");
const CreateLoadbalancerRequestBody_1 = require("./model/CreateLoadbalancerRequestBody");
const CreateLoadbalancerLoadbalancerOption_1 = require("./model/CreateLoadbalancerLoadbalancerOption");
/**
 * 获取负载均衡器的VipPortId
 * @param LoadbalancerResponse
 * @returns
 */
function getLoadbalancerVipPortIdByLoadbalancer(createLoadbalancerResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        let loadbalancerResp;
        if (createLoadbalancerResponse !== null && createLoadbalancerResponse !== undefined) {
            loadbalancerResp = createLoadbalancerResponse.loadbalancer;
        }
        let vipPortId;
        if (loadbalancerResp !== null && loadbalancerResp !== undefined) {
            vipPortId = loadbalancerResp.vip_port_id;
        }
        if (vipPortId == null && vipPortId == undefined) {
            throw new Error('Get Loadbanlancer vipPortId Faild: ' + JSON.stringify(loadbalancerResp));
        }
        return Promise.resolve(vipPortId || '');
    });
}
exports.getLoadbalancerVipPortIdByLoadbalancer = getLoadbalancerVipPortIdByLoadbalancer;
/**
 * 获取负载均衡器的id
 * @param LoadbalancerResponse
 * @returns
 */
function getLoadbalancerIdByLoadbalancer(createLoadbalancerResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        let loadbalancerResp;
        if (createLoadbalancerResponse !== null && createLoadbalancerResponse !== undefined) {
            loadbalancerResp = createLoadbalancerResponse.loadbalancer;
        }
        let id;
        if (loadbalancerResp !== null && loadbalancerResp !== undefined) {
            id = loadbalancerResp.id;
        }
        if (id == null && id == undefined) {
            throw new Error('get Loadbanlancer ID Faild: ' + JSON.stringify(loadbalancerResp));
        }
        return Promise.resolve(id || '');
    });
}
exports.getLoadbalancerIdByLoadbalancer = getLoadbalancerIdByLoadbalancer;
/**
 * 创建私网类型的负载均衡器
 * @param inputs
 * @returns
 */
function createLoadbalancer(vipSubnetId) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputs = context.getInputs();
        const endpoint = "https://elb." + inputs.region + ".myhuaweicloud.com";
        const credentials = new huaweicore.BasicCredentials()
            .withAk(inputs.accessKey)
            .withSk(inputs.secretKey)
            .withProjectId(inputs.projectId);
        const client = ElbClient_1.ElbClient.newBuilder()
            .withCredential(credentials)
            .withEndpoint(endpoint)
            .build();
        const request = new CreateLoadbalancerRequest_1.CreateLoadbalancerRequest();
        const body = new CreateLoadbalancerRequestBody_1.CreateLoadbalancerRequestBody();
        const loadbalancerbody = new CreateLoadbalancerLoadbalancerOption_1.CreateLoadbalancerLoadbalancerOption();
        loadbalancerbody.withName("elb-" + utils.getRandomByDigit(8))
            .withVipSubnetId(vipSubnetId);
        body.withLoadbalancer(loadbalancerbody);
        request.withBody(body);
        return yield client.createLoadbalancer(request);
    });
}
exports.createLoadbalancer = createLoadbalancer;
