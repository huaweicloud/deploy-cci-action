import * as context from '../../context'

export class Service {
    readonly apiVersion: string = 'v1';
    readonly kind: string = 'Service';
    metadata: Metadata;
    spec: Spec;
    constructor(inputs: context.Inputs, elbId: string) {
        this.metadata = new Metadata(inputs.deployment, new Label(inputs.deployment), new Elb(elbId));
        this.spec = new Spec(new SpecSelector(inputs.deployment), [new Port()]);
    }
}

export class Metadata {
    annotations: Elb;
    name: string;
    labels: Label;
    constructor(name: string, labels: Label, elb: Elb) {
        this.name = name
        this.labels = labels
        this.annotations = elb
    }
}

export class Label {
    app: string;
    constructor(app: string) {
        this.app = app
    }
}

export class Elb {
    private 'kubernetes.io/elb.id': string;
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
}

export class Spec {
    selector: SpecSelector;
    ports: Array<Port>;
    type = "ClusterIP";
    constructor(selector: SpecSelector,  ports: Array<Port>) {
        this.selector = selector
        this.ports = ports
    }
}

export class SpecSelector {
    app: string;
    constructor(app: string) {
        this.app = app
    }
}

export class Port {
    name = "service0";
    targetPort = 80;
    port = 8080;
    protocol = "TCP";
}
