"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagePullSecret = exports.Resource = exports.Resources = exports.Port = exports.Container = exports.TemplateSpec = exports.Labels = exports.TemplateMetadata = exports.Template = exports.MatchLabels = exports.SpecSelector = exports.Spec = exports.Metadata = exports.Deployment = void 0;
class Deployment {
    constructor(inputs) {
        this.apiVersion = 'apps/v1';
        this.kind = 'Deployment';
        this.metadata = new Metadata(inputs.deployment, inputs.namespace);
        this.spec = new Spec(new SpecSelector(new MatchLabels(inputs.deployment)), new Template(new TemplateMetadata(new Labels(inputs.deployment)), new TemplateSpec([
            new Container(inputs.image, [new Port()], new Resources(new Resource(), new Resource()))
        ], [new ImagePullSecret()])));
    }
}
exports.Deployment = Deployment;
class Metadata {
    constructor(name, namespace) {
        this.name = name;
        this.namespace = namespace;
    }
}
exports.Metadata = Metadata;
class Spec {
    constructor(selector, template) {
        this.replicas = 2;
        this.selector = selector;
        this.template = template;
    }
}
exports.Spec = Spec;
class SpecSelector {
    constructor(matchLabels) {
        this.matchLabels = matchLabels;
    }
}
exports.SpecSelector = SpecSelector;
class MatchLabels {
    constructor(app) {
        this.app = app;
    }
}
exports.MatchLabels = MatchLabels;
class Template {
    constructor(metadata, spec) {
        this.metadata = metadata;
        this.spec = spec;
    }
}
exports.Template = Template;
class TemplateMetadata {
    constructor(labels) {
        this.labels = labels;
    }
}
exports.TemplateMetadata = TemplateMetadata;
class Labels {
    constructor(app) {
        this.app = app;
    }
}
exports.Labels = Labels;
class TemplateSpec {
    constructor(containers, imagePullSecrets) {
        this.containers = containers;
        this.imagePullSecrets = imagePullSecrets;
    }
}
exports.TemplateSpec = TemplateSpec;
class Container {
    constructor(image, ports, resources) {
        this.image = image;
        this.name = 'container-0';
        this.ports = ports;
        this.resources = resources;
    }
}
exports.Container = Container;
class Port {
    constructor() {
        this.containerPort = 80;
    }
    set _containerPort(containerPort) {
        this.containerPort = containerPort;
    }
}
exports.Port = Port;
class Resources {
    constructor(limits, requests) {
        this.limits = limits;
        this.requests = requests;
    }
}
exports.Resources = Resources;
class Resource {
    constructor() {
        this.cpu = '500m';
        this.memory = '1024Mi';
    }
}
exports.Resource = Resource;
class ImagePullSecret {
    constructor() {
        this.name = 'imagepull-secret';
    }
}
exports.ImagePullSecret = ImagePullSecret;
