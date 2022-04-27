import * as context from '../../context';

export class Ingress {
  readonly apiVersion = 'extensions/v1beta1';
  readonly kind = 'Ingress';
  metadata: Metadata;
  spec: Spec;
  constructor(inputs: context.Inputs, elbId: string) {
    this.metadata = new Metadata(
      inputs.deployment,
      new Label(inputs.deployment),
      new Elb(elbId)
    );
    this.spec = new Spec([
      new Rule(new Http([new Path(new Backend(inputs.deployment))]))
    ]);
  }
}

export class Metadata {
  name: string;
  labels: Label;
  annotations: Elb;
  constructor(name: string, labels: Label, elb: Elb) {
    this.name = name;
    this.labels = labels;
    this.annotations = elb;
  }
}

export class Label {
  app: string;
  isExternal = 'true';
  zone = 'data';
  constructor(app: string) {
    this.app = app;
  }
}

export class Elb {
  private 'kubernetes.io/elb.id': string;
  private 'kubernetes.io/elb.port' = '6071';
  constructor(elbId: string) {
    this['kubernetes.io/elb.id'] = elbId;
  }
  public withElbId(elbId: string): Elb {
    this['kubernetes.io/elb.id'] = elbId;
    return this;
  }
  public set elbId(elbId: string) {
    this['kubernetes.io/elb.id'] = elbId;
  }
  public get elbId() {
    return this['kubernetes.io/elb.id'];
  }
  public withElbPort(elbPort: string): Elb {
    this['kubernetes.io/elb.port'] = elbPort;
    return this;
  }
  public set elbPort(elbPort: string) {
    this['kubernetes.io/elb.port'] = elbPort;
  }
  public get elbPort() {
    return this['kubernetes.io/elb.port'];
  }
}

export class Spec {
  rules: Array<Rule>;
  constructor(rules: Array<Rule>) {
    this.rules = rules;
  }
}

export class Rule {
  http: Http;
  constructor(http: Http) {
    this.http = http;
  }
}

export class Http {
  paths: Array<Path>;
  constructor(paths: Array<Path>) {
    this.paths = paths;
  }
}

export class Path {
  path = '/';
  backend: Backend;
  constructor(backend: Backend) {
    this.backend = backend;
  }
}

export class Backend {
  serviceName: string;
  servicePort = 8080;
  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }
}
