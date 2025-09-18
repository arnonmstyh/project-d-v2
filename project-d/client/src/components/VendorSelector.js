import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import AITLogo from './AITLogo';

const VendorSelector = ({ vendors, onVendorSelection, selectedSource, selectedTarget, onSourceChange, onTargetChange }) => {
  const [conversionOptions, setConversionOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSource) {
      fetchConversionOptions(selectedSource);
    }
  }, [selectedSource]);

  const fetchConversionOptions = async (sourceVendor) => {
    try {
      const response = await fetch(`/api/vendors/${sourceVendor}/options`);
      const data = await response.json();
      if (data.success) {
        setConversionOptions(data.options);
      }
    } catch (error) {
      console.error('Error fetching conversion options:', error);
    }
  };

  const getVendorIcon = (vendorId) => {
    const icons = {
      'cisco-asa': '🔴',
      'cisco-ftd': '🔴',
      'fortigate': '🟢',
      'palo-alto': '🟡'
    };
    return icons[vendorId] || '🔧';
  };

  const getVendorColor = (vendorId) => {
    const colors = {
      'cisco-asa': 'red',
      'cisco-ftd': 'red',
      'fortigate': 'green',
      'palo-alto': 'yellow'
    };
    return colors[vendorId] || 'gray';
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading supported vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <AITLogo size="lg" showText={false} />
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Multi-Vendor Firewall Converter
            </h2>
            <p className="text-sm text-orange-600 font-medium">Powered by AIT Cybersecurity Team</p>
          </div>
        </div>
        <p className="text-lg text-gray-600">
          Convert firewall configurations between different vendors with professional-grade accuracy
        </p>
      </div>

      {/* Vendor Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Source Vendor */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <span className="text-2xl">📤</span>
            <span>Source Configuration</span>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {vendors.map((vendor) => (
              <button
                key={vendor.id}
                onClick={() => onSourceChange(vendor.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedSource === vendor.id
                    ? `border-${getVendorColor(vendor.id)}-500 bg-${getVendorColor(vendor.id)}-50`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getVendorIcon(vendor.id)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{vendor.name}</div>
                    <div className="text-sm text-gray-600">{vendor.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Extensions: {vendor.extensions.join(', ')}
                    </div>
                  </div>
                  {selectedSource === vendor.id && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Target Vendor */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <span className="text-2xl">📥</span>
            <span>Target Configuration</span>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {conversionOptions.length > 0 ? (
              conversionOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onTargetChange(option.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedTarget === option.id
                      ? `border-${getVendorColor(option.id)}-500 bg-${getVendorColor(option.id)}-50`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getVendorIcon(option.id)}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(option.complexity)}`}>
                          {option.complexity} complexity
                        </span>
                        {option.supported && (
                          <span className="text-xs text-green-600 font-medium">✓ Supported</span>
                        )}
                      </div>
                    </div>
                    {selectedTarget === option.id && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-gray-500">Select a source vendor to see target options</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversion Preview */}
      {selectedSource && selectedTarget && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getVendorIcon(selectedSource)}</span>
              <span className="font-medium text-gray-900">
                {vendors.find(v => v.id === selectedSource)?.name}
              </span>
            </div>
            <ArrowRight className="h-6 w-6 text-blue-600" />
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getVendorIcon(selectedTarget)}</span>
              <span className="font-medium text-gray-900">
                {vendors.find(v => v.id === selectedTarget)?.name}
              </span>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Ready to convert your configuration with professional-grade accuracy
            </p>
          </div>
        </div>
      )}

      {/* Supported Features */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Interfaces</div>
            <div className="text-sm text-gray-600">Physical & logical interfaces</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Security Policies</div>
            <div className="text-sm text-gray-600">ACLs & firewall rules</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">NAT Rules</div>
            <div className="text-sm text-gray-600">Static & dynamic NAT</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">VPN Tunnels</div>
            <div className="text-sm text-gray-600">IPSec & SSL VPN</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Objects</div>
            <div className="text-sm text-gray-600">Address & service objects</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Routes</div>
            <div className="text-sm text-gray-600">Static & dynamic routing</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">Users</div>
            <div className="text-sm text-gray-600">Local & LDAP users</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-900 mb-2">System Services</div>
            <div className="text-sm text-gray-600">SNMP, SSH, HTTP, Logging</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSelector;
