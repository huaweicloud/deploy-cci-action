import { HcClient } from "@huaweicloud/huaweicloud-sdk-core/HcClient";
import { ClientBuilder } from "@huaweicloud/huaweicloud-sdk-core/ClientBuilder";
import { CreateLoadbalancerRequest } from './model/CreateLoadbalancerRequest';
import { CreateLoadbalancerResponse } from './model/CreateLoadbalancerResponse';

export class ElbClient {
    public static newBuilder(): ClientBuilder<ElbClient> {
        return new ClientBuilder<ElbClient>(newClient);
    }

    private hcClient: HcClient;
    public constructor(client: HcClient) {
        this.hcClient = client;
    }

    public getPath() {
        return __dirname;
    }
    
    /**
     * 创建私网类型的负载均衡器。
     * @param {string} vip_subnet_id 负载均衡器所在的子网ID
     * @param {*} [options] Override http request option.
     */
    public createLoadbalancer(createLoadbalancerRequest?: CreateLoadbalancerRequest): Promise<CreateLoadbalancerResponse> {
        const options = ParamCreater().createLoadbalancer(createLoadbalancerRequest);
        return this.hcClient.sendRequest(options);
    }
}

export const ParamCreater = function () {
    return {
        /**
         * 查询指定namespace下的所有Network对象。
         */
        createLoadbalancer(createLoadbalancerRequest?: CreateLoadbalancerRequest) {
            const options = {
                method: "POST",
                url: "/v2/{project_id}/elb/loadbalancers",
                contentType: "application/json",
                queryParams: {},
                pathParams: {},
                headers: {},
                data: {}
            };
          
            const localVarHeaderParameter = {} as any;

            let body: any;

            if (createLoadbalancerRequest !== null && createLoadbalancerRequest !== undefined) {
                if (createLoadbalancerRequest instanceof CreateLoadbalancerRequest) {
                    body = createLoadbalancerRequest.body
                } else {
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
    }
};

function newClient(client: HcClient): ElbClient {
    return new ElbClient(client);
}
