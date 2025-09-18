// Cisco ASA Configuration Parser and Generator

class ASAConfigParser {
  constructor() {
    this.config = {
      hostname: '',
      interfaces: [],
      objects: [],
      objectGroups: [],
      policies: [],
      vpns: [],
      ldap: [],
      deviceSettings: {},
      nat: [],
      staticNAT: [],
      globalNAT: [],
      routes: [],
      accessGroups: [],
      cryptoISAKMP: [],
      cryptoIPSEC: [],
      groupPolicies: [],
      tunnelGroups: [],
      users: [],
      logging: [],
      snmp: [],
      ssh: [],
      http: [],
      clock: []
    };
  }

  parseConfig(configText) {
    const lines = configText.split('\n').map(line => line.trim()).filter(line => line);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('hostname ')) {
        this.config.hostname = line.replace('hostname ', '').trim();
      } else if (line.startsWith('interface ')) {
        this.parseInterface(line, lines, i);
      } else if (line.startsWith('object network ')) {
        this.parseObject(line, lines, i);
      } else if (line.startsWith('object-group network ')) {
        this.parseObjectGroup(line, lines, i);
      } else if (line.startsWith('access-list ')) {
        this.parseAccessList(line, lines, i);
      } else if (line.startsWith('crypto map ')) {
        this.parseCryptoMap(line, lines, i);
      } else if (line.startsWith('aaa-server ')) {
        this.parseLDAP(line, lines, i);
      } else if (line.startsWith('route ')) {
        this.parseRoute(line);
      } else if (line.startsWith('nat ')) {
        this.parseNAT(line);
      } else if (line.startsWith('global ')) {
        this.parseGlobal(line);
      } else if (line.startsWith('static ')) {
        this.parseStatic(line);
      } else if (line.startsWith('access-group ')) {
        this.parseAccessGroup(line);
      } else if (line.startsWith('crypto isakmp ')) {
        this.parseCryptoISAKMP(line, lines, i);
      } else if (line.startsWith('crypto ipsec ')) {
        this.parseCryptoIPSEC(line, lines, i);
      } else if (line.startsWith('group-policy ')) {
        this.parseGroupPolicy(line, lines, i);
      } else if (line.startsWith('tunnel-group ')) {
        this.parseTunnelGroup(line, lines, i);
      } else if (line.startsWith('username ')) {
        this.parseUsername(line);
      } else if (line.startsWith('enable password')) {
        this.parseEnablePassword(line);
      } else if (line.startsWith('passwd ')) {
        this.parsePassword(line);
      } else if (line.startsWith('logging ')) {
        this.parseLogging(line);
      } else if (line.startsWith('snmp-server ')) {
        this.parseSNMP(line);
      } else if (line.startsWith('ssh ')) {
        this.parseSSH(line);
      } else if (line.startsWith('http ')) {
        this.parseHTTP(line);
      } else if (line.startsWith('clock ')) {
        this.parseClock(line);
      }
    }
    return this.config;
  }

  parseInterface(line, lines, index) {
    const interfaceName = line.split(' ')[1];
    const interfaceConfig = {
      name: interfaceName,
      ip: '',
      mask: '',
      description: '',
      securityLevel: 0,
      vlan: null
    };

    // Parse interface configuration
    for (let i = index + 1; i < lines.length; i++) {
      const nextLine = lines[i];
      if (nextLine.startsWith('!') || nextLine.startsWith('interface ')) {
        break;
      }

      if (nextLine.startsWith('nameif ')) {
        interfaceConfig.description = nextLine.replace('nameif ', '').trim();
      } else if (nextLine.startsWith('ip address ')) {
        const ipParts = nextLine.replace('ip address ', '').split(' ');
        interfaceConfig.ip = ipParts[0];
        interfaceConfig.mask = ipParts[1];
      } else if (nextLine.startsWith('security-level ')) {
        interfaceConfig.securityLevel = parseInt(nextLine.replace('security-level ', ''));
      } else if (nextLine.startsWith('vlan ')) {
        interfaceConfig.vlan = parseInt(nextLine.replace('vlan ', ''));
      }
    }
    this.config.interfaces.push(interfaceConfig);
  }

  parseObject(line, lines, index) {
    const objectName = line.replace('object network ', '').trim();
    const object = {
      name: objectName,
      type: 'host',
      value: '',
      description: ''
    };

    for (let i = index + 1; i < lines.length; i++) {
      const nextLine = lines[i];
      if (nextLine.startsWith('!') || nextLine.startsWith('object ') || nextLine.startsWith('access-list ')) {
        break;
      }
      
      if (nextLine.startsWith('host ')) {
        object.type = 'host';
        object.value = nextLine.replace('host ', '').trim();
      } else if (nextLine.startsWith('subnet ')) {
        object.type = 'subnet';
        const parts = nextLine.replace('subnet ', '').split(' ');
        object.value = parts[0];
        object.mask = parts[1];
      } else if (nextLine.startsWith('description ')) {
        object.description = nextLine.replace('description ', '').trim();
      }
    }

    this.config.objects.push(object);
  }

  parseObjectGroup(line, lines, index) {
    const groupName = line.replace('object-group network ', '').trim();
    const group = {
      name: groupName,
      type: 'network',
      members: [],
      description: ''
    };

    for (let i = index + 1; i < lines.length; i++) {
      const nextLine = lines[i];
      if (nextLine.startsWith('!') || nextLine.startsWith('object-group ') || nextLine.startsWith('access-list ')) {
        break;
      }
      
      if (nextLine.startsWith('description ')) {
        group.description = nextLine.replace('description ', '').trim();
      } else if (nextLine.startsWith('network-object ')) {
        group.members.push({
          type: 'network',
          value: nextLine.replace('network-object ', '').trim()
        });
      } else if (nextLine.startsWith('group-object ')) {
        group.members.push({
          type: 'group',
          value: nextLine.replace('group-object ', '').trim()
        });
      }
    }

    this.config.objectGroups.push(group);
  }

  parseAccessList(line, lines, index) {
    const parts = line.split(' ');
    const policy = {
      name: parts[1],
      action: parts[2],
      protocol: parts[3],
      source: parts[4],
      destination: parts[5],
      service: parts[6] || 'any',
      description: '',
      enabled: true
    };

    for (let i = index + 1; i < lines.length; i++) {
      const nextLine = lines[i];
      if (nextLine.startsWith('!') || nextLine.startsWith('access-list ') || nextLine.startsWith('object ')) {
        break;
      }
      
      if (nextLine.startsWith('description ')) {
        policy.description = nextLine.replace('description ', '').trim();
      }
    }

    this.config.policies.push(policy);
  }

  parseCryptoMap(line, lines, index) {
    const parts = line.split(' ');
    const vpn = {
      name: parts[2],
      interface: parts[3] || '',
      peer: '',
      transform: '',
      description: ''
    };

    for (let i = index + 1; i < lines.length; i++) {
      const nextLine = lines[i];
      if (nextLine.startsWith('!') || nextLine.startsWith('crypto map ')) {
        break;
      }
      
      if (nextLine.startsWith('set peer ')) {
        vpn.peer = nextLine.replace('set peer ', '').trim();
      } else if (nextLine.startsWith('set transform-set ')) {
        vpn.transform = nextLine.replace('set transform-set ', '').trim();
      } else if (nextLine.startsWith('description ')) {
        vpn.description = nextLine.replace('description ', '').trim();
      }
    }

    this.config.vpns.push(vpn);
  }

  parseLDAP(line, lines, index) {
    const parts = line.split(' ');
    const ldap = {
      name: parts[1],
      protocol: parts[2] || 'ldap',
      host: parts[3] || '',
      port: parts[4] || '389',
      description: ''
    };

    for (let i = index + 1; i < lines.length; i++) {
      const nextLine = lines[i];
      if (nextLine.startsWith('!') || nextLine.startsWith('aaa-server ')) {
        break;
      }
      
      if (nextLine.startsWith('description ')) {
        ldap.description = nextLine.replace('description ', '').trim();
      }
    }

    this.config.ldap.push(ldap);
  }

  parseRoute(line) {
    const parts = line.split(' ');
    if (parts.length >= 4) {
      this.config.routes.push({
        network: parts[1],
        mask: parts[2],
        gateway: parts[3],
        interface: parts[4] || ''
      });
    }
  }

  parseNAT(line) {
    const parts = line.split(' ');
    if (parts.length >= 3) {
      this.config.nat.push({
        source: parts[1],
        destination: parts[2],
        type: 'dynamic',
        interface: parts[3] || ''
      });
    }
  }

  parseGlobal(line) {
    const parts = line.split(' ');
    if (parts.length >= 2) {
      this.config.globalNAT.push({
        interface: parts[1],
        range: parts[2] || 'any',
        type: 'global'
      });
    }
  }

  parseStatic(line) {
    const parts = line.split(' ');
    if (parts.length >= 4) {
      this.config.staticNAT.push({
        source: parts[1],
        destination: parts[2],
        static: parts[3],
        interface: parts[4] || ''
      });
    }
  }

  parseAccessGroup(line) {
    const parts = line.split(' ');
    if (parts.length >= 3) {
      this.config.accessGroups.push({
        acl: parts[1],
        direction: parts[2],
        interface: parts[3] || ''
      });
    }
  }

  parseCryptoISAKMP(line, lines, index) {
    const policyNumber = line.split(' ')[2];
    const isakmp = {
      policy: policyNumber,
      encryption: 'aes',
      hash: 'sha',
      group: '2',
      lifetime: '86400'
    };

    for (let i = index + 1; i < lines.length; i++) {
      const nextLine = lines[i];
      if (nextLine.startsWith('!') || nextLine.startsWith('crypto ')) {
        break;
      }

      if (nextLine.startsWith('authentication ')) {
        isakmp.authentication = nextLine.replace('authentication ', '').trim();
      } else if (nextLine.startsWith('encryption ')) {
        isakmp.encryption = nextLine.replace('encryption ', '').trim();
      } else if (nextLine.startsWith('hash ')) {
        isakmp.hash = nextLine.replace('hash ', '').trim();
      } else if (nextLine.startsWith('group ')) {
        isakmp.group = nextLine.replace('group ', '').trim();
      } else if (nextLine.startsWith('lifetime ')) {
        isakmp.lifetime = nextLine.replace('lifetime ', '').trim();
      }
    }
    this.config.cryptoISAKMP.push(isakmp);
  }

  parseCryptoIPSEC(line, lines, index) {
    const transformName = line.split(' ')[2];
    const transform = {
      name: transformName,
      protocol: 'esp',
      encryption: 'aes',
      hash: 'sha'
    };

    for (let i = index + 1; i < lines.length; i++) {
      const nextLine = lines[i];
      if (nextLine.startsWith('!') || nextLine.startsWith('crypto ')) {
        break;
      }

      if (nextLine.startsWith('esp-')) {
        const espParts = nextLine.split(' ');
        transform.encryption = espParts[0].replace('esp-', '');
        transform.hash = espParts[1] ? espParts[1].replace('esp-', '') : 'sha';
      }
    }
    this.config.cryptoIPSEC.push(transform);
  }

  parseGroupPolicy(line, lines, index) {
    const policyName = line.split(' ')[1];
    const policy = {
      name: policyName,
      type: 'internal',
      attributes: {}
    };

    for (let i = index + 1; i < lines.length; i++) {
      const nextLine = lines[i];
      if (nextLine.startsWith('!') || nextLine.startsWith('group-policy ')) {
        break;
      }

      if (nextLine.startsWith('vpn-tunnel-protocol ')) {
        policy.attributes.vpnProtocol = nextLine.replace('vpn-tunnel-protocol ', '').trim();
      } else if (nextLine.startsWith('dns-server ')) {
        policy.attributes.dnsServer = nextLine.replace('dns-server ', '').trim();
      }
    }
    this.config.groupPolicies.push(policy);
  }

  parseTunnelGroup(line, lines, index) {
    const groupName = line.split(' ')[1];
    const tunnelGroup = {
      name: groupName,
      type: 'ipsec-ra',
      generalAttributes: {},
      ipsecAttributes: {}
    };

    for (let i = index + 1; i < lines.length; i++) {
      const nextLine = lines[i];
      if (nextLine.startsWith('!') || nextLine.startsWith('tunnel-group ')) {
        break;
      }

      if (nextLine.startsWith('general-attributes')) {
        // Parse general attributes
        for (let j = i + 1; j < lines.length; j++) {
          const attrLine = lines[j];
          if (attrLine.startsWith('!') || attrLine.startsWith('tunnel-group ') || attrLine.startsWith('ipsec-attributes')) {
            break;
          }
          if (attrLine.startsWith('default-group-policy ')) {
            tunnelGroup.generalAttributes.defaultGroupPolicy = attrLine.replace('default-group-policy ', '').trim();
          }
        }
      } else if (nextLine.startsWith('ipsec-attributes')) {
        // Parse ipsec attributes
        for (let j = i + 1; j < lines.length; j++) {
          const attrLine = lines[j];
          if (attrLine.startsWith('!') || attrLine.startsWith('tunnel-group ')) {
            break;
          }
          if (attrLine.startsWith('ikev1 pre-shared-key ')) {
            tunnelGroup.ipsecAttributes.preSharedKey = attrLine.replace('ikev1 pre-shared-key ', '').trim();
          }
        }
      }
    }
    this.config.tunnelGroups.push(tunnelGroup);
  }

  parseUsername(line) {
    const parts = line.split(' ');
    if (parts.length >= 2) {
      this.config.users.push({
        username: parts[1],
        password: parts[2] || '',
        privilege: parts[3] || '15',
        type: 'local'
      });
    }
  }

  parseEnablePassword(line) {
    this.config.deviceSettings.enablePassword = line.replace('enable password ', '').trim();
  }

  parsePassword(line) {
    this.config.deviceSettings.password = line.replace('passwd ', '').trim();
  }

  parseLogging(line) {
    const parts = line.split(' ');
    if (parts.length >= 3) {
      this.config.logging.push({
        type: parts[1],
        destination: parts[2],
        level: parts[3] || 'informational'
      });
    }
  }

  parseSNMP(line) {
    const parts = line.split(' ');
    if (parts.length >= 3) {
      this.config.snmp.push({
        type: parts[1],
        destination: parts[2],
        community: parts[3] || 'public',
        version: parts[4] || '2c'
      });
    }
  }

  parseSSH(line) {
    const parts = line.split(' ');
    if (parts.length >= 3) {
      this.config.ssh.push({
        version: parts[1],
        network: parts[2],
        interface: parts[3] || '',
        timeout: parts[4] || '5'
      });
    }
  }

  parseHTTP(line) {
    const parts = line.split(' ');
    if (parts.length >= 2) {
      this.config.http.push({
        network: parts[1],
        interface: parts[2] || '',
        port: parts[3] || '80'
      });
    }
  }

  parseClock(line) {
    const parts = line.split(' ');
    if (parts.length >= 3) {
      this.config.clock.push({
        type: parts[1],
        value: parts[2],
        zone: parts[3] || ''
      });
    }
  }
}

class ASAConfigGenerator {
  constructor(parsedConfig, sourceVendor) {
    this.parsedConfig = parsedConfig;
    this.sourceVendor = sourceVendor;
  }

  generateConfig() {
    // This would generate ASA configuration from other vendors
    // For now, return a placeholder
    let config = '# Cisco ASA Configuration\n';
    config += '# Generated from ' + this.sourceVendor + ' configuration\n\n';
    
    config += 'hostname ' + (this.parsedConfig.hostname || 'asa-converted') + '\n\n';
    
    // Add interfaces
    this.parsedConfig.interfaces.forEach(iface => {
      config += `interface ${iface.name}\n`;
      if (iface.description) config += ` nameif ${iface.description}\n`;
      if (iface.ip) config += ` ip address ${iface.ip} ${iface.mask}\n`;
      if (iface.securityLevel) config += ` security-level ${iface.securityLevel}\n`;
      config += '!\n';
    });
    
    return config;
  }
}

module.exports = {
  ASAConfigParser,
  ASAConfigGenerator
};
