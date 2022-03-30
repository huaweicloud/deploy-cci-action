import * as image from '../src/image-update'
import * as context from '../src/context'
import * as fs from 'fs'


describe('update images', () => {
  
  it('test update one image', async () => {
    const data = fs.readFileSync(
      './test/deployment-files/test.update.one.image.yaml',
      'utf8'
    )
    fs.writeFileSync(
      './test/deployment-files/test.update.one.image.copy.yaml',
      data,
      'utf8'
    )

    const mockInputs: context.Inputs = {
      accessKey: '',
      secretKey: '',
      region: '',
      manifest: './test/deployment-files/test.update.one.image.copy.yaml',
      imageList: ['swr.repace.myhuaweicloud.com/repace/repace:v1.1']
    }
    await image.updateImage(mockInputs)
    const testData = fs.readFileSync(
      './test/deployment-files/test.update.one.image.copy.yaml',
      'utf8'
    )
    const replaceData = fs.readFileSync(
      './test/deployment-files/test.update.one.image.replace.yaml',
      'utf8'
    )
    expect(testData).toEqual(replaceData)

    fs.unlinkSync('./test/deployment-files/test.update.one.image.copy.yaml')
  })

  it('test update multi image', async () => {
    const data = fs.readFileSync(
      './test/deployment-files/test.update.multi.image.yaml',
      'utf8'
    )
    fs.writeFileSync(
      './test/deployment-files/test.update.multi.image.copy.yaml',
      data,
      'utf8'
    )

    const mockInputs: context.Inputs = {
      accessKey: '',
      secretKey: '',
      region: '',
      manifest: './test/deployment-files/test.update.multi.image.copy.yaml',
      imageList:['swr.repace.myhuaweicloud.com/repace/repace:v1.1', 'swr.repace.myhuaweicloud.com/repace/repace:v1.2']
    }
    await image.updateImage(mockInputs)
    const testData = fs.readFileSync(
      './test/deployment-files/test.update.multi.image.copy.yaml',
      'utf8'
    )
    const replaceData = fs.readFileSync(
      './test/deployment-files/test.update.multi.image.replace.yaml',
      'utf8'
    )
    expect(testData).toEqual(replaceData)

    fs.unlinkSync(
      './test/deployment-files/test.update.multi.image.copy.yaml'
    )
  })
})
