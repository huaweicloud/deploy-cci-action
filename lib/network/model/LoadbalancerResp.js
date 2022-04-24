"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadbalancerResp = void 0;
class LoadbalancerResp {
    constructor(vipSubnetId) {
        this['vip_subnet_id'] = vipSubnetId;
    }
    withTenantId(tenantId) {
        this['tenant_id'] = tenantId;
        return this;
    }
    set tenantId(tenantId) {
        this['tenant_id'] = tenantId;
    }
    get tenantId() {
        return this['tenant_id'];
    }
    withName(name) {
        this['name'] = name;
        return this;
    }
    set _name(name) {
        this['name'] = name;
    }
    get _name() {
        return this['name'];
    }
    withDescription(description) {
        this['description'] = description;
        return this;
    }
    set _description(description) {
        this['description'] = description;
    }
    get _description() {
        return this['description'];
    }
    withVipSubnetId(vipSubnetId) {
        this['vip_subnet_id'] = vipSubnetId;
        return this;
    }
    set vipSubnetId(vipSubnetId) {
        this['vip_subnet_id'] = vipSubnetId;
    }
    get vipSubnetId() {
        return this['vip_subnet_id'];
    }
    withVipAddress(vipAddress) {
        this['vip_address'] = vipAddress;
        return this;
    }
    set vipAddress(vipAddress) {
        this['vip_address'] = vipAddress;
    }
    get vipAddress() {
        return this['vip_address'];
    }
    withProvider(provider) {
        this['provider'] = provider;
        return this;
    }
    set _provider(provider) {
        this['provider'] = provider;
    }
    get _provider() {
        return this['provider'];
    }
    withAdminStateUp(adminStateUp) {
        this['admin_state_up'] = adminStateUp;
        return this;
    }
    set adminStateUp(adminStateUp) {
        this['admin_state_up'] = adminStateUp;
    }
    get adminStateUp() {
        return this['admin_state_up'];
    }
    withEnterpriseProjectId(enterpriseProjectId) {
        this['enterprise_project_id'] = enterpriseProjectId;
        return this;
    }
    set enterpriseProjectId(enterpriseProjectId) {
        this['enterprise_project_id'] = enterpriseProjectId;
    }
    get enterpriseProjectId() {
        return this['enterprise_project_id'];
    }
    withVipPortId(vipPortId) {
        this['vip_port_id'] = vipPortId;
        return this;
    }
    set vipPortId(vipPortId) {
        this['vip_port_id'] = vipPortId;
    }
    get vipPortId() {
        return this['vip_port_id'];
    }
    withId(id) {
        this['id'] = id;
        return this;
    }
}
exports.LoadbalancerResp = LoadbalancerResp;
