"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spec = exports.Annotation = exports.Label = exports.Metadata = exports.Namespace = void 0;
class Namespace {
    constructor(namespace) {
        this.apiVersion = 'v1';
        this.kind = 'Namespace';
        this.metadata = new Metadata(namespace, new Label(), new Annotation());
        this.spec = new Spec();
    }
}
exports.Namespace = Namespace;
class Metadata {
    constructor(name, labels, annotations) {
        this.name = name;
        this.labels = labels;
        this.annotations = annotations;
    }
}
exports.Metadata = Metadata;
class Label {
    constructor() {
        this['sys_enterprise_project_id'] = '0';
    }
}
exports.Label = Label;
class Annotation {
    constructor() {
        this['namespace.kubernetes.io/flavor'] = 'general-computing';
    }
}
exports.Annotation = Annotation;
class Spec {
    constructor() {
        this.finalizers = ['kubernetes'];
    }
}
exports.Spec = Spec;
