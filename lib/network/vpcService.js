"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.createSubnet = exports.createVpc = exports.createDefaultCCISecurityGroupRule = exports.createDefaultCCISecurityGroups = exports.listDefaultCCISecurityGroups = void 0;
const core = __importStar(require("@actions/core"));
const context = __importStar(require("../context"));
const utils = __importStar(require("../utils"));
const vpc = require('@huaweicloud/huaweicloud-sdk-vpc');
const vpcv3 = require("@huaweicloud/huaweicloud-sdk-vpc/v3/public-api");
const SecurityGroupRule_1 = require("./model/SecurityGroupRule");
const DAFAULT_CIDR = '192.168.0.0/16';
const DEFAULT_SUBNET_CIDR = '192.168.0.0/18';
const DEFAULT_GATEWAY_IP = '192.168.0.1';
const DEFAULT_SECURITY_GROUP = 'kubernetes.io-default-sg';
/**
 * 查询某租户下默认的安全组列表
 * @param
 * @returns
 */
function listDefaultCCISecurityGroups(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = vpcv3.VpcClient.newBuilder()
            .withCredential(utils.getBasicCredentials(inputs))
            .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
            .build();
        const request = new vpcv3.ListSecurityGroupsRequest();
        const listRequestName = [];
        listRequestName.push(DEFAULT_SECURITY_GROUP);
        request.name = listRequestName;
        const result = yield client.listSecurityGroups(request);
        const obj = JSON.parse(JSON.stringify(result));
        if (obj.httpStatusCode >= 300) {
            core.setFailed('List Security Groups Failed.');
        }
        const securityGroups = obj.security_groups;
        if (securityGroups instanceof Array) {
            if (securityGroups.length <= 0) {
                const securityGroupId = yield createDefaultCCISecurityGroups(inputs);
                yield createDefaultCCISecurityGroupRule(securityGroupId, inputs);
                return Promise.resolve(securityGroupId);
            }
            const id = securityGroups[0].id;
            if (typeof id == 'string') {
                return Promise.resolve(id);
            }
        }
        throw new Error('List Security Groups Failed.');
    });
}
exports.listDefaultCCISecurityGroups = listDefaultCCISecurityGroups;
/**
 * 创建安全组
 * @param
 * @returns
 */
function createDefaultCCISecurityGroups(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = vpc.VpcClient.newBuilder()
            .withCredential(utils.getBasicCredentials(inputs))
            .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
            .build();
        const request = new vpc.CreateSecurityGroupRequest();
        const body = new vpc.CreateSecurityGroupRequestBody();
        const securityGroupbody = new vpc.CreateSecurityGroupOption();
        securityGroupbody.withName(DEFAULT_SECURITY_GROUP);
        body.withSecurityGroup(securityGroupbody);
        request.withBody(body);
        const result = yield client.createSecurityGroup(request);
        const obj = JSON.parse(JSON.stringify(result));
        if (obj.httpStatusCode >= 300) {
            core.setFailed('Create Default CCI Security Groups Failed.');
        }
        if (Object.prototype.hasOwnProperty.call(obj, 'security_group')) {
            const id = obj.security_group.id;
            if (typeof id == 'string') {
                return Promise.resolve(id);
            }
        }
        throw new Error('Create Default CCI Security Groups Failed.');
    });
}
exports.createDefaultCCISecurityGroups = createDefaultCCISecurityGroups;
/**
 * 创建安全组规则
 * @param
 * @returns
 */
