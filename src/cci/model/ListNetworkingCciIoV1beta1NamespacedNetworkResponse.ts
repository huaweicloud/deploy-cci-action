import { ItemResp } from './ItemResp';

import { SdkResponse } from "@huaweicloud/huaweicloud-sdk-core/SdkResponse";

export class ListNetworkingCciIoV1beta1NamespacedNetworkResponse extends SdkResponse {
    public items?: Array<ItemResp>;
    public constructor() { 
        super();
    }
    public withItems(items: Array<ItemResp>): ListNetworkingCciIoV1beta1NamespacedNetworkResponse {
        this['items'] = items;
        return this;
    }
    public get _items() {
        return this['items'];
    }
}
