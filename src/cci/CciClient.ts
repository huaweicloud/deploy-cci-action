import * as core from '@actions/core';
import {Constants} from '../Constants';
import {HcClient} from '@huaweicloud/huaweicloud-sdk-core/HcClient';
import {ClientBuilder} from '@huaweicloud/huaweicloud-sdk-core/ClientBuilder';
import {ListNetworkingCciIoV1beta1NamespacedNetworkRequest} from './model/ListNetworkingCciIoV1beta1NamespacedNetworkRequest';
import {ListNetworkingCciIoV1beta1NamespacedNetworkResponse} from './model/ListNetworkingCciIoV1beta1NamespacedNetworkResponse';
import {ReadCoreV1NamespaceRequest} from './model/ReadCoreV1NamespaceRequest';
import {ReadCoreV1NamespaceResponse} from './model/ReadCoreV1NamespaceResponse';

export class CciClient {
  public static newBuilder(): ClientBuilder<CciClient> {
    return new ClientBuilder<CciClient>(newClient);
  }

  private hcClient: HcClient;
  public constructor(client: HcClient) {
    this.hcClient = client;
  }

  public getPath() {
    return __dirname;
  }

  /**
   * 查询指定namespace下的所有Network对象。
   * @param {string} namespace cci命名空间
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   */
  public listNetworkingCciIoV1beta1NamespacedNetwork(
    listNetworkingCciIoV1beta1NamespacedNetworkRequest?: ListNetworkingCciIoV1beta1NamespacedNetworkRequest
  ): Promise<ListNetworkingCciIoV1beta1NamespacedNetworkResponse> {
    const options = ParamCreater().listNetworkingCciIoV1beta1NamespacedNetwork(
      listNetworkingCciIoV1beta1NamespacedNetworkRequest
    );
    return this.hcClient.sendRequest(options);
  }

  /**
   * 查询Namespace的详细信息。
   * @param {string} namespace cci命名空间
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   */
  public readCoreV1Namespace(
    readCoreV1NamespaceRequest?: ReadCoreV1NamespaceRequest
  ): Promise<ReadCoreV1NamespaceResponse> {
    const options = ParamCreater().readCoreV1Namespace(
      readCoreV1NamespaceRequest
    );
    return this.hcClient.sendRequest(options);
  }
}

export const ParamCreater = function () {
  return {
    /**
     * 查询指定namespace下的所有Network对象。
     */
    listNetworkingCciIoV1beta1NamespacedNetwork(
      listNetworkingCciIoV1beta1NamespacedNetworkRequest?: ListNetworkingCciIoV1beta1NamespacedNetworkRequest
    ) {
      const options = {
        method: Constants.METHOD_GET,
        url: '/apis/networking.cci.io/v1beta1/namespaces/{namespace}/networks',
        contentType: Constants.CONTENT_TYPEAPPLICATION_JSON,
        queryParams: {},
        pathParams: {},
        headers: {},
        data: {}
      };
      const localVarHeaderParameter = {} as any;

      let namespace;

      if (
        listNetworkingCciIoV1beta1NamespacedNetworkRequest !== null &&
        listNetworkingCciIoV1beta1NamespacedNetworkRequest !== undefined
      ) {
        if (
          listNetworkingCciIoV1beta1NamespacedNetworkRequest instanceof
          ListNetworkingCciIoV1beta1NamespacedNetworkRequest
        ) {
          namespace =
            listNetworkingCciIoV1beta1NamespacedNetworkRequest.namespace;
        } else {
          namespace =
            listNetworkingCciIoV1beta1NamespacedNetworkRequest['namespace'];
        }
      }

      if (namespace === null || namespace === undefined) {
        core.setFailed('input parameters namespace is not correct.');
      }

      options.pathParams = {namespace: namespace};
      options.headers = localVarHeaderParameter;
      return options;
    },

    /**
     * 查询Namespace的详细信息。
     */
    readCoreV1Namespace(
      readCoreV1NamespaceRequest?: ReadCoreV1NamespaceRequest
    ) {
      const options = {
        method: Constants.METHOD_GET,
        url: '/api/v1/namespaces/{namespace}',
        contentType: Constants.CONTENT_TYPEAPPLICATION_JSON,
        queryParams: {},
        pathParams: {},
        headers: {},
        data: {}
      };
      const localVarHeaderParameter = {} as any;

      let namespace;

      if (
        readCoreV1NamespaceRequest !== null &&
        readCoreV1NamespaceRequest !== undefined
      ) {
        if (readCoreV1NamespaceRequest instanceof ReadCoreV1NamespaceRequest) {
          namespace = readCoreV1NamespaceRequest.namespace;
        } else {
          namespace = readCoreV1NamespaceRequest['namespace'];
        }
      }

      if (namespace === null || namespace === undefined) {
        core.setFailed('input parameters namespace is not correct.');
      }

      options.pathParams = {namespace: namespace};
      options.headers = localVarHeaderParameter;
      return options;
    }
  };
};

function newClient(client: HcClient): CciClient {
  return new CciClient(client);
}
