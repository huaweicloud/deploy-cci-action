import * as core from '@actions/core'
import * as context from './context'
import * as install from './install'
import * as auth from './auth'
import * as image from './image-update'
import * as deploy from './deploy-cci'


export async function run() {
    const inputs: context.Inputs = context.getInputs();
    
    // 安装cci-iam-authenticator
    await install.downloadCciIamAuthenticator();
    
    // 配置iam的aksk
    await auth.configCciAuth();
    
    // 替换镜像地址
    await image.updateImage(inputs);
    
    //部署cci
    await deploy.deployCCI();
}

run().catch(core.setFailed);
