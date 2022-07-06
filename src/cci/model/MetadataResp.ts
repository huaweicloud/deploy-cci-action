export class MetadataResp {
  private name?: string | undefined;
  public uid?: string | undefined;

  public withName(name: string): MetadataResp {
    this['name'] = name;
    return this;
  }
  public set _name(name: string | undefined) {
    this['name'] = name;
  }
  public get _name() {
    return this['name'];
  }
  
  public withUid(uid: string): MetadataResp {
    this['uid'] = uid;
    return this;
  }
  public set _uid(uid: string | undefined) {
    this['uid'] = uid;
  }
  public get _uid() {
    return this['uid'];
  }
}
