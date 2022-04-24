import { SpecResp } from './SpecResp';


export class ItemResp {
    public spec?: SpecResp;
    
    public withProfile(spec: SpecResp): ItemResp {
        this['spec'] = spec;
        return this;
    }
    
    public get _spec() {
        return this['spec'];
    }
}
