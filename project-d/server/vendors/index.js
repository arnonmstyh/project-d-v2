// Multi-Vendor Firewall Configuration System
// Supports: Cisco ASA, Cisco FTD, FortiGate, Palo Alto

const ASA = require('./cisco-asa');
const FTD = require('./cisco-ftd');
const FortiGate = require('./fortigate');
const PaloAlto = require('./palo-alto');

const VENDORS = {
  'cisco-asa': {
    name: 'Cisco ASA',
    parser: ASA.ASAConfigParser,
    generator: ASA.ASAConfigGenerator,
    extensions: ['.txt', '.cfg'],
    description: 'Cisco Adaptive Security Appliance'
  },
  'cisco-ftd': {
    name: 'Cisco FTD',
    parser: FTD.FTDConfigParser,
    generator: FTD.FTDConfigGenerator,
    extensions: ['.txt', '.cfg'],
    description: 'Cisco Firepower Threat Defense'
  },
  'fortigate': {
    name: 'FortiGate',
    parser: FortiGate.FortiGateConfigParser,
    generator: FortiGate.FortiGateConfigGenerator,
    extensions: ['.txt', '.cfg'],
    description: 'FortiGate Next-Generation Firewall'
  },
  'palo-alto': {
    name: 'Palo Alto',
    parser: PaloAlto.PaloAltoConfigParser,
    generator: PaloAlto.PaloAltoConfigGenerator,
    extensions: ['.xml', '.txt'],
    description: 'Palo Alto Networks PAN-OS'
  }
};

const CONVERSION_MATRIX = {
  'cisco-asa': {
    'cisco-ftd': { supported: true, complexity: 'medium' },
    'fortigate': { supported: true, complexity: 'high' },
    'palo-alto': { supported: true, complexity: 'high' }
  },
  'cisco-ftd': {
    'cisco-asa': { supported: true, complexity: 'medium' },
    'fortigate': { supported: true, complexity: 'high' },
    'palo-alto': { supported: true, complexity: 'high' }
  },
  'fortigate': {
    'cisco-asa': { supported: true, complexity: 'high' },
    'cisco-ftd': { supported: true, complexity: 'high' },
    'palo-alto': { supported: true, complexity: 'high' }
  },
  'palo-alto': {
    'cisco-asa': { supported: true, complexity: 'high' },
    'cisco-ftd': { supported: true, complexity: 'high' },
    'fortigate': { supported: true, complexity: 'high' }
  }
};

class MultiVendorConverter {
  constructor() {
    this.vendors = VENDORS;
    this.conversionMatrix = CONVERSION_MATRIX;
  }

  getSupportedVendors() {
    return Object.keys(this.vendors).map(key => ({
      id: key,
      ...this.vendors[key]
    }));
  }

  getConversionOptions(sourceVendor) {
    if (!this.conversionMatrix[sourceVendor]) {
      return [];
    }
    
    return Object.keys(this.conversionMatrix[sourceVendor])
      .map(targetVendor => ({
        id: targetVendor,
        ...this.vendors[targetVendor],
        ...this.conversionMatrix[sourceVendor][targetVendor]
      }));
  }

  convertConfiguration(configText, sourceVendor, targetVendor) {
    try {
      // Get parser for source vendor
      const sourceVendorConfig = this.vendors[sourceVendor];
      if (!sourceVendorConfig) {
        throw new Error(`Unsupported source vendor: ${sourceVendor}`);
      }

      // Get generator for target vendor
      const targetVendorConfig = this.vendors[targetVendor];
      if (!targetVendorConfig) {
        throw new Error(`Unsupported target vendor: ${targetVendor}`);
      }

      // Check if conversion is supported
      if (!this.conversionMatrix[sourceVendor] || !this.conversionMatrix[sourceVendor][targetVendor]) {
        throw new Error(`Conversion from ${sourceVendor} to ${targetVendor} is not supported`);
      }

      // Parse source configuration
      const ParserClass = sourceVendorConfig.parser;
      const parser = new ParserClass();
      const parsedConfig = parser.parseConfig(configText);

      // Generate target configuration
      const GeneratorClass = targetVendorConfig.generator;
      const generator = new GeneratorClass(parsedConfig, sourceVendor);
      const convertedConfig = generator.generateConfig();

      return {
        success: true,
        sourceVendor: sourceVendorConfig.name,
        targetVendor: targetVendorConfig.name,
        parsedConfig: parsedConfig,
        convertedConfig: convertedConfig,
        stats: this.generateStats(parsedConfig),
        complexity: this.conversionMatrix[sourceVendor][targetVendor].complexity
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        sourceVendor: this.vendors[sourceVendor]?.name || sourceVendor,
        targetVendor: this.vendors[targetVendor]?.name || targetVendor
      };
    }
  }

  generateStats(parsedConfig) {
    const stats = {};
    
    // Common statistics
    const commonKeys = ['interfaces', 'objects', 'objectGroups', 'policies', 'routes', 'users'];
    commonKeys.forEach(key => {
      if (parsedConfig[key]) {
        stats[key] = parsedConfig[key].length;
      }
    });

    // Vendor-specific statistics
    if (parsedConfig.nat) stats.nat = parsedConfig.nat.length;
    if (parsedConfig.vpns) stats.vpns = parsedConfig.vpns.length;
    if (parsedConfig.ldap) stats.ldap = parsedConfig.ldap.length;
    if (parsedConfig.securityProfiles) stats.securityProfiles = parsedConfig.securityProfiles.length;
    if (parsedConfig.applications) stats.applications = parsedConfig.applications.length;
    if (parsedConfig.urlCategories) stats.urlCategories = parsedConfig.urlCategories.length;

    return stats;
  }

  getVendorIcon(vendorId) {
    const icons = {
      'cisco-asa': '🔴',
      'cisco-ftd': '🔴',
      'fortigate': '🟢',
      'palo-alto': '🟡'
    };
    return icons[vendorId] || '🔧';
  }

  getVendorColor(vendorId) {
    const colors = {
      'cisco-asa': 'red',
      'cisco-ftd': 'red',
      'fortigate': 'green',
      'palo-alto': 'yellow'
    };
    return colors[vendorId] || 'gray';
  }
}

module.exports = {
  MultiVendorConverter,
  VENDORS,
  CONVERSION_MATRIX
};
