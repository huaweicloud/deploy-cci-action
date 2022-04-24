export class LoadbalancerResp {
    private 'tenant_id'?: string | undefined;
    private name?: string | undefined;
    private description?: string | undefined;
    private 'vip_subnet_id'?: string | undefined;
    private 'vip_address'?: string | undefined;
    private provider?: string | undefined;
    private 'admin_state_up'?: string | undefined;
    private 'enterprise_project_id'?: string | undefined;
    public 'vip_port_id'?: string | undefined;
    public id?: string | undefined;

    public constructor(vipSubnetId?: any) { 
        this['vip_subnet_id'] = vipSubnetId;
    }
    public withTenantId(tenantId: string): LoadbalancerResp {
        this['tenant_id'] = tenantId;
        return this;
    }
    public set tenantId(tenantId: string | undefined) {
        this['tenant_id'] = tenantId;
    }
    public get tenantId() {
        return this['tenant_id'];
    }
    public withName(name: string): LoadbalancerResp {
        this['name'] = name;
        return this;
    }
    public set _name(name: string | undefined) {
        this['name'] = name;
    }
    public get _name() {
        return this['name'];
    }    
    public withDescription(description: string): LoadbalancerResp {
        this['description'] = description;
        return this;
    }
    public set _description(description: string | undefined) {
        this['description'] = description;
    }
    public get _description() {
        return this['description'];
    }
    public withVipSubnetId(vipSubnetId: string): LoadbalancerResp {
        this['vip_subnet_id'] = vipSubnetId;
        return this;
    }
    public set vipSubnetId(vipSubnetId: string | undefined) {
        this['vip_subnet_id'] = vipSubnetId;
    }
    public get vipSubnetId() {
        return this['vip_subnet_id'];
    }
    public withVipAddress(vipAddress: string): LoadbalancerResp {
        this['vip_address'] = vipAddress;
        return this;
    }
    public set vipAddress(vipAddress: string | undefined) {
        this['vip_address'] = vipAddress;
    }
    public get vipAddress() {
        return this['vip_address'];
    }
    public withProvider(provider: string): LoadbalancerResp {
        this['provider'] = provider;
        return this;
    }
    public set _provider(provider: string | undefined) {
        this['provider'] = provider;
    }
    public get _provider() {
        return this['provider'];
    }
    public withAdminStateUp(adminStateUp: string): LoadbalancerResp {
        this['admin_state_up'] = adminStateUp;
        return this;
    }
    public set adminStateUp(adminStateUp: string | undefined) {
        this['admin_state_up'] = adminStateUp;
    }
    public get adminStateUp() {
        return this['admin_state_up'];
    }
    public withEnterpriseProjectId(enterpriseProjectId: string): LoadbalancerResp {
        this['enterprise_project_id'] = enterpriseProjectId;
        return this;
    }
    public set enterpriseProjectId(enterpriseProjectId: string | undefined) {
        this['enterprise_project_id'] = enterpriseProjectId;
    }
    public get enterpriseProjectId() {
        return this['enterprise_project_id'];
    }
    public withVipPortId(vipPortId: string): LoadbalancerResp {
        this['vip_port_id'] = vipPortId;
        return this;
    }
    public set vipPortId(vipPortId: string | undefined) {
        this['vip_port_id'] = vipPortId;
    }
    public get vipPortId() {
        return this['vip_port_id'];
    }
    public withId(id: string): LoadbalancerResp {
        this['id'] = id;
        return this;
    }
}
