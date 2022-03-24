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
#### 2）[创建命名空间](https://support.huaweicloud.com/qs-cci/cci_qs_0004.html)
#### 3）[创建负载](https://support.huaweicloud.com/qs-cci/cci_qs_0005.html)


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
        uses: huaweicloud/deploy-cci-action@v1.0.0
        id: deploy-to-cci
        with:
          access_key: ${{ secrets.ACCESSKEY }}
          secret_key: ${{ secrets.SECRETACCESSKEY }}
          region: ${{ env.REGION_ID }}
          manifest: './deployment.yaml' 
          images: ${{ steps.build-image.outputs.image }}

```

### 2.部署Kubernetes样例yaml文件
以下示例为一个名为cci-deployment的Deployment负载，负载在命名空间是cci-namespace-70395701，使用swr.cn-north-4.myhuaweicloud.com/namespace/demo:v1.1t镜像创建两个Pod，每个Pod占用500m core CPU、1G内存。


```yaml
apiVersion: apps/v1      # 注意这里与Pod的区别，Deployment是apps/v1而不是v1
kind: Deployment         # 资源类型为Deployment
metadata:
  name: cci-deployment            # 必填,Deployment的名称即是负载的名称
  namespace: cci-namespace-70395701  # 必填,CCI服务命名空间
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
      - image: swr.cn-north-4.myhuaweicloud.com/namespace/demo:v1.1  # 镜像地址
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

```
