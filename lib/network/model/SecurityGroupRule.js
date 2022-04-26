"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityGroupRule = void 0;
const DIRECTION_INGRESS = "ingress";
const IP_ADDRESS_PROTOCOL_TYPE_IPV4 = "IPv4";
const REMOTE_IP_PREFIX = "0.0.0.0/0";
const ACTION_ALLOW = "allow";
const HIGHEST_PRIORITY = "1";
class SecurityGroupRule {
    constructor(securityGroupId, protocol, multiport) {
        this.direction = DIRECTION_INGRESS;
        this.ethertype = IP_ADDRESS_PROTOCOL_TYPE_IPV4;
        this.remoteIpPrefix = REMOTE_IP_PREFIX;
        this.action = ACTION_ALLOW;
        this.priority = HIGHEST_PRIORITY;
        this.securityGroupId = securityGroupId;
        this.protocol = protocol;
        this.multiport = multiport;
    }
}
exports.SecurityGroupRule = SecurityGroupRule;
