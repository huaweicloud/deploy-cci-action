"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadCoreV1NamespaceResponse = void 0;
const SdkResponse_1 = require("@huaweicloud/huaweicloud-sdk-core/SdkResponse");
class ReadCoreV1NamespaceResponse extends SdkResponse_1.SdkResponse {
    constructor() {
        super();
    }
    withMetadata(items) {
        this['metadata'] = items;
        return this;
    }
    get _items() {
        return this['metadata'];
    }
}
exports.ReadCoreV1NamespaceResponse = ReadCoreV1NamespaceResponse;
