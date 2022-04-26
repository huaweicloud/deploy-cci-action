"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamCreater = exports.ElbClient = void 0;
const ClientBuilder_1 = require("@huaweicloud/huaweicloud-sdk-core/ClientBuilder");
const CreateLoadbalancerRequest_1 = require("./model/CreateLoadbalancerRequest");
class ElbClient {
    constructor(client) {
        this.hcClient = client;
    }
    static newBuilder() {
        return new ClientBuilder_1.ClientBuilder(newClient);
    }
    getPath() {
        return __dirname;
    }
    /**
     * 创建私网类型的负载均衡器。
     * @param {string} vip_subnet_id 负载均衡器所在的子网ID
     * @param {*} [options] Override http request option.
     */
    createLoadbalancer(createLoadbalancerRequest) {
        const options = exports.ParamCreater().createLoadbalancer(createLoadbalancerRequest);
        return this.hcClient.sendRequest(options);
    }
}
exports.ElbClient = ElbClient;
exports.ParamCreater = function () {
    return {
        /**
         * 查询指定namespace下的所有Network对象。
         */
        createLoadbalancer(createLoadbalancerRequest) {
            const options = {
                method: "POST",
                url: "/v2/{project_id}/elb/loadbalancers",
                contentType: "application/json",
                queryParams: {},
                pathParams: {},
                headers: {},
                data: {}
            };
            const localVarHeaderParameter = {};
            let body;
            if (createLoadbalancerRequest !== null && createLoadbalancerRequest !== undefined) {
                if (createLoadbalancerRequest instanceof CreateLoadbalancerRequest_1.CreateLoadbalancerRequest) {
                    body = createLoadbalancerRequest.body;
                }
                else {
                    body = createLoadbalancerRequest['body'];
                }
            }
            if (body === null || body === undefined) {
                throw new Error('Required parameter body was null or undefined when calling body.');
            }
            localVarHeaderParameter['Content-Type'] = 'application/json;charset=UTF-8';
            options.data = body !== undefined ? body : {};
            options.headers = localVarHeaderParameter;
            return options;
        }
    };
};
function newClient(client) {
    return new ElbClient(client);
}
