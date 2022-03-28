import * as image from '../src/image-update';
import * as context from '../src/context';
import * as fs from 'fs'

describe("split", () => {
    it('test one image url split', () => {
        expect(image.getImageArray('image1')).toEqual(['image1']);
    });
    
    it('test multi image url split', () => {
        expect(image.getImageArray('image1,image2')).toEqual(['image1','image2']);
    });
    
    it('test no image url split', () => {
        expect(image.getImageArray('')).toEqual(['']);
    });
});



describe("update images", () => {
    it('test file does not exist', async () => {
        let replaceMatchingFileContentSpy = jest.spyOn(image, 'replaceMatchingFileContent');
        const mockInputs: context.Inputs = {
            accessKey: '',
            secretKey: '',
            region: '',
            manifest: 'test.yml',
            images: 'image1,image2'
        };
        await expect(image.updateImage(mockInputs)).rejects.toThrow('Manifest file does not exist.');
        expect(replaceMatchingFileContentSpy).not.toHaveBeenCalled();
    });

    it('test update one image', async () => {
        const data = fs.readFileSync('./test/deployment-files/deployment.one.image.test.yaml', 'utf8');
        fs.writeFileSync('./test/deployment-files/deployment.one.image.test.copy.yaml', data, 'utf8');

        const mockInputs: context.Inputs = {
            accessKey: '',
            secretKey: '',
            region: '',
            manifest: './test/deployment-files/deployment.one.image.test.copy.yaml',
            images: 'swr.repace.myhuaweicloud.com/repace/repace:v1.1'
        };
        await image.updateImage(mockInputs);
        const testData = fs.readFileSync('./test/deployment-files/deployment.one.image.test.copy.yaml', 'utf8');
        const replaceData = fs.readFileSync('./test/deployment-files/deployment.one.image.test.replace.yaml', 'utf8');
        expect(testData).toEqual(replaceData);

        fs.unlinkSync('./test/deployment-files/deployment.one.image.test.copy.yaml');
    });

    it('test update multi image', async () => {
        const data = fs.readFileSync('./test/deployment-files/deployment.multi.image.test.yaml', 'utf8');
        fs.writeFileSync('./test/deployment-files/deployment.multi.image.test.copy.yaml', data, 'utf8');

        const mockInputs: context.Inputs = {
            accessKey: '',
            secretKey: '',
            region: '',
            manifest: './test/deployment-files/deployment.multi.image.test.copy.yaml',
            images: 'swr.repace.myhuaweicloud.com/repace/repace:v1.1,swr.repace.myhuaweicloud.com/repace/repace:v1.2'
        };
        await image.updateImage(mockInputs);
        const testData = fs.readFileSync('./test/deployment-files/deployment.multi.image.test.copy.yaml', 'utf8');
        const replaceData = fs.readFileSync('./test/deployment-files/deployment.multi.image.test.replace.yaml', 'utf8');
        expect(testData).toEqual(replaceData);

        fs.unlinkSync('./test/deployment-files/deployment.multi.image.test.copy.yaml');
    });

});




