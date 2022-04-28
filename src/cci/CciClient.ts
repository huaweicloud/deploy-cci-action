import * as core from '@actions/core';
import {Constants} from '../Constants';
import {HcClient} from '@huaweicloud/huaweicloud-sdk-core/HcClient';
import {ClientBuilder} from '@huaweicloud/huaweicloud-sdk-core/ClientBuilder';
import {ListNetworkingCciIoV1beta1NamespacedNetworkRequest} from './model/ListNetworkingCciIoV1beta1NamespacedNetworkRequest';
import {ListNetworkingCciIoV1beta1NamespacedNetworkResponse} from './model/ListNetworkingCciIoV1beta1NamespacedNetworkResponse';

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
    }
  };
};

function newClient(client: HcClient): CciClient {
  return new CciClient(client);
}
