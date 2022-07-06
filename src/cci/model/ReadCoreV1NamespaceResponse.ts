import {MetadataResp} from './MetadataResp';

import {SdkResponse} from '@huaweicloud/huaweicloud-sdk-core/SdkResponse';

export class ReadCoreV1NamespaceResponse extends SdkResponse {
  public metadata?: MetadataResp;
  public constructor() {
    super();
  }
  public withMetadata(
    items: MetadataResp
  ): ReadCoreV1NamespaceResponse {
    this['metadata'] = items;
    return this;
  }
  public get _items() {
    return this['metadata'];
  }
}
