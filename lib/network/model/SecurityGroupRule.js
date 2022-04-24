"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityGroupRule = void 0;
class SecurityGroupRule {
    constructor(securityGroupId, protocol, multiport) {
        this.direction = "ingress";
        this.ethertype = "IPv4";
        this.remoteIpPrefix = "0.0.0.0/0";
        this.action = "allow";
        this.priority = "1";
        this.securityGroupId = securityGroupId;
        this.protocol = protocol;
        this.multiport = multiport;
    }
}
exports.SecurityGroupRule = SecurityGroupRule;
