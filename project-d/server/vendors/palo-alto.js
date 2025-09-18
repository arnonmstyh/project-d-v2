// Palo Alto Networks PAN-OS Configuration Parser and Generator

class PaloAltoConfigParser {
  constructor() {
    this.config = {
      hostname: '',
      interfaces: [],
      zones: [],
      addresses: [],
      addressGroups: [],
      services: [],
      serviceGroups: [],
      securityPolicies: [],
      natPolicies: [],
      users: [],
      logging: [],
      snmp: [],
      ssh: [],
      http: [],
      clock: [],
      securityProfiles: [],
      applications: [],
      urlCategories: []
    };
  }

  parseConfig(configText) {
    // Parse XML configuration
    const lines = configText.split('\n').map(line => line.trim()).filter(line => line);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('<hostname>')) {
        this.config.hostname = this.extractXmlValue(line, 'hostname');
      } else if (line.includes('<entry name=') && line.includes('ethernet')) {
        this.parseInterface(line, lines, i);
      } else if (line.includes('<entry name=') && line.includes('address')) {
        this.parseAddress(line, lines, i);
      } else if (line.includes('<entry name=') && line.includes('address-group')) {
        this.parseAddressGroup(line, lines, i);
      } else if (line.includes('<entry name=') && line.includes('service')) {
        this.parseService(line, lines, i);
      } else if (line.includes('<entry name=') && line.includes('security-policy')) {
        this.parseSecurityPolicy(line, lines, i);
      } else if (line.includes('<entry name=') && line.includes('nat-policy')) {
        this.parseNATPolicy(line, lines, i);
      } else if (line.includes('<entry name=') && line.includes('zone')) {
        this.parseZone(line, lines, i);
      }
    }
    
    return this.config;
  }

  extractXmlValue(line, tag) {
    const regex = new RegExp(`<${tag}>(.*?)</${tag}>`);
    const match = line.match(regex);
    return match ? match[1] : '';
  }

  parseInterface(line, lines, index) {
    const interfaceName = this.extractXmlAttribute(line, 'name');
    const interfaceConfig = {
      name: interfaceName,
      type: 'ethernet',
      ip: '',
      mask: '',
      zone: '',
      description: ''
    };

    // Parse interface configuration from XML
    for (let i = index; i < lines.length && !lines[i].includes('</entry>'); i++) {
      const currentLine = lines[i];
      
      if (currentLine.includes('<ip>')) {
        const ipLine = lines[i + 1];
        if (ipLine.includes('<entry name=')) {
          interfaceConfig.ip = this.extractXmlAttribute(ipLine, 'name');
        }
      } else if (currentLine.includes('<zone>')) {
        interfaceConfig.zone = this.extractXmlValue(currentLine, 'zone');
      } else if (currentLine.includes('<comment>')) {
        interfaceConfig.description = this.extractXmlValue(currentLine, 'comment');
      }
    }

    this.config.interfaces.push(interfaceConfig);
  }

  parseAddress(line, lines, index) {
    const addressName = this.extractXmlAttribute(line, 'name');
    const address = {
      name: addressName,
      type: 'ip-netmask',
      value: '',
      description: ''
    };

    for (let i = index; i < lines.length && !lines[i].includes('</entry>'); i++) {
      const currentLine = lines[i];
      
      if (currentLine.includes('<ip-netmask>')) {
        address.value = this.extractXmlValue(currentLine, 'ip-netmask');
      } else if (currentLine.includes('<description>')) {
        address.description = this.extractXmlValue(currentLine, 'description');
      }
    }

    this.config.addresses.push(address);
  }

  parseAddressGroup(line, lines, index) {
    const groupName = this.extractXmlAttribute(line, 'name');
    const group = {
      name: groupName,
      members: [],
      description: ''
    };

    for (let i = index; i < lines.length && !lines[i].includes('</entry>'); i++) {
      const currentLine = lines[i];
      
      if (currentLine.includes('<static>')) {
        const memberLine = lines[i + 1];
        if (memberLine.includes('<member>')) {
          group.members.push(this.extractXmlValue(memberLine, 'member'));
        }
      } else if (currentLine.includes('<description>')) {
        group.description = this.extractXmlValue(currentLine, 'description');
      }
    }

    this.config.addressGroups.push(group);
  }

  parseService(line, lines, index) {
    const serviceName = this.extractXmlAttribute(line, 'name');
    const service = {
      name: serviceName,
      protocol: 'tcp',
      port: '',
      description: ''
    };

    for (let i = index; i < lines.length && !lines[i].includes('</entry>'); i++) {
      const currentLine = lines[i];
      
      if (currentLine.includes('<protocol>')) {
        service.protocol = this.extractXmlValue(currentLine, 'protocol');
      } else if (currentLine.includes('<port>')) {
        service.port = this.extractXmlValue(currentLine, 'port');
      } else if (currentLine.includes('<description>')) {
        service.description = this.extractXmlValue(currentLine, 'description');
      }
    }

    this.config.services.push(service);
  }

  parseSecurityPolicy(line, lines, index) {
    const policyName = this.extractXmlAttribute(line, 'name');
    const policy = {
      name: policyName,
      source: [],
      destination: [],
      service: [],
      action: 'allow',
      description: ''
    };

    for (let i = index; i < lines.length && !lines[i].includes('</entry>'); i++) {
      const currentLine = lines[i];
      
      if (currentLine.includes('<source>')) {
        const memberLine = lines[i + 1];
        if (memberLine.includes('<member>')) {
          policy.source.push(this.extractXmlValue(memberLine, 'member'));
        }
      } else if (currentLine.includes('<destination>')) {
        const memberLine = lines[i + 1];
        if (memberLine.includes('<member>')) {
          policy.destination.push(this.extractXmlValue(memberLine, 'member'));
        }
      } else if (currentLine.includes('<service>')) {
        const memberLine = lines[i + 1];
        if (memberLine.includes('<member>')) {
          policy.service.push(this.extractXmlValue(memberLine, 'member'));
        }
      } else if (currentLine.includes('<action>')) {
        policy.action = this.extractXmlValue(currentLine, 'action');
      } else if (currentLine.includes('<description>')) {
        policy.description = this.extractXmlValue(currentLine, 'description');
      }
    }

    this.config.securityPolicies.push(policy);
  }

  parseNATPolicy(line, lines, index) {
    const policyName = this.extractXmlAttribute(line, 'name');
    const natPolicy = {
      name: policyName,
      source: [],
      destination: [],
      service: [],
      action: 'dynamic-ip',
      description: ''
    };

    for (let i = index; i < lines.length && !lines[i].includes('</entry>'); i++) {
      const currentLine = lines[i];
      
      if (currentLine.includes('<source-translation>')) {
        const transLine = lines[i + 1];
        if (transLine.includes('<dynamic-ip-and-port>')) {
          natPolicy.action = 'dynamic-ip-and-port';
        }
      } else if (currentLine.includes('<description>')) {
        natPolicy.description = this.extractXmlValue(currentLine, 'description');
      }
    }

    this.config.natPolicies.push(natPolicy);
  }

  parseZone(line, lines, index) {
    const zoneName = this.extractXmlAttribute(line, 'name');
    const zone = {
      name: zoneName,
      type: 'layer3',
      interfaces: [],
      description: ''
    };

    for (let i = index; i < lines.length && !lines[i].includes('</entry>'); i++) {
      const currentLine = lines[i];
      
      if (currentLine.includes('<network>')) {
        const memberLine = lines[i + 1];
        if (memberLine.includes('<layer3>')) {
          const interfaceLine = lines[i + 2];
          if (interfaceLine.includes('<member>')) {
            zone.interfaces.push(this.extractXmlValue(interfaceLine, 'member'));
          }
        }
      } else if (currentLine.includes('<description>')) {
        zone.description = this.extractXmlValue(currentLine, 'description');
      }
    }

    this.config.zones.push(zone);
  }

  extractXmlAttribute(line, attribute) {
    const regex = new RegExp(`${attribute}="([^"]*)"`);
    const match = line.match(regex);
    return match ? match[1] : '';
  }
}

