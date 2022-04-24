export class Namespace {
    readonly apiVersion = 'v1';
    readonly kind = 'Namespace';
    metadata: Metadata;
    spec: Spec;
    constructor(namespace: string) {
        this.metadata = new Metadata(namespace, new Label(), new Annotation());
        this.spec = new Spec();
    }
}

export class Metadata {
    name: string;
    labels: Label;
    annotations: Annotation;
    constructor(name: string, labels: Label, annotations: Annotation) {
        this.name = name
        this.labels = labels
        this.annotations = annotations
    }
}

export class Label {
    'sys_enterprise_project_id' = '0';
}

export class Annotation {
    private 'namespace.kubernetes.io/flavor' = 'general-computing';
}

export class Spec {
    finalizers = ['kubernetes'];
}
