export class ReadCoreV1NamespaceRequest {
  public 'namespace': string | undefined;
  public constructor(namespace?: any) {
    this['namespace'] = namespace;
  }
  public withNamespace(
    namespace: string
  ): ReadCoreV1NamespaceRequest {
    this['namespace'] = namespace;
    return this;
  }
}
