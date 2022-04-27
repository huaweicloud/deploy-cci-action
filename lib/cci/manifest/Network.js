"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spec = exports.Annotation = exports.Metadata = exports.Network = void 0;
class Network {
    constructor(networkName, securityGroupId, domainId, projectId, availableZone, cidr, attachedVPC, networkID, subnetID) {
        this.apiVersion = 'networking.cci.io/v1beta1';
        this.kind = 'Network';
        this.metadata = new Metadata(networkName, new Annotation(securityGroupId, domainId, projectId));
        this.spec = new Spec(availableZone, cidr, attachedVPC, networkID, subnetID);
    }
}
exports.Network = Network;
class Metadata {
    constructor(name, annotations) {
        this.name = name;
        this.annotations = annotations;
    }
}
exports.Metadata = Metadata;
class Annotation {
    constructor(securityGroupId, domainId, projectId) {
        this['network.alpha.kubernetes.io/default-security-group'] = securityGroupId;
        this['network.alpha.kubernetes.io/domain-id'] = domainId;
        this['network.alpha.kubernetes.io/project-id'] = projectId;
    }
}
exports.Annotation = Annotation;
class Spec {
    constructor(availableZone, cidr, attachedVPC, networkID, subnetID) {
        this.networkType = 'underlay_neutron';
        this.availableZone = availableZone;
        this.cidr = cidr;
        this.attachedVPC = attachedVPC;
        this.networkID = networkID;
        this.subnetID = subnetID;
    }
}
exports.Spec = Spec;
