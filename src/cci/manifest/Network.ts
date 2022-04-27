export class Network {
  readonly apiVersion: string = 'networking.cci.io/v1beta1';
  readonly kind: string = 'Network';
  metadata: Metadata;
  spec: Spec;
  constructor(
    networkName: string,
    securityGroupId: string,
    domainId: string,
    projectId: string,
    availableZone: string,
    cidr: string,
    attachedVPC: string,
    networkID: string,
    subnetID: string
  ) {
    this.metadata = new Metadata(
      networkName,
      new Annotation(securityGroupId, domainId, projectId)
    );
    this.spec = new Spec(availableZone, cidr, attachedVPC, networkID, subnetID);
  }
}

export class Metadata {
  name: string;
  annotations: Annotation;
  constructor(name: string, annotations: Annotation) {
    this.name = name;
    this.annotations = annotations;
  }
}

export class Annotation {
  private 'network.alpha.kubernetes.io/default-security-group': string;
  private 'network.alpha.kubernetes.io/domain-id': string;
  private 'network.alpha.kubernetes.io/project-id': string;
  constructor(securityGroupId: string, domainId: string, projectId: string) {
    this['network.alpha.kubernetes.io/default-security-group'] =
      securityGroupId;
    this['network.alpha.kubernetes.io/domain-id'] = domainId;
    this['network.alpha.kubernetes.io/project-id'] = projectId;
  }
}

export class Spec {
  availableZone: string;
  cidr: string;
  attachedVPC: string;
  networkID: string;
  networkType = 'underlay_neutron';
  subnetID: string;
  constructor(
    availableZone: string,
    cidr: string,
    attachedVPC: string,
    networkID: string,
    subnetID: string
  ) {
    this.availableZone = availableZone;
    this.cidr = cidr;
    this.attachedVPC = attachedVPC;
    this.networkID = networkID;
    this.subnetID = subnetID;
  }
}
