"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadCoreV1NamespaceRequest = void 0;
class ReadCoreV1NamespaceRequest {
    constructor(namespace) {
        this['namespace'] = namespace;
    }
    withNamespace(namespace) {
        this['namespace'] = namespace;
        return this;
    }
}
exports.ReadCoreV1NamespaceRequest = ReadCoreV1NamespaceRequest;
