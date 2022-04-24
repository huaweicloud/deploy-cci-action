export class SpecResp {
    public cidr?: string | undefined;
    public attachedVPC?: string | undefined;
    public networkType?: string | undefined;
    public networkID?: string | undefined;
    public subnetID?: string | undefined;
    public availableZone?: string | undefined;

    public withCidr(cidr: string): SpecResp {
        this['cidr'] = cidr;
        return this;
    }
    
    public withAttachedVPC(attachedVPC: string): SpecResp {
        this['attachedVPC'] = attachedVPC;
        return this;
    }
    public withNetworkType(networkType: string): SpecResp {
        this['networkType'] = networkType;
        return this;
    }
    public withNetworkID(networkID: string): SpecResp {
        this['networkID'] = networkID;
        return this;
    }
    public withSubnetID(subnetID: string): SpecResp {
        this['subnetID'] = subnetID;
        return this;
    }
    public withAvailableZone(availableZone: string): SpecResp {
        this['availableZone'] = availableZone;
        return this;
    }
    public get _subnetID() {
        return this['subnetID'];
    }
}
