import React, { useState, useEffect } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, Settings, Shield } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ProgressTracker from './components/ProgressTracker';
import ConversionReport from './components/ConversionReport';
import DownloadSection from './components/DownloadSection';
import VendorSelector from './components/VendorSelector';
import AITLogo from './components/AITLogo';
import './App.css';

function App() {
  const [conversionStatus, setConversionStatus] = useState('idle'); // idle, processing, completed, error
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [sourceConfig, setSourceConfig] = useState(null);
  const [targetConfig, setTargetConfig] = useState(null);
  const [conversionStats, setConversionStats] = useState(null);
  const [downloadPath, setDownloadPath] = useState('');
  const [errors, setErrors] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [sourceVendor, setSourceVendor] = useState('');
  const [targetVendor, setTargetVendor] = useState('');

  const steps = [
    { id: 'upload', name: 'Upload Configuration', icon: Upload },
    { id: 'parse', name: 'Parse Source Config', icon: Settings },
    { id: 'convert', name: 'Convert to Target', icon: Shield },
    { id: 'validate', name: 'Validate Output', icon: CheckCircle },
    { id: 'complete', name: 'Ready for Download', icon: Download }
  ];

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      // Dynamic API URL based on current host
      const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000' 
        : `http://${window.location.hostname}:5000`;
      
      console.log('🔄 Fetching vendors from', `${apiBaseUrl}/api/vendors...`);
      
      const response = await fetch(`${apiBaseUrl}/api/vendors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
      });
      
      console.log('📡 Response status:', response.status, response.statusText);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Vendors response:', data);
        if (data.success) {
          setVendors(data.vendors);
          console.log('✅ Vendors set successfully:', data.vendors);
          return;
        } else {
          throw new Error('API returned success: false');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ HTTP Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error fetching vendors:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Set default vendors as fallback
      console.warn('⚠️ Using fallback vendor data due to API failure');
      setVendors([
        { id: 'cisco-asa', name: 'Cisco ASA', extensions: ['.txt', '.cfg'], description: 'Cisco Adaptive Security Appliance' },
        { id: 'cisco-ftd', name: 'Cisco FTD', extensions: ['.txt', '.cfg'], description: 'Cisco Firepower Threat Defense' },
        { id: 'fortigate', name: 'FortiGate', extensions: ['.txt', '.cfg'], description: 'FortiGate Next-Generation Firewall' },
        { id: 'palo-alto', name: 'Palo Alto', extensions: ['.xml', '.txt'], description: 'Palo Alto Networks PAN-OS' }
      ]);
    }
  };

  const handleSourceVendorChange = (vendorId) => {
    console.log('Source vendor changed to:', vendorId);
    setSourceVendor(vendorId);
    setTargetVendor(''); // Reset target when source changes
  };

  const handleTargetVendorChange = (vendorId) => {
    console.log('Target vendor changed to:', vendorId);
    setTargetVendor(vendorId);
  };

  const handleFileUpload = async (file) => {
    if (!sourceVendor || !targetVendor) {
      setErrors(['Please select both source and target vendors']);
      return;
    }

    setConversionStatus('processing');
    setProgress(0);
    setErrors([]);
    
    const formData = new FormData();
    formData.append('configFile', file);
    formData.append('sourceVendor', sourceVendor);
    formData.append('targetVendor', targetVendor);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Update current step
      setCurrentStep('Uploading configuration file...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentStep(`Parsing ${vendors.find(v => v.id === sourceVendor)?.name} configuration...`);
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep(`Converting to ${vendors.find(v => v.id === targetVendor)?.name} format...`);
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentStep('Validating converted configuration...');
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dynamic API URL based on current host
      const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000' 
        : `http://${window.location.hostname}:5000`;
      
      console.log('🔄 Uploading to backend...');
      console.log('📤 Upload data:', {
        sourceVendor,
        targetVendor,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      const response = await fetch(`${apiBaseUrl}/upload`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'omit',
      });
      
      console.log('📡 Upload response status:', response.status, response.statusText);
      console.log('📡 Upload response headers:', Object.fromEntries(response.headers.entries()));

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      setSourceConfig(result.parsedConfig);
      setTargetConfig(result.convertedConfig);
      setConversionStats(result.stats);
      setDownloadPath(result.downloadPath);
      setConversionStatus('completed');
      setProgress(100);
      setCurrentStep('Conversion completed successfully!');

    } catch (error) {
      setConversionStatus('error');
      setErrors([error.message]);
      setCurrentStep('Conversion failed');
    }
  };

  const resetConversion = () => {
    setConversionStatus('idle');
    setProgress(0);
    setCurrentStep('');
    setSourceConfig(null);
    setTargetConfig(null);
    setConversionStats(null);
    setDownloadPath('');
    setErrors([]);
    setSourceVendor('');
    setTargetVendor('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Disclaimer Banner */}
      <div className="bg-orange-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">
            ⚠️ INTERNAL USE ONLY - This application is developed by AIT Cybersecurity Team
          </span>
        </div>
      </div>
      
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {/* AIT Logo */}
              <AITLogo size="lg" showText={false} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Multi-Vendor Firewall Converter</h1>
                <p className="text-sm text-gray-600">Professional Firewall Configuration Migration Tool</p>
                <p className="text-xs text-orange-600 font-medium">Powered by AIT Cybersecurity Team</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {conversionStatus === 'idle' && (
          <div className="space-y-8">
            {/* Debug Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Debug Information</h3>
              <div className="text-sm text-yellow-700">
                <p>Vendors loaded: {vendors.length}</p>
                <p>Source vendor: {sourceVendor || 'None selected'}</p>
                <p>Target vendor: {targetVendor || 'None selected'}</p>
                <button 
                  onClick={fetchVendors}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Test API Connection
                </button>
              </div>
            </div>
            
            <VendorSelector 
              vendors={vendors}
              selectedSource={sourceVendor}
              selectedTarget={targetVendor}
              onSourceChange={handleSourceVendorChange}
              onTargetChange={handleTargetVendorChange}
            />
            
            {sourceVendor && targetVendor && (
              <div className="text-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Ready to Convert Configuration
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                      Upload your {vendors.find(v => v.id === sourceVendor)?.name} configuration file and get a professionally converted {vendors.find(v => v.id === targetVendor)?.name} configuration
                      with detailed conversion report and progress tracking.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <Upload className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Upload Config</h3>
                        <p className="text-sm text-gray-600">Upload your configuration file</p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-lg">
                        <Settings className="h-8 w-8 text-green-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Smart Conversion</h3>
                        <p className="text-sm text-gray-600">AI-powered conversion with validation</p>
                      </div>
                      <div className="bg-purple-50 p-6 rounded-lg">
                        <Download className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Download Result</h3>
                        <p className="text-sm text-gray-600">Get your converted configuration</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <FileUpload onFileUpload={handleFileUpload} />
              </div>
            )}
          </div>
        )}

        {conversionStatus === 'processing' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <ProgressTracker 
              progress={progress}
              currentStep={currentStep}
              steps={steps}
            />
          </div>
        )}

        {conversionStatus === 'completed' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Conversion Completed</h2>
                <button
                  onClick={resetConversion}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Convert Another File
                </button>
              </div>
              
              <ConversionReport 
                asaConfig={sourceConfig}
                conversionStats={conversionStats}
                errors={errors}
              />
            </div>

            <DownloadSection 
              downloadPath={downloadPath}
              fortigateConfig={targetConfig}
            />
          </div>
        )}

        {conversionStatus === 'error' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Conversion Failed</h2>
              <p className="text-gray-600 mb-6">
                There was an error processing your configuration file.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                <ul className="text-sm text-red-700">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={resetConversion}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            {/* AIT Logo and Credit */}
            <div className="flex items-center justify-center mb-4">
              <AITLogo size="md" showText={true} />
            </div>
            
            {/* Disclaimer */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-4xl mx-auto">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-orange-800 mb-2">Important Disclaimer</h3>
                  <p className="text-sm text-orange-700 leading-relaxed">
                    <strong>This application is developed by Cybersecurity team AIT. Please use internal only.</strong><br/>
                    This tool is designed for internal use within AIT organization. All converted configurations should be reviewed by qualified network security professionals before deployment. AIT Cybersecurity Team is not responsible for any issues arising from the use of converted configurations in production environments.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="text-gray-600 text-sm">
              <p>&copy; 2024 AIT Cybersecurity Team. Multi-Vendor Firewall Converter - Internal Use Only.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