class PaloAltoConfigGenerator {
  constructor(parsedConfig, sourceVendor) {
    this.parsedConfig = parsedConfig;
    this.sourceVendor = sourceVendor;
  }

  generateConfig() {
    let config = '<?xml version="1.0" encoding="UTF-8"?>\n';
    config += '<config version="10.0" urldb="paloaltonetworks">\n';
    config += '  <devices>\n';
    config += '    <entry name="localhost.localdomain">\n';
    config += '      <deviceconfig>\n';
    config += '        <system>\n';
    config += `          <hostname>${this.parsedConfig.hostname || 'palo-alto-converted'}</hostname>\n`;
    config += '        </system>\n';
    config += '      </deviceconfig>\n';
    config += '      <network>\n';
    config += '        <interface>\n';
    config += '          <ethernet>\n';
    
    // Add interfaces
    this.parsedConfig.interfaces.forEach(iface => {
      config += `            <entry name="${iface.name}">\n`;
      if (iface.zone) config += `              <zone>${iface.zone}</zone>\n`;
      if (iface.ip) config += `              <ip>\n                <entry name="${iface.ip}"/>\n              </ip>\n`;
      if (iface.description) config += `              <comment>${iface.description}</comment>\n`;
      config += '            </entry>\n';
    });
    
    config += '          </ethernet>\n';
    config += '        </interface>\n';
    config += '      </network>\n';
    config += '    </entry>\n';
    config += '  </devices>\n';
    config += '</config>\n';
    
    return config;
  }
}

module.exports = {
  PaloAltoConfigParser,
  PaloAltoConfigGenerator
};
