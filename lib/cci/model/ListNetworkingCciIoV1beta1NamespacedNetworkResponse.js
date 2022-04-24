"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNetworkingCciIoV1beta1NamespacedNetworkResponse = void 0;
const SdkResponse_1 = require("@huaweicloud/huaweicloud-sdk-core/SdkResponse");
class ListNetworkingCciIoV1beta1NamespacedNetworkResponse extends SdkResponse_1.SdkResponse {
    constructor() {
        super();
    }
    withItems(items) {
        this['items'] = items;
        return this;
    }
    get _items() {
        return this['items'];
    }
}
exports.ListNetworkingCciIoV1beta1NamespacedNetworkResponse = ListNetworkingCciIoV1beta1NamespacedNetworkResponse;
