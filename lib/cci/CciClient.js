"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamCreater = exports.CciClient = void 0;
const core = __importStar(require("@actions/core"));
const Constants_1 = require("../Constants");
const ClientBuilder_1 = require("@huaweicloud/huaweicloud-sdk-core/ClientBuilder");
const ListNetworkingCciIoV1beta1NamespacedNetworkRequest_1 = require("./model/ListNetworkingCciIoV1beta1NamespacedNetworkRequest");
const ReadCoreV1NamespaceRequest_1 = require("./model/ReadCoreV1NamespaceRequest");
class CciClient {
    constructor(client) {
        this.hcClient = client;
    }
    static newBuilder() {
        return new ClientBuilder_1.ClientBuilder(newClient);
    }
    getPath() {
        return __dirname;
    }
    /**
     * 查询指定namespace下的所有Network对象。
     * @param {string} namespace cci命名空间
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    listNetworkingCciIoV1beta1NamespacedNetwork(listNetworkingCciIoV1beta1NamespacedNetworkRequest) {
        const options = (0, exports.ParamCreater)().listNetworkingCciIoV1beta1NamespacedNetwork(listNetworkingCciIoV1beta1NamespacedNetworkRequest);
        return this.hcClient.sendRequest(options);
    }
    /**
     * 查询Namespace的详细信息。
     * @param {string} namespace cci命名空间
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    readCoreV1Namespace(readCoreV1NamespaceRequest) {
        const options = (0, exports.ParamCreater)().readCoreV1Namespace(readCoreV1NamespaceRequest);
        return this.hcClient.sendRequest(options);
    }
}
exports.CciClient = CciClient;
const ParamCreater = function () {
    return {
        /**
         * 查询指定namespace下的所有Network对象。
         */
        listNetworkingCciIoV1beta1NamespacedNetwork(listNetworkingCciIoV1beta1NamespacedNetworkRequest) {
            const options = {
                method: Constants_1.Constants.METHOD_GET,
                url: '/apis/networking.cci.io/v1beta1/namespaces/{namespace}/networks',
                contentType: Constants_1.Constants.CONTENT_TYPEAPPLICATION_JSON,
                queryParams: {},
                pathParams: {},
                headers: {},
                data: {}
            };
            const localVarHeaderParameter = {};
            let namespace;
            if (listNetworkingCciIoV1beta1NamespacedNetworkRequest !== null &&
                listNetworkingCciIoV1beta1NamespacedNetworkRequest !== undefined) {
                if (listNetworkingCciIoV1beta1NamespacedNetworkRequest instanceof
                    ListNetworkingCciIoV1beta1NamespacedNetworkRequest_1.ListNetworkingCciIoV1beta1NamespacedNetworkRequest) {
                    namespace =
                        listNetworkingCciIoV1beta1NamespacedNetworkRequest.namespace;
                }
                else {
                    namespace =
                        listNetworkingCciIoV1beta1NamespacedNetworkRequest['namespace'];
                }
            }
            if (namespace === null || namespace === undefined) {
                core.setFailed('input parameters namespace is not correct.');
            }
            options.pathParams = { namespace: namespace };
            options.headers = localVarHeaderParameter;
            return options;
        },
        /**
         * 查询Namespace的详细信息。
         */
        readCoreV1Namespace(readCoreV1NamespaceRequest) {
            const options = {
                method: Constants_1.Constants.METHOD_GET,
                url: '/api/v1/namespaces/{namespace}',
                contentType: Constants_1.Constants.CONTENT_TYPEAPPLICATION_JSON,
                queryParams: {},
                pathParams: {},
                headers: {},
                data: {}
            };
            const localVarHeaderParameter = {};
            let namespace;
            if (readCoreV1NamespaceRequest !== null &&
                readCoreV1NamespaceRequest !== undefined) {
                if (readCoreV1NamespaceRequest instanceof ReadCoreV1NamespaceRequest_1.ReadCoreV1NamespaceRequest) {
                    namespace = readCoreV1NamespaceRequest.namespace;
                }
                else {
                    namespace = readCoreV1NamespaceRequest['namespace'];
                }
            }
            if (namespace === null || namespace === undefined) {
                core.setFailed('input parameters namespace is not correct.');
            }
            options.pathParams = { namespace: namespace };
            options.headers = localVarHeaderParameter;
            return options;
        }
    };
};
exports.ParamCreater = ParamCreater;
function newClient(client) {
    return new CciClient(client);
}
