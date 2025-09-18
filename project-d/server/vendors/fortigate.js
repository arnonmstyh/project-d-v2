// FortiGate Configuration Parser and Generator (for reverse conversion)

class FortiGateConfigParser {
  constructor() {
    this.config = {
      hostname: '',
      interfaces: [],
      addresses: [],
      addressGroups: [],
      policies: [],
      natPolicies: [],
      routes: [],
      users: [],
      logging: [],
      snmp: [],
      ssh: [],
      http: [],
      clock: [],
      vpns: [],
      ipsecPhase1: [],
      ipsecPhase2: []
    };
  }

  parseConfig(configText) {
    const lines = configText.split('\n').map(line => line.trim()).filter(line => line);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('config system global')) {
        this.parseSystemGlobal(line, lines, i);
      } else if (line.startsWith('config system interface')) {
        this.parseInterfaces(line, lines, i);
      } else if (line.startsWith('config firewall address')) {
        this.parseAddresses(line, lines, i);
      } else if (line.startsWith('config firewall addrgrp')) {
        this.parseAddressGroups(line, lines, i);
      } else if (line.startsWith('config firewall policy')) {
        this.parsePolicies(line, lines, i);
      } else if (line.startsWith('config router static')) {
        this.parseRoutes(line, lines, i);
      } else if (line.startsWith('config vpn ipsec phase1-interface')) {
        this.parseIPSecPhase1(line, lines, i);
      } else if (line.startsWith('config vpn ipsec phase2-interface')) {
        this.parseIPSecPhase2(line, lines, i);
      }
    }
    
    return this.config;
  }

  parseSystemGlobal(line, lines, index) {
    for (let i = index; i < lines.length && !lines[i].includes('end'); i++) {
      const currentLine = lines[i];
      if (currentLine.includes('set hostname')) {
        this.config.hostname = currentLine.split('"')[1];
      }
    }
  }

  parseInterfaces(line, lines, index) {
    for (let i = index; i < lines.length && !lines[i].includes('end'); i++) {
      const currentLine = lines[i];
      if (currentLine.includes('edit "')) {
        const interfaceName = currentLine.split('"')[1];
        const interfaceConfig = {
          name: interfaceName,
          ip: '',
          mask: '',
          description: '',
          zone: 'untrust'
        };

        // Parse interface configuration
        for (let j = i + 1; j < lines.length && !lines[j].includes('next') && !lines[j].includes('end'); j++) {
          const configLine = lines[j];
          if (configLine.includes('set ip ')) {
            const ipParts = configLine.split('set ip ')[1].split(' ');
            interfaceConfig.ip = ipParts[0];
            interfaceConfig.mask = ipParts[1];
          } else if (configLine.includes('set alias ')) {
            interfaceConfig.description = configLine.split('"')[1];
          }
        }

        this.config.interfaces.push(interfaceConfig);
      }
    }
  }

  parseAddresses(line, lines, index) {
    for (let i = index; i < lines.length && !lines[i].includes('end'); i++) {
      const currentLine = lines[i];
      if (currentLine.includes('edit "')) {
        const addressName = currentLine.split('"')[1];
        const address = {
          name: addressName,
          type: 'ipmask',
          value: '',
          description: ''
        };

        for (let j = i + 1; j < lines.length && !lines[j].includes('next') && !lines[j].includes('end'); j++) {
          const configLine = lines[j];
          if (configLine.includes('set subnet ')) {
            address.value = configLine.split('set subnet ')[1];
          } else if (configLine.includes('set comment ')) {
            address.description = configLine.split('"')[1];
          }
        }

        this.config.addresses.push(address);
      }
    }
  }

  parseAddressGroups(line, lines, index) {
    for (let i = index; i < lines.length && !lines[i].includes('end'); i++) {
      const currentLine = lines[i];
      if (currentLine.includes('edit "')) {
        const groupName = currentLine.split('"')[1];
        const group = {
          name: groupName,
          members: [],
          description: ''
        };

        for (let j = i + 1; j < lines.length && !lines[j].includes('next') && !lines[j].includes('end'); j++) {
          const configLine = lines[j];
          if (configLine.includes('set member ')) {
            const members = configLine.split('set member ')[1].split(' ');
            group.members = members;
          } else if (configLine.includes('set comment ')) {
            group.description = configLine.split('"')[1];
          }
        }

        this.config.addressGroups.push(group);
      }
    }
  }

  parsePolicies(line, lines, index) {
    for (let i = index; i < lines.length && !lines[i].includes('end'); i++) {
      const currentLine = lines[i];
      if (currentLine.includes('edit ')) {
        const policyId = currentLine.split('edit ')[1];
        const policy = {
          id: policyId,
          name: '',
          source: [],
          destination: [],
          service: [],
          action: 'deny',
          description: ''
        };

        for (let j = i + 1; j < lines.length && !lines[j].includes('next') && !lines[j].includes('end'); j++) {
          const configLine = lines[j];
          if (configLine.includes('set name ')) {
            policy.name = configLine.split('"')[1];
          } else if (configLine.includes('set srcaddr ')) {
            policy.source = configLine.split('set srcaddr ')[1].split(' ');
          } else if (configLine.includes('set dstaddr ')) {
            policy.destination = configLine.split('set dstaddr ')[1].split(' ');
          } else if (configLine.includes('set service ')) {
            policy.service = configLine.split('set service ')[1].split(' ');
          } else if (configLine.includes('set action ')) {
            policy.action = configLine.split('set action ')[1];
          } else if (configLine.includes('set comment ')) {
            policy.description = configLine.split('"')[1];
          }
        }

        this.config.policies.push(policy);
      }
    }
  }

  parseRoutes(line, lines, index) {
    for (let i = index; i < lines.length && !lines[i].includes('end'); i++) {
      const currentLine = lines[i];
      if (currentLine.includes('edit ')) {
        const routeId = currentLine.split('edit ')[1];
        const route = {
          id: routeId,
          network: '',
          mask: '',
          gateway: '',
          interface: ''
        };

        for (let j = i + 1; j < lines.length && !lines[j].includes('next') && !lines[j].includes('end'); j++) {
          const configLine = lines[j];
          if (configLine.includes('set dst ')) {
            const dstParts = configLine.split('set dst ')[1].split(' ');
            route.network = dstParts[0];
            route.mask = dstParts[1];
          } else if (configLine.includes('set gateway ')) {
            route.gateway = configLine.split('set gateway ')[1];
          } else if (configLine.includes('set device ')) {
            route.interface = configLine.split('set device ')[1];
          }
        }

        this.config.routes.push(route);
      }
    }
  }

  parseIPSecPhase1(line, lines, index) {
    for (let i = index; i < lines.length && !lines[i].includes('end'); i++) {
      const currentLine = lines[i];
      if (currentLine.includes('edit "')) {
        const phase1Name = currentLine.split('"')[1];
        const phase1 = {
          name: phase1Name,
          type: 'ikev1',
          interface: 'wan1',
          peer: '',
          proposal: 'aes128-sha256'
        };

        for (let j = i + 1; j < lines.length && !lines[j].includes('next') && !lines[j].includes('end'); j++) {
          const configLine = lines[j];
          if (configLine.includes('set remote-gw ')) {
            phase1.peer = configLine.split('set remote-gw ')[1];
          } else if (configLine.includes('set proposal ')) {
            phase1.proposal = configLine.split('set proposal ')[1];
          }
        }

        this.config.ipsecPhase1.push(phase1);
      }
    }
  }

  parseIPSecPhase2(line, lines, index) {
    for (let i = index; i < lines.length && !lines[i].includes('end'); i++) {
      const currentLine = lines[i];
      if (currentLine.includes('edit "')) {
        const phase2Name = currentLine.split('"')[1];
        const phase2 = {
          name: phase2Name,
          phase1name: '',
          proposal: 'aes128-sha256',
          srcSubnet: '0.0.0.0/0.0.0.0',
          dstSubnet: '0.0.0.0/0.0.0.0'
        };

        for (let j = i + 1; j < lines.length && !lines[j].includes('next') && !lines[j].includes('end'); j++) {
          const configLine = lines[j];
          if (configLine.includes('set phase1name ')) {
            phase2.phase1name = configLine.split('set phase1name ')[1];
          } else if (configLine.includes('set proposal ')) {
            phase2.proposal = configLine.split('set proposal ')[1];
          } else if (configLine.includes('set src-subnet ')) {
            phase2.srcSubnet = configLine.split('set src-subnet ')[1];
          } else if (configLine.includes('set dst-subnet ')) {
            phase2.dstSubnet = configLine.split('set dst-subnet ')[1];
          }
        }

        this.config.ipsecPhase2.push(phase2);
      }
    }
  }
}

class FortiGateConfigGenerator {
  constructor(parsedConfig, sourceVendor) {
    this.parsedConfig = parsedConfig;
    this.sourceVendor = sourceVendor;
  }

  generateConfig() {
    // This would generate FortiGate configuration from other vendors
    // For now, return a placeholder
    let config = '# FortiGate Configuration\n';
    config += '# Generated from ' + this.sourceVendor + ' configuration\n\n';
    
    config += 'config system global\n';
    config += `    set hostname "${this.parsedConfig.hostname || 'fortigate-converted'}"\n`;
    config += 'end\n\n';
    
    return config;
  }
}

module.exports = {
  FortiGateConfigParser,
  FortiGateConfigGenerator
};
