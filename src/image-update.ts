import * as core from '@actions/core';
import * as context from './context';
import * as fs from 'fs'
import * as path from 'path';

/*
 * 更新k8s模板文件的镜像url
 */
export async function updateImage(inputs: context.Inputs): Promise<void> {
    core.info('update manifest file');
    // const inputs: context.Inputs = context.getInputs();
    let imageArray:string[] = getImageArray(inputs.images);
    let manifestPath:string = path.resolve(inputs.manifest);
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error("Manifest file does not exist");
    }
    
    /*
     * manifest文件镜像信息替换成占位符
     */
    const prePlaceholder:string = "IMAGE_PLACEHOLDER_";
    for (var i = 0; i < imageArray.length; i++) {
        var replaceStr = prePlaceholder + i;
        //readFile方法读取文件内容
        var data = fs.readFileSync(manifestPath, 'utf8');
        var placeholder = data.replace(RegExp("image: .*"), replaceStr);
        //writeFile改写文件内容
        fs.writeFileSync(manifestPath, placeholder, 'utf8');
    }

    /*
     * 镜像占位符替换成新镜像信息
     */
    for (var i = 0; i < imageArray.length; i++) {
        var replaceStr = prePlaceholder + i;
        //readFile方法读取文件内容
        var data = fs.readFileSync(manifestPath, 'utf8');
        core.info(imageArray[i]);
        var result = data.replace(RegExp(replaceStr), "image: \'" +imageArray[i] + "\'");
        //writeFile改写文件内容
        fs.writeFileSync(manifestPath, result, 'utf8');
    }
    
}

function getImageArray(images: string):string[]{
    return images.split(","); 
}
