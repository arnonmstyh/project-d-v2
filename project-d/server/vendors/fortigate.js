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
          zone: 'untrust',
          type: 'physical',
          status: 'up'
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
          } else if (configLine.includes('set zone ')) {
            interfaceConfig.zone = configLine.split('"')[1];
          } else if (configLine.includes('set type ')) {
            interfaceConfig.type = configLine.split('set type ')[1];
          } else if (configLine.includes('set status ')) {
            interfaceConfig.status = configLine.split('set status ')[1];
          }
        }

        // Only add interfaces that have IP configuration
        if (interfaceConfig.ip && interfaceConfig.mask) {
          console.log(`[FortiGate Parser] Found interface: ${interfaceConfig.name} - ${interfaceConfig.ip}/${interfaceConfig.mask} (${interfaceConfig.zone})`);
          this.config.interfaces.push(interfaceConfig);
        } else {
          console.log(`[FortiGate Parser] Skipping interface ${interfaceConfig.name} - no IP configuration`);
        }
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
    // Generate a richer FortiGate configuration from generic parsed data (e.g., ASA)
    let cfg = '';

    // Header
    cfg += '# FortiGate Configuration\n';
    cfg += '# Generated from ' + this.sourceVendor + ' configuration\n\n';

    // Global hostname
    cfg += 'config system global\n';
    cfg += `    set hostname "${this.parsedConfig.hostname || 'fortigate-converted'}"\n`;
    cfg += 'end\n\n';

    // Interfaces
    if (Array.isArray(this.parsedConfig.interfaces) && this.parsedConfig.interfaces.length > 0) {
      cfg += 'config system interface\n';
      this.parsedConfig.interfaces.forEach((iface) => {
        const name = iface.name || 'port1';
        cfg += `    edit "${name}"\n`;
        if (iface.ip && iface.mask) {
          cfg += `        set ip ${iface.ip} ${iface.mask}\n`;
        }
        if (iface.description) {
          cfg += `        set alias "${iface.description}"\n`;
        }
        cfg += '        set allowaccess ping https http ssh\n';
        cfg += '    next\n';
      });
      cfg += 'end\n\n';
    }

    // Address objects from parsed objects
    const addresses = [];
    if (Array.isArray(this.parsedConfig.objects)) {
      this.parsedConfig.objects.forEach((obj) => {
        const name = obj.name || 'addr_auto';
        const comment = obj.description ? obj.description.replace(/"/g, '\\"') : '';
        if (obj.type === 'host' && obj.value) {
          addresses.push({ name, value: `${obj.value} 255.255.255.255`, comment });
        } else if (obj.type === 'subnet' && obj.value && obj.mask) {
          addresses.push({ name, value: `${obj.value} ${obj.mask}`, comment });
        }
      });
    }
    if (addresses.length > 0) {
      cfg += 'config firewall address\n';
      addresses.forEach((a) => {
        cfg += `    edit "${a.name}"\n`;
        cfg += '        set type ipmask\n';
        cfg += `        set subnet ${a.value}\n`;
        if (a.comment) cfg += `        set comment "${a.comment}"\n`;
        cfg += '    next\n';
      });
      cfg += 'end\n\n';
    }

    // Address groups from parsed objectGroups
    if (Array.isArray(this.parsedConfig.objectGroups) && this.parsedConfig.objectGroups.length > 0) {
      cfg += 'config firewall addrgrp\n';
      this.parsedConfig.objectGroups.forEach((grp) => {
        const name = grp.name || 'grp_auto';
        const comment = grp.description ? grp.description.replace(/"/g, '\\"') : '';
        const members = Array.isArray(grp.members)
          ? grp.members.map((m) => m.value).filter(Boolean)
          : [];
        cfg += `    edit "${name}"\n`;
        if (members.length > 0) {
          cfg += `        set member ${members.map((m) => `"${m}"`).join(' ')}\n`;
        }
        if (comment) cfg += `        set comment "${comment}"\n`;
        cfg += '    next\n';
      });
      cfg += 'end\n\n';
    }

    // Policies from parsed policies (very basic translation)
    if (Array.isArray(this.parsedConfig.policies) && this.parsedConfig.policies.length > 0) {
      cfg += 'config firewall policy\n';
      let policyId = 1;
      this.parsedConfig.policies.forEach((p) => {
        cfg += `    edit ${policyId++}\n`;
        const name = p.name ? p.name : `${p.action || 'permit'}_${p.protocol || 'ip'}`;
        cfg += `        set name "${name}"\n`;
        // Map ASA semantics loosely: any/object names
        const src = p.source && p.source !== 'any' ? [p.source] : ['all'];
        const dst = p.destination && p.destination !== 'any' ? [p.destination] : ['all'];
        const svc = p.service && p.service !== 'any' ? [p.service] : ['ALL'];
        cfg += `        set srcintf "any"\n`;
        cfg += `        set dstintf "any"\n`;
        cfg += `        set srcaddr ${src.map((s) => `"${s}"`).join(' ')}\n`;
        cfg += `        set dstaddr ${dst.map((d) => `"${d}"`).join(' ')}\n`;
        cfg += `        set service ${svc.map((s) => `"${s}"`).join(' ')}\n`;
        cfg += `        set action ${p.action === 'permit' || p.action === 'allow' ? 'accept' : 'deny'}\n`;
        cfg += '        set schedule "always"\n';
        cfg += '        set logtraffic all\n';
        if (p.description) cfg += `        set comments "${p.description.replace(/"/g, '\\"')}"\n`;
        cfg += '    next\n';
      });
      cfg += 'end\n\n';
    }

    // Static routes
    if (Array.isArray(this.parsedConfig.routes) && this.parsedConfig.routes.length > 0) {
      cfg += 'config router static\n';
      let rid = 1;
      this.parsedConfig.routes.forEach((r) => {
        if (!r.network || !r.mask || !r.gateway) return;
        cfg += `    edit ${rid++}\n`;
        cfg += `        set dst ${r.network} ${r.mask}\n`;
        cfg += `        set gateway ${r.gateway}\n`;
        if (r.interface) cfg += `        set device ${r.interface}\n`;
        cfg += '    next\n';
      });
      cfg += 'end\n\n';
    }

    // Simple NAT: translate ASA dynamic/static placeholders into comments for manual review
    const natItems = [];
    if (Array.isArray(this.parsedConfig.nat)) natItems.push(...this.parsedConfig.nat);
    if (Array.isArray(this.parsedConfig.staticNAT)) natItems.push(...this.parsedConfig.staticNAT);
    if (natItems.length > 0) {
      cfg += '# NOTE: Review and convert the following NAT rules manually if needed:\n';
      natItems.forEach((n) => {
        cfg += `# NAT ${JSON.stringify(n)}\n`;
      });
      cfg += '\n';
    }

    return cfg;
  }
}

module.exports = {
  FortiGateConfigParser,
  FortiGateConfigGenerator
};
