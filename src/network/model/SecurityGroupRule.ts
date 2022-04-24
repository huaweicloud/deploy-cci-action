export class SecurityGroupRule {
  securityGroupId: string;
  direction = "ingress";
  ethertype =  "IPv4";
  protocol: string;
  multiport: string;
  remoteIpPrefix = "0.0.0.0/0";
  action = "allow";
  priority = "1";

  constructor(securityGroupId: string, protocol: string, multiport: string) {
          this.securityGroupId = securityGroupId
          this.protocol = protocol
          this.multiport = multiport
      }
}
