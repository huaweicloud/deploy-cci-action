"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLoadbalancerResponse = void 0;
const SdkResponse_1 = require("@huaweicloud/huaweicloud-sdk-core/SdkResponse");
class CreateLoadbalancerResponse extends SdkResponse_1.SdkResponse {
    constructor() {
        super();
    }
    withLoadbalancer(loadbalancer) {
        this['loadbalancer'] = loadbalancer;
        return this;
    }
}
exports.CreateLoadbalancerResponse = CreateLoadbalancerResponse;
