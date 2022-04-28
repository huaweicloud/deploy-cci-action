export class ListNetworkingCciIoV1beta1NamespacedNetworkRequest {
  public 'namespace': string | undefined;
  public constructor(namespace?: any) {
    this['namespace'] = namespace;
  }
  public withNamespace(
    namespace: string
  ): ListNetworkingCciIoV1beta1NamespacedNetworkRequest {
    this['namespace'] = namespace;
    return this;
  }
}
