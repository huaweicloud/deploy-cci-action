"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend = exports.Path = exports.Http = exports.Rule = exports.Spec = exports.Elb = exports.Label = exports.Metadata = exports.Ingress = void 0;
class Ingress {
    constructor(inputs, elbId) {
        this.apiVersion = 'extensions/v1beta1';
        this.kind = 'Ingress';
        this.metadata = new Metadata(inputs.deployment, new Label(inputs.deployment), new Elb(elbId));
        this.spec = new Spec([new Rule(new Http([new Path(new Backend(inputs.deployment))]))]);
    }
}
exports.Ingress = Ingress;
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
        this.isExternal = 'true';
        this.zone = 'data';
        this.app = app;
    }
}
exports.Label = Label;
class Elb {
    constructor(elbId) {
        this['kubernetes.io/elb.port'] = '6071';
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
    withElbPort(elbPort) {
        this['kubernetes.io/elb.port'] = elbPort;
        return this;
    }
    set elbPort(elbPort) {
        this['kubernetes.io/elb.port'] = elbPort;
    }
    get elbPort() {
        return this['kubernetes.io/elb.port'];
    }
}
exports.Elb = Elb;
class Spec {
    constructor(rules) {
        this.rules = rules;
    }
}
exports.Spec = Spec;
class Rule {
    constructor(http) {
        this.http = http;
    }
}
exports.Rule = Rule;
class Http {
    constructor(paths) {
        this.paths = paths;
    }
}
exports.Http = Http;
class Path {
    constructor(backend) {
        this.path = "/";
        this.backend = backend;
    }
}
exports.Path = Path;
class Backend {
    constructor(serviceName) {
        this.servicePort = 8080;
        this.serviceName = serviceName;
    }
}
exports.Backend = Backend;
