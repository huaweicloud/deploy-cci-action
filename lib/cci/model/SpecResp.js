"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecResp = void 0;
class SpecResp {
    withCidr(cidr) {
        this['cidr'] = cidr;
        return this;
    }
    withAttachedVPC(attachedVPC) {
        this['attachedVPC'] = attachedVPC;
        return this;
    }
    withNetworkType(networkType) {
        this['networkType'] = networkType;
        return this;
    }
    withNetworkID(networkID) {
        this['networkID'] = networkID;
        return this;
    }
    withSubnetID(subnetID) {
        this['subnetID'] = subnetID;
        return this;
    }
    withAvailableZone(availableZone) {
        this['availableZone'] = availableZone;
        return this;
    }
    get _subnetID() {
        return this['subnetID'];
    }
}
exports.SpecResp = SpecResp;
