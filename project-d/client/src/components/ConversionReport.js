import React from 'react';
import { CheckCircle, AlertCircle, Network, Shield, Users, Lock, Settings, Globe } from 'lucide-react';

const ConversionReport = ({ asaConfig, conversionStats, errors }) => {
  const getStatusIcon = (count) => {
    if (count > 0) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-gray-400" />;
  };

  const getStatusText = (count) => {
    if (count > 0) {
      return `${count} converted successfully`;
    }
    return 'No items found';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Conversion Report</h3>
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Conversion Successful</span>
        </div>
      </div>

      {/* Configuration Overview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Configuration Overview</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Source Hostname</div>
            <div className="font-medium text-gray-900">
              {asaConfig?.hostname || 'Not specified'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Objects</div>
            <div className="font-medium text-gray-900">
              {(conversionStats?.objects || 0) + (conversionStats?.objectGroups || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Network className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">
              {conversionStats?.interfaces || 0}
            </span>
          </div>
          <div className="text-sm text-gray-600">Interfaces</div>
          <div className="text-xs text-green-600 mt-1">
            {getStatusText(conversionStats?.interfaces || 0)}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Globe className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">
              {conversionStats?.objects || 0}
            </span>
          </div>
          <div className="text-sm text-gray-600">Address Objects</div>
          <div className="text-xs text-green-600 mt-1">
            {getStatusText(conversionStats?.objects || 0)}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="h-5 w-5 text-purple-500" />
            <span className="text-2xl font-bold text-gray-900">
              {conversionStats?.policies || 0}
            </span>
          </div>
          <div className="text-sm text-gray-600">Security Policies</div>
          <div className="text-xs text-green-600 mt-1">
            {getStatusText(conversionStats?.policies || 0)}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Lock className="h-5 w-5 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">
              {conversionStats?.vpns || 0}
            </span>
          </div>
          <div className="text-sm text-gray-600">VPN Tunnels</div>
          <div className="text-xs text-green-600 mt-1">
            {getStatusText(conversionStats?.vpns || 0)}
          </div>
        </div>
      </div>

      {/* Detailed Configuration Items */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Detailed Configuration</h4>
        
        {/* Interfaces */}
        {asaConfig?.interfaces && asaConfig.interfaces.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900 flex items-center space-x-2">
                <Network className="h-4 w-4" />
                <span>Interfaces ({asaConfig.interfaces.length})</span>
              </h5>
              {getStatusIcon(asaConfig.interfaces.length)}
            </div>
            <div className="space-y-2">
              {asaConfig.interfaces.map((iface, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                  <span className="font-medium">{iface.name}</span>
                  <span className="text-gray-600">
                    {iface.ip ? `${iface.ip}/${iface.mask}` : 'No IP configured'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Address Objects */}
        {asaConfig?.objects && asaConfig.objects.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900 flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Address Objects ({asaConfig.objects.length})</span>
              </h5>
              {getStatusIcon(asaConfig.objects.length)}
            </div>
            <div className="space-y-2">
              {asaConfig.objects.slice(0, 5).map((obj, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                  <span className="font-medium">{obj.name}</span>
                  <span className="text-gray-600">
                    {obj.type}: {obj.value}
                  </span>
                </div>
              ))}
              {asaConfig.objects.length > 5 && (
                <div className="text-sm text-gray-500 text-center">
                  ... and {asaConfig.objects.length - 5} more objects
                </div>
              )}
            </div>
          </div>
        )}

        {/* Object Groups */}
        {asaConfig?.objectGroups && asaConfig.objectGroups.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900 flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Object Groups ({asaConfig.objectGroups.length})</span>
              </h5>
              {getStatusIcon(asaConfig.objectGroups.length)}
            </div>
            <div className="space-y-2">
              {asaConfig.objectGroups.map((group, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                  <span className="font-medium">{group.name}</span>
                  <span className="text-gray-600">
                    {group.members.length} members
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Policies */}
        {asaConfig?.policies && asaConfig.policies.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900 flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security Policies ({asaConfig.policies.length})</span>
              </h5>
              {getStatusIcon(asaConfig.policies.length)}
            </div>
            <div className="space-y-2">
              {asaConfig.policies.slice(0, 5).map((policy, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                  <span className="font-medium">{policy.name}</span>
                  <span className="text-gray-600">
                    {policy.action} {policy.protocol} {policy.source} → {policy.destination}
                  </span>
                </div>
              ))}
              {asaConfig.policies.length > 5 && (
                <div className="text-sm text-gray-500 text-center">
                  ... and {asaConfig.policies.length - 5} more policies
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* NAT Configuration */}
      {(conversionStats?.nat || 0) > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-900 flex items-center space-x-2">
              <Network className="h-4 w-4" />
              <span>NAT Rules ({conversionStats.nat})</span>
            </h5>
            {getStatusIcon(conversionStats.nat)}
          </div>
          <div className="space-y-2">
            {asaConfig?.nat && asaConfig.nat.slice(0, 3).map((nat, index) => (
              <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                <span className="font-medium">{nat.type} NAT</span>
                <span className="text-gray-600">
                  {nat.source} → {nat.destination}
                </span>
              </div>
            ))}
            {asaConfig?.nat && asaConfig.nat.length > 3 && (
              <div className="text-sm text-gray-500 text-center">
                ... and {asaConfig.nat.length - 3} more NAT rules
              </div>
            )}
          </div>
        </div>
      )}

      {/* Static NAT */}
      {(conversionStats?.staticNAT || 0) > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-900 flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Static NAT ({conversionStats.staticNAT})</span>
            </h5>
            {getStatusIcon(conversionStats.staticNAT)}
          </div>
          <div className="space-y-2">
            {asaConfig?.staticNAT && asaConfig.staticNAT.slice(0, 3).map((staticNat, index) => (
              <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                <span className="font-medium">Static</span>
                <span className="text-gray-600">
                  {staticNat.source} → {staticNat.static}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(conversionStats?.snmp || 0) > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-900 text-sm">SNMP</h5>
              {getStatusIcon(conversionStats.snmp)}
            </div>
            <div className="text-xs text-gray-600">
              {conversionStats.snmp} communities configured
            </div>
          </div>
        )}

        {(conversionStats?.logging || 0) > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-900 text-sm">Logging</h5>
              {getStatusIcon(conversionStats.logging)}
            </div>
            <div className="text-xs text-gray-600">
              {conversionStats.logging} log servers configured
            </div>
          </div>
        )}

        {(conversionStats?.ssh || 0) > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-900 text-sm">SSH</h5>
              {getStatusIcon(conversionStats.ssh)}
            </div>
            <div className="text-xs text-gray-600">
              {conversionStats.ssh} SSH configurations
            </div>
          </div>
        )}

        {(conversionStats?.users || 0) > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-900 text-sm">Users</h5>
              {getStatusIcon(conversionStats.users)}
            </div>
            <div className="text-xs text-gray-600">
              {conversionStats.users} local users configured
            </div>
          </div>
        )}
      </div>

      {/* Conversion Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">Conversion Notes</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All ASA objects have been converted to FortiGate address objects</li>
          <li>• Security policies have been translated to FortiGate firewall policies</li>
          <li>• Interface configurations have been mapped to FortiGate interface settings</li>
          <li>• VPN configurations have been converted to FortiGate IPsec settings</li>
          <li>• NAT rules (dynamic and static) have been converted to FortiGate NAT policies</li>
          <li>• IPSec Phase 1 and Phase 2 configurations have been mapped</li>
          <li>• System services (SNMP, SSH, HTTP, Logging) have been converted</li>
          <li>• User accounts and authentication settings have been migrated</li>
          <li>• Review the converted configuration before deploying to production</li>
        </ul>
      </div>

      {/* Errors or Warnings */}
      {errors && errors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-medium text-yellow-900 mb-2 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>Conversion Warnings</span>
          </h5>
          <ul className="text-sm text-yellow-800 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConversionReport;
