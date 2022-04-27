"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLoadbalancerRequestBody = void 0;
class CreateLoadbalancerRequestBody {
    constructor(loadbalancer) {
        this['loadbalancer'] = loadbalancer;
    }
    withLoadbalancer(loadbalancer) {
        this['loadbalancer'] = loadbalancer;
        return this;
    }
    set _loadbalancer(loadbalancer) {
        this['loadbalancer'] = loadbalancer;
    }
    get _loadbalancer() {
        return this['loadbalancer'];
    }
}
exports.CreateLoadbalancerRequestBody = CreateLoadbalancerRequestBody;
