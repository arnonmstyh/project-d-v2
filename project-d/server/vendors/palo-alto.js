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
        config += `      <entry name="${escapeXml(attrOr(addr.name,'addr'))}">\n`;
        config += `        <ip-netmask>${escapeXml(attrOr(addr.value,'0.0.0.0/32'))}</ip-netmask>\n`;
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
        config += `      <entry name="${escapeXml(attrOr(grp.name,'addrgrp'))}">\n`;
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
        const name = escapeXml(attrOr(rule.name,'rule-1'));
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
    this.parsedConfig.interfaces.forEach(iface => {
      const name = escapeXml(attrOr(iface.name,'ethernet1/1'));
      config += `            <entry name="${name}">\n`;
      if (iface.ip) {
        config += '              <layer3>\n';
        config += '                <ip>\n';
        config += `                  <entry name="${escapeXml(iface.ip)}"/>\n`;
        config += '                </ip>\n';
        config += '              </layer3>\n';
      }
      if (iface.description) config += `              <comment>${escapeXml(iface.description)}</comment>\n`;
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

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function attrOr(value, fallback) {
  return value && String(value).length > 0 ? value : fallback;
}

module.exports = {
  PaloAltoConfigParser,
  PaloAltoConfigGenerator
};

