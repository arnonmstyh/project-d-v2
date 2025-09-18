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
    config += '  <shared>\n';
    // Addresses
    if (Array.isArray(this.parsedConfig.addresses) && this.parsedConfig.addresses.length > 0) {
      config += '    <address>\n';
      this.parsedConfig.addresses.forEach(addr => {
        const desc = addr.description ? `<description>${escapeXml(addr.description)}</description>` : '';
        config += `      <entry name="${escapeXml(addr.name || 'addr')}">\n`;
        config += `        <ip-netmask>${escapeXml(addr.value || '0.0.0.0/32')}</ip-netmask>\n`;
        if (desc) config += `        ${desc}\n`;
        config += '      </entry>\n';
      });
      config += '    </address>\n';
    }
    // Address groups
    if (Array.isArray(this.parsedConfig.addressGroups) && this.parsedConfig.addressGroups.length > 0) {
      config += '    <address-group>\n';
      this.parsedConfig.addressGroups.forEach(grp => {
        const desc = grp.description ? `<description>${escapeXml(grp.description)}</description>` : '';
        config += `      <entry name="${escapeXml(grp.name || 'addrgrp')}">\n`;
        if (Array.isArray(grp.members) && grp.members.length > 0) {
          config += '        <static>\n';
          grp.members.forEach(m => {
            config += `          <member>${escapeXml(m)}</member>\n`;
          });
          config += '        </static>\n';
        }
        if (desc) config += `        ${desc}\n`;
        config += '      </entry>\n';
      });
      config += '    </address-group>\n';
    }
    config += '  </shared>\n';

    config += '  <devices>\n';
    config += '    <entry name="localhost.localdomain">\n';
    config += '      <deviceconfig>\n';
    config += '        <system>\n';
    config += `          <hostname>${escapeXml(this.parsedConfig.hostname || 'palo-alto-converted')}</hostname>\n`;
    config += '        </system>\n';
    config += '      </deviceconfig>\n';
    config += '      <vsys>\n';
    config += '        <entry name="vsys1">\n';
    config += '          <rulebase>\n';
    // Security rules (prefer native PAN structure; fallback to generic ASA-style policies)
    const derivedRules = Array.isArray(this.parsedConfig.securityPolicies) && this.parsedConfig.securityPolicies.length > 0
      ? this.parsedConfig.securityPolicies
      : (Array.isArray(this.parsedConfig.policies) ? this.parsedConfig.policies.map((p, idx) => ({
          name: p.name || `rule-${idx + 1}`,
          source: p.source && p.source !== 'any' ? [p.source] : ['any'],
          destination: p.destination && p.destination !== 'any' ? [p.destination] : ['any'],
          service: p.service && p.service !== 'any' ? [p.service] : ['application-default'],
          action: (p.action === 'permit' || p.action === 'allow') ? 'allow' : 'deny',
          description: p.description || ''
        })) : []);

    if (derivedRules.length > 0) {
      config += '            <security>\n';
      config += '              <rules>\n';
      derivedRules.forEach(rule => {
        const name = escapeXml(rule.name || 'rule-1');
        config += `                <entry name="${name}">\n`;
        // Sources
        config += '                  <from>\n';
        config += '                    <member>any</member>\n';
        config += '                  </from>\n';
        config += '                  <to>\n';
        config += '                    <member>any</member>\n';
        config += '                  </to>\n';
        config += '                  <source>\n';
        (rule.source && rule.source.length ? rule.source : ['any']).forEach(s => {
          config += `                    <member>${escapeXml(s)}</member>\n`;
        });
        config += '                  </source>\n';
        config += '                  <destination>\n';
        (rule.destination && rule.destination.length ? rule.destination : ['any']).forEach(d => {
          config += `                    <member>${escapeXml(d)}</member>\n`;
        });
        config += '                  </destination>\n';
        config += '                  <service>\n';
        (rule.service && rule.service.length ? rule.service : ['application-default']).forEach(sv => {
          config += `                    <member>${escapeXml(sv)}</member>\n`;
        });
        config += '                  </service>\n';
        config += `                  <action>${rule.action === 'deny' ? 'deny' : 'allow'}</action>\n`;
        if (rule.description) config += `                  <description>${escapeXml(rule.description)}</description>\n`;
        config += '                </entry>\n';
      });
      config += '              </rules>\n';
      config += '            </security>\n';
    }
    config += '          </rulebase>\n';
    config += '        </entry>\n';
    config += '      </vsys>\n';
    // Network interfaces
    config += '      <network>\n';
    config += '        <interface>\n';
    config += '          <ethernet>\n';
    
    // Generate interfaces with proper configuration
    console.log(`[Palo Alto Generator] Processing ${this.parsedConfig.interfaces ? this.parsedConfig.interfaces.length : 0} interfaces`);
    if (Array.isArray(this.parsedConfig.interfaces) && this.parsedConfig.interfaces.length > 0) {
      this.parsedConfig.interfaces.forEach((iface, index) => {
        console.log(`[Palo Alto Generator] Interface ${index + 1}: ${iface.name} - ${iface.ip}/${iface.mask} (${iface.zone})`);
        const name = escapeXml(iface.name || `ethernet1/${index + 1}`);
        const zone = iface.zone || (iface.name && iface.name.includes('wan') ? 'untrust' : 'trust');
        
        config += `            <entry name="${name}">\n`;
        
        // Layer 3 configuration with IP and subnet
        if (iface.ip && iface.mask) {
          config += '              <layer3>\n';
          config += '                <ip>\n';
          const cidr = this.convertSubnetToCidr(iface.mask);
          config += `                  <entry name="${escapeXml(iface.ip)}/${cidr}"/>\n`;
          config += '                </ip>\n';
          config += '              </layer3>\n';
        } else if (iface.ip) {
          // If only IP is provided, assume /24
          config += '              <layer3>\n';
          config += '                <ip>\n';
          config += `                  <entry name="${escapeXml(iface.ip)}/24"/>\n`;
          config += '                </ip>\n';
          config += '              </layer3>\n';
        }
        
        // Interface comment/description
        if (iface.description) {
          config += `              <comment>${escapeXml(iface.description)}</comment>\n`;
        }
        
        config += '            </entry>\n';
      });
    } else {
      // Default interfaces if none provided
      const defaultInterfaces = [
        { name: 'ethernet1/1', ip: '192.168.1.1', mask: '255.255.255.0', description: 'LAN Interface', zone: 'trust' },
        { name: 'ethernet1/2', ip: '203.0.113.1', mask: '255.255.255.252', description: 'WAN Interface', zone: 'untrust' }
      ];
      
      defaultInterfaces.forEach(iface => {
        config += `            <entry name="${iface.name}">\n`;
        config += '              <layer3>\n';
        config += '                <ip>\n';
        const cidr = this.convertSubnetToCidr(iface.mask);
        config += `                  <entry name="${iface.ip}/${cidr}"/>\n`;
        config += '                </ip>\n';
        config += '              </layer3>\n';
        config += `              <comment>${iface.description}</comment>\n`;
        config += '            </entry>\n';
      });
    }
    
    config += '          </ethernet>\n';
    config += '        </interface>\n';
    
    // Add zones configuration
    config += '        <zone>\n';
    const zones = ['trust', 'untrust', 'dmz'];
    zones.forEach(zone => {
      config += `          <entry name="${zone}">\n`;
      config += '            <network>\n';
      config += '              <layer3>\n';
      // Add interfaces to appropriate zones
      if (Array.isArray(this.parsedConfig.interfaces) && this.parsedConfig.interfaces.length > 0) {
        this.parsedConfig.interfaces.forEach(iface => {
          const ifaceZone = iface.zone || (iface.name && iface.name.includes('wan') ? 'untrust' : 'trust');
          if (ifaceZone === zone) {
            config += `                <member>${escapeXml(iface.name || 'ethernet1/1')}</member>\n`;
          }
        });
      } else {
        // Default zone assignments
        if (zone === 'trust') {
          config += '                <member>ethernet1/1</member>\n';
        } else if (zone === 'untrust') {
          config += '                <member>ethernet1/2</member>\n';
        }
      }
      config += '              </layer3>\n';
      config += '            </network>\n';
      config += '          </entry>\n';
    });
    config += '        </zone>\n';
    config += '      </network>\n';
    config += '    </entry>\n';
    config += '  </devices>\n';
    config += '</config>\n';
    return config;
  }

  convertSubnetToCidr(subnetMask) {
    // Convert subnet mask to CIDR notation
    const maskMap = {
      '255.255.255.255': '32',
      '255.255.255.254': '31',
      '255.255.255.252': '30',
      '255.255.255.248': '29',
      '255.255.255.240': '28',
      '255.255.255.224': '27',
      '255.255.255.192': '26',
      '255.255.255.128': '25',
      '255.255.255.0': '24',
      '255.255.254.0': '23',
      '255.255.252.0': '22',
      '255.255.248.0': '21',
      '255.255.240.0': '20',
      '255.255.224.0': '19',
      '255.255.192.0': '18',
      '255.255.128.0': '17',
      '255.255.0.0': '16',
      '255.254.0.0': '15',
      '255.252.0.0': '14',
      '255.248.0.0': '13',
      '255.240.0.0': '12',
      '255.224.0.0': '11',
      '255.192.0.0': '10',
      '255.128.0.0': '9',
      '255.0.0.0': '8',
      '254.0.0.0': '7',
      '252.0.0.0': '6',
      '248.0.0.0': '5',
      '240.0.0.0': '4',
      '224.0.0.0': '3',
      '192.0.0.0': '2',
      '128.0.0.0': '1',
      '0.0.0.0': '0'
    };
    
    return maskMap[subnetMask] || '24'; // Default to /24 if not found
  }
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}


module.exports = {
  PaloAltoConfigParser,
  PaloAltoConfigGenerator
};

