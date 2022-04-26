const DIRECTION_INGRESS = "ingress"
const IP_ADDRESS_PROTOCOL_TYPE_IPV4 = "IPv4"
const REMOTE_IP_PREFIX = "0.0.0.0/0"
const ACTION_ALLOW = "allow"
const HIGHEST_PRIORITY = "1"




export class SecurityGroupRule {
  securityGroupId: string;
  direction = DIRECTION_INGRESS;
  ethertype =  IP_ADDRESS_PROTOCOL_TYPE_IPV4;
  protocol: string;
  multiport: string;
  remoteIpPrefix = REMOTE_IP_PREFIX;
  action = ACTION_ALLOW;
  priority = HIGHEST_PRIORITY;

  constructor(securityGroupId: string, protocol: string, multiport: string) {
          this.securityGroupId = securityGroupId
          this.protocol = protocol
          this.multiport = multiport
      }
}
