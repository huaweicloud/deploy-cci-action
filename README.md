# HuaweiCloud Deploy CCI Action

开发者可以集成此action到workflow，将镜像部署到华为云容器实例。

## **前置工作**
### 1.云服务资源使用
容器镜像服务（[SoftWare Repository for Container，下面简称SWR](https://support.huaweicloud.com/swr/index.html)）和 云容器实例（[Cloud Container Instance， CCI](https://support.huaweicloud.com/cci/index.html)）

### 2.SWR
SWR需要[创建组织](https://support.huaweicloud.com/usermanual-swr/swr_01_0014.html)并[授权管理](https://support.huaweicloud.com/usermanual-swr/swr_01_0072.html)

### 3.CCI
使用Deploy CCI Action前需要在CCI服务完成下面前置步骤操作。
#### 1）[服务权限管理设置](https://support.huaweicloud.com/usermanual-cci/cci_01_0074.html)
#### 2）[创建命名空间(非必须，不存在即创建)](https://support.huaweicloud.com/qs-cci/cci_qs_0004.html)
#### 3）[创建负载(非必须，不存在即创建)](https://support.huaweicloud.com/qs-cci/cci_qs_0005.html)


## **End-to-End 样例 Workflows**
### 1.部署cci样例workflow
以下示例为将镜像部署到华为云容器实例workflow过程。workflow包含的步骤：1）代码检出  2）构建自己的语言工程  3）SWR容器镜像服务鉴权  4）制作并推送镜像到SWR  5）安装Kubectl工具  6）部署镜像到CCI
```yaml
name: Deploy CCI Actions Demo
on: [push]
      
env:
  REGION_ID: region                  # set this to your preferred huaweicloud region, e.g. cn-north-4
  ACCESS_KEY_ID: ${{ secrets.ACCESSKEY }}             # set this to your huaweicloud access-key-id
  ACCESS_KEY_SECRET: ${{ secrets.SECRETACCESSKEY }}               # set this to your huaweicloud access-key-secret
  SWR_ORGANIZATION:  demo   # SWR 组织名
  IMAGE_NAME: ccidemo       # 镜像名称
            
jobs:
  deploy_cci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build with Maven
        id: build-project
        run: mvn package -Dmaven.test.skip=true -U -e -X -B
        
      - name: Log in to HuaweiCloud SWR
        uses: huaweicloud/swr-login@v1
        with:
          region: ${{ env.REGION_ID }}
          access-key-id: ${{ secrets.ACCESSKEY }}
          access-key-secret: ${{ secrets.SECRETACCESSKEY }}

      - name: Build, tag, and push image to HuaweiCloud SWR
        id: build-image
        env:
          SWR_REGISTRY: swr.${{ env.REGION_ID }}.myhuaweicloud.com
          SWR_ORGANIZATION: ${{ env.SWR_ORGANIZATION }}
          IMAGE_TAG: ${{ github.sha }}
          IMAGE_NAME: ${{ env.IMAGE_NAME }}
        run: |
          docker build -t $SWR_REGISTRY/$SWR_ORGANIZATION/$IMAGE_NAME:$IMAGE_TAG .
          docker push $SWR_REGISTRY/$SWR_ORGANIZATION/$IMAGE_NAME:$IMAGE_TAG
          echo "::set-output name=image::$SWR_REGISTRY/$SWR_ORGANIZATION/$IMAGE_NAME:$IMAGE_TAG"

      - name: Kubectl tool installer
        id: install-kubectl
        uses: Azure/setup-kubectl@v2.1

      - name: deploy to cci
        uses: huaweicloud/deploy-cci-action@v1.0.1
        id: deploy-to-cci
        with:
          access_key: ${{ secrets.ACCESSKEY }}
          secret_key: ${{ secrets.SECRETACCESSKEY }}
          project_id: 'project_id'
          region: ${{ env.REGION_ID }}
          namespace: 'CCI命名空间'
          deployment: 'CCI负载名称'
          image: ${{ steps.build-image.outputs.image }}

```

## **Input**

| Name          | Require | Default | Description |
| ------------- | ------- | ------- | ----------- |
| access_key    |   true    |         | 华为访问密钥即AK|
| secret_key    |   true    |         | 访问密钥即SK|
| project_id    |   true    |         | 项目ID，可以在[我的凭证](https://console.huaweicloud.com/iam/?locale=zh-cn#/mine/apiCredential)获取|
| region    |   true        |     cn-north-4    | region：华北-北京四	cn-north-4；华东-上海二	cn-east-2；华东-上海一	cn-east-3；华南-广州	cn-south-1|
| namespace    |   true         |         | CCI命名空间|
| deployment    |   true         |         | CCI负载名称|
| image    |   true         |         | 镜像地址，如1)[swr镜像中心](https://console.huaweicloud.com/swr/?agencyId=66af5f8d4b84416785817649d667a396&region=cn-north-4&locale=zh-cn#/app/swr/huaweiOfficialList)：nginx:latest;  2) swr[我的镜像](https://console.huaweicloud.com/swr/?agencyId=66af5f8d4b84416785817649d667a396&region=cn-north-4&locale=zh-cn#/app/warehouse/list):swr.cn-north-4.myhuaweicloud.com/demo/demo:v1.1|
| manifest    |   false    |         | 负载deployment描述yaml文件|

## **action片段使用介绍**
### 从SWR容器镜像中心获取镜像部署CCI容器实例
```yaml
- name: deploy to cci
      uses: huaweicloud/deploy-cci-action@v1.0.1
      id: deploy-to-cci
      with:
        access_key: ${{ secrets.ACCESSKEY }}
        secret_key: ${{ secrets.SECRETACCESSKEY }}
        project_id: 'project_id'
        region: ${{ env.REGION_ID }}
        namespace: 'namespace-name'
        deployment: 'deployment-name'
        image: nginx:latest
```
### 从SWR我的镜像获取镜像部署CCI容器实例
```yaml
- name: deploy to cci
      uses: huaweicloud/deploy-cci-action@v1.0.1
      id: deploy-to-cci
      with:
        access_key: ${{ secrets.ACCESSKEY }}
        secret_key: ${{ secrets.SECRETACCESSKEY }}
        project_id: 'project_id'
        region: ${{ env.REGION_ID }}
        namespace: 'namespace-name'
        deployment: 'deployment-name'
        image: swr.cn-north-4.myhuaweicloud.com/demo/demo:v1.1
```
### 根据提供的yaml文件部署CCI容器实例
```yaml
- name: deploy to cci
      uses: huaweicloud/deploy-cci-action@v1.0.1
      id: deploy-to-cci
      with:
        access_key: ${{ secrets.ACCESSKEY }}
        secret_key: ${{ secrets.SECRETACCESSKEY }}
        project_id: 'project_id'
        region: ${{ env.REGION_ID }}
        namespace: 'namespace-name'
        deployment: 'deployment-name'
        image: swr.cn-north-4.myhuaweicloud.com/demo/demo:v1.1
        manifest: ./deployment.yml
```

### 1.部署Kubernetes样例yaml文件
以下示例为一个名为cci-deployment的Deployment负载，负载在命名空间是cci-namespace-70395701，使用swr.cn-north-4.myhuaweicloud.com/namespace/demo:v1.1t镜像创建两个Pod，每个Pod占用500m core CPU、1G内存。


```yaml
apiVersion: apps/v1      # 注意这里与Pod的区别，Deployment是apps/v1而不是v1
kind: Deployment         # 资源类型为Deployment
metadata:
  name: cci-deployment            # 必填,Deployment的名称即是负载的名称
spec:
  replicas: 2            # Pod的数量，Deployment会确保一直有2个Pod运行         
  selector:              # Label Selector
    matchLabels:
      app: cci-deployment  # Deployment的名称即是负载的名称
  template:              # Pod的定义，用于创建Pod，也称为Pod template
    metadata:
      labels:
        app: cci-deployment  # Deployment的名称即是负载的名称
    spec:
      containers:
      - image: swr.cn-north-4.myhuaweicloud.com/namespace/demo:v1.1  # 镜像地址,传入参数image会将次镜像地址替换
        name: container-0
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: 500m
            memory: 1024Mi
          requests:
            cpu: 500m
            memory: 1024Mi
      imagePullSecrets:           # 拉取镜像使用的证书，必须为imagepull-secret
      - name: imagepull-secret
```
负载Deployment yaml文件更多介绍：[Deployment](https://support.huaweicloud.com/devg-cci/cci_05_0005.html)
