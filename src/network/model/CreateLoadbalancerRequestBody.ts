import {CreateLoadbalancerLoadbalancerOption} from './CreateLoadbalancerLoadbalancerOption';

export class CreateLoadbalancerRequestBody {
  public loadbalancer: CreateLoadbalancerLoadbalancerOption | undefined;
  public constructor(loadbalancer?: any) {
    this['loadbalancer'] = loadbalancer;
  }
  public withLoadbalancer(
    loadbalancer: CreateLoadbalancerLoadbalancerOption
  ): CreateLoadbalancerRequestBody {
    this['loadbalancer'] = loadbalancer;
    return this;
  }
  public set _loadbalancer(
    loadbalancer: CreateLoadbalancerLoadbalancerOption | undefined
  ) {
    this['loadbalancer'] = loadbalancer;
  }
  public get _loadbalancer() {
    return this['loadbalancer'];
  }
}