function createDefaultCCISecurityGroupRule(securityGroupId, inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = vpcv3.VpcClient.newBuilder()
            .withCredential(utils.getBasicCredentials(inputs))
            .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
            .build();
        const securityGroupRules = [
            new SecurityGroupRule_1.SecurityGroupRule(securityGroupId, 'ICMP', '8-0'),
            new SecurityGroupRule_1.SecurityGroupRule(securityGroupId, 'TCP', '1-65535'),
            new SecurityGroupRule_1.SecurityGroupRule(securityGroupId, 'UDP', '1-65535')
        ];
        securityGroupRules.forEach(function (securityGroupRule) {
            return __awaiter(this, void 0, void 0, function* () {
                const request = new vpcv3.CreateSecurityGroupRuleRequest();
                const body = new vpcv3.CreateSecurityGroupRuleRequestBody();
                const securityGroupRulebody = new vpcv3.CreateSecurityGroupRuleOption();
                securityGroupRulebody
                    .withSecurityGroupId(securityGroupRule.securityGroupId)
                    .withDirection(securityGroupRule.direction)
                    .withEthertype(securityGroupRule.ethertype)
                    .withProtocol(securityGroupRule.protocol)
                    .withMultiport(securityGroupRule.multiport)
                    .withRemoteIpPrefix(securityGroupRule.remoteIpPrefix)
                    .withAction(securityGroupRule.action)
                    .withPriority(securityGroupRule.priority);
                body.withSecurityGroupRule(securityGroupRulebody);
                request.withBody(body);
                const result = yield client.createSecurityGroupRule(request);
                const obj = JSON.parse(JSON.stringify(result));
                if (obj.httpStatusCode >= 300) {
                    core.setFailed('Create Default CCI Security Groups Failed.');
                }
            });
        });
    });
}
exports.createDefaultCCISecurityGroupRule = createDefaultCCISecurityGroupRule;
/**
 * 创建VPC
 * @param
 * @returns
 */
function createVpc(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const vpcName = 'CCI-VPC-' + utils.getRandomByDigit(8);
        const client = vpc.VpcClient.newBuilder()
            .withCredential(utils.getBasicCredentials(inputs))
            .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
            .build();
        const request = new vpc.CreateVpcRequest();
        const body = new vpc.CreateVpcRequestBody();
        const vpcbody = new vpc.CreateVpcOption();
        vpcbody.withCidr(DAFAULT_CIDR).withName(vpcName);
        body.withVpc(vpcbody);
        request.withBody(body);
        const result = yield client.createVpc(request);
        const obj = JSON.parse(JSON.stringify(result));
        if (obj.httpStatusCode >= 300) {
            core.setFailed('Create VPC Failed.');
        }
        if (Object.prototype.hasOwnProperty.call(obj, 'vpc')) {
            const id = obj.vpc.id;
            if (typeof id == 'string') {
                return Promise.resolve(id);
            }
        }
        throw new Error('Create VPC Failed.');
    });
}
exports.createVpc = createVpc;
/**
 * 创建Subnet
 * @param
 * @returns
 */
function createSubnet(vpcId) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputs = context.getInputs();
        const subnetName = 'cci-subnet-' + utils.getRandomByDigit(8);
        const client = vpc.VpcClient.newBuilder()
            .withCredential(utils.getBasicCredentials(inputs))
            .withEndpoint(utils.getEndpoint(inputs.region, context.EndpointServiceName.VPC))
            .build();
        const request = new vpc.CreateSubnetRequest();
        const body = new vpc.CreateSubnetRequestBody();
        const listSubnetExtraDhcpOpts = [];
        listSubnetExtraDhcpOpts.push(new vpc.ExtraDhcpOption().withOptName('ntp'));
        const subnetbody = new vpc.CreateSubnetOption();
        subnetbody
            .withName(subnetName)
            .withCidr(DEFAULT_SUBNET_CIDR)
            .withVpcId(vpcId)
            .withGatewayIp(DEFAULT_GATEWAY_IP)
            .withExtraDhcpOpts(listSubnetExtraDhcpOpts);
        body.withSubnet(subnetbody);
        request.withBody(body);
        const result = yield client.createSubnet(request);
        if (result.httpStatusCode >= 300) {
            core.setFailed('Create Subnet Failed.');
        }
        const subnetInfo = JSON.parse(JSON.stringify(result.subnet));
        if (Object.prototype.hasOwnProperty.call(subnetInfo, 'cidr') &&
            Object.prototype.hasOwnProperty.call(subnetInfo, 'neutron_network_id') &&
            Object.prototype.hasOwnProperty.call(subnetInfo, 'neutron_subnet_id')) {
            return Promise.resolve(subnetInfo);
        }
        throw new Error('Create Subnet Failed.');
    });
}
exports.createSubnet = createSubnet;
