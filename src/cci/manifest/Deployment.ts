import * as context from '../../context'

export class Deployment {
    readonly apiVersion: string = 'apps/v1';
    readonly kind: string = 'Deployment';
    metadata: Metadata;
    spec: Spec;
    constructor(inputs: context.Inputs) {
        this.metadata = new Metadata(inputs.deployment, inputs.namespace);
        this.spec = new Spec(new SpecSelector(new MatchLabels(inputs.deployment)), 
                             new Template(new TemplateMetadata(new Labels(inputs.deployment)), 
                                          new TemplateSpec([new Container(inputs.imageList[0],[new Port()], new Resources(new Resource(), new Resource()))], 
                                                           [new ImagePullSecret()])));
        
        
    }
}

export class Metadata {
    name: string;
    namespace: string;
    constructor(name: string, namespace: string) {
        this.name = name
        this.namespace = namespace
    }
}

export class Spec {
    replicas: number;
    selector: SpecSelector;
    template: Template;
    constructor(selector: SpecSelector,  template: Template) {
        this.replicas = 2
        this.selector = selector
        this.template = template
    }
}

export class SpecSelector {
    matchLabels: MatchLabels;
    constructor(matchLabels: MatchLabels) {
        this.matchLabels = matchLabels
    }
}

export class MatchLabels {
    app: string;
    constructor(app: string) {
        this.app = app
    }
}

export class Template {
    metadata: TemplateMetadata;
    spec: TemplateSpec;
    constructor(metadata: TemplateMetadata, spec: TemplateSpec) {
        this.metadata = metadata
        this.spec = spec
    }
}

export class TemplateMetadata {
    labels: Labels;
    constructor(labels: Labels) {
        this.labels = labels
    }
}

export class Labels {
    app: string;
    constructor(app: string) {
        this.app = app
    }
}

export class TemplateSpec {
    containers: Array<Container>;
    imagePullSecrets: Array<ImagePullSecret>;
    constructor(containers: Array<Container>, imagePullSecrets: Array<ImagePullSecret>) {
        this.containers = containers
        this.imagePullSecrets = imagePullSecrets
    }
}

export class Container {
    image: string;
    name: string;
    ports: Array<Port>;
    resources: Resources;
    constructor(image: string, ports: Array<Port>, resources: Resources) {
        this.image = image
        this.name = 'container-0'
        this.ports = ports
        this.resources = resources
    }
}

export class Port {
    containerPort: number;
    constructor() {
        this.containerPort = 80
    }
    
    set _containerPort(containerPort: number) {
    this.containerPort = containerPort;
  }
}

export class Resources {
    limits: Resource;
    requests: Resource;
    constructor(limits: Resource, requests: Resource) {
        this.limits = limits
        this.requests = requests
    }
}

export class Resource {
    cpu: string;
    memory: string;
    constructor() {
        this.cpu = '500m'
        this.memory = '1024Mi'
    }
}

export class ImagePullSecret {
    name: string;
    constructor() {
        this.name = 'imagepull-secret'
    }
}
