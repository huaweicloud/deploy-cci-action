"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Port = exports.SpecSelector = exports.Spec = exports.Elb = exports.Label = exports.Metadata = exports.Service = void 0;
class Service {
    constructor(inputs, elbId) {
        this.apiVersion = 'v1';
        this.kind = 'Service';
        this.metadata = new Metadata(inputs.deployment, new Label(inputs.deployment), new Elb(elbId));
        this.spec = new Spec(new SpecSelector(inputs.deployment), [new Port()]);
    }
}
exports.Service = Service;
class Metadata {
    constructor(name, labels, elb) {
        this.name = name;
        this.labels = labels;
        this.annotations = elb;
    }
}
exports.Metadata = Metadata;
class Label {
    constructor(app) {
        this.app = app;
    }
}
exports.Label = Label;
class Elb {
    constructor(elbId) {
        this['kubernetes.io/elb.id'] = elbId;
    }
    withElbId(elbId) {
        this['kubernetes.io/elb.id'] = elbId;
        return this;
    }
    set elbId(elbId) {
        this['kubernetes.io/elb.id'] = elbId;
    }
    get elbId() {
        return this['kubernetes.io/elb.id'];
    }
}
exports.Elb = Elb;
class Spec {
    constructor(selector, ports) {
        this.type = 'ClusterIP';
        this.selector = selector;
        this.ports = ports;
    }
}
exports.Spec = Spec;
class SpecSelector {
    constructor(app) {
        this.app = app;
    }
}
exports.SpecSelector = SpecSelector;
class Port {
    constructor() {
        this.name = 'service0';
        this.targetPort = 80;
        this.port = 8080;
        this.protocol = 'TCP';
    }
}
exports.Port = Port;
