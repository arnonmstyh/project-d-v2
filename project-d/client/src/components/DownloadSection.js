import React, { useState } from 'react';
import { Download, Copy, CheckCircle, FileText, Eye, EyeOff } from 'lucide-react';

const DownloadSection = ({ downloadPath, fortigateConfig }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    if (downloadPath) {
      const filename = downloadPath.split('/').pop();
      const downloadUrl = `http://localhost:5000/download/${filename}`;
      console.log('Downloading from:', downloadUrl);
      
      // Try multiple download methods
      try {
        // Method 1: Direct window.open
        const newWindow = window.open(downloadUrl, '_blank');
        if (!newWindow) {
          // Method 2: Create download link
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = filename;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error('Download failed:', error);
        // Method 3: Fallback to window.location
        window.location.href = downloadUrl;
      }
    }
  };

  const handleCopyConfig = async () => {
    if (fortigateConfig) {
      try {
        await navigator.clipboard.writeText(fortigateConfig);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy configuration:', err);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConfigStats = () => {
    if (!fortigateConfig) return null;
    
    const lines = fortigateConfig.split('\n').length;
    const bytes = new Blob([fortigateConfig]).size;
    const words = fortigateConfig.split(/\s+/).length;
    
    return { lines, bytes, words };
  };

  const stats = getConfigStats();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuration Ready</h2>
        <p className="text-gray-600">
          Your FortiGate configuration has been successfully generated and is ready for download.
        </p>
      </div>

      {/* Configuration Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.lines}</div>
            <div className="text-sm text-gray-600">Configuration Lines</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{formatFileSize(stats.bytes)}</div>
            <div className="text-sm text-gray-600">File Size</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.words}</div>
            <div className="text-sm text-gray-600">Words</div>
          </div>
        </div>
      )}

      {/* Debug Information */}
      {downloadPath && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h5 className="font-medium text-yellow-900 mb-2">Download Information</h5>
          <div className="text-sm text-yellow-800 space-y-1">
            <div><strong>Download Path:</strong> {downloadPath}</div>
            <div><strong>Filename:</strong> {downloadPath.split('/').pop()}</div>
            <div><strong>Download URL:</strong> http://localhost:5000/download/{downloadPath.split('/').pop()}</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Download className="h-5 w-5" />
          <span>Download Configuration</span>
        </button>

        {/* Direct Download Link */}
        {downloadPath && (
          <a
            href={`http://localhost:5000/download/${downloadPath.split('/').pop()}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Download className="h-5 w-5" />
            <span>Direct Download</span>
          </a>
        )}

        <button
          onClick={handleCopyConfig}
          className="flex items-center justify-center space-x-2 px-8 py-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-300"
        >
          {copied ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-5 w-5" />
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center justify-center space-x-2 px-8 py-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-300"
        >
          {showPreview ? (
            <>
              <EyeOff className="h-5 w-5" />
              <span>Hide Preview</span>
            </>
          ) : (
            <>
              <Eye className="h-5 w-5" />
              <span>Preview Config</span>
            </>
          )}
        </button>
      </div>

      {/* Configuration Preview */}
      {showPreview && fortigateConfig && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">FortiGate Configuration Preview</span>
            </div>
            <div className="text-xs text-gray-500">
              {stats.lines} lines • {formatFileSize(stats.bytes)}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <pre className="p-4 text-sm text-gray-800 font-mono whitespace-pre-wrap">
              {fortigateConfig}
            </pre>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">Next Steps</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-800">1</span>
            </div>
            <div>
              <strong>Review the configuration:</strong> Check the converted configuration for accuracy and completeness.
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-800">2</span>
            </div>
            <div>
              <strong>Test in lab environment:</strong> Deploy the configuration in a test environment first.
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-800">3</span>
            </div>
            <div>
              <strong>Customize as needed:</strong> Make any necessary adjustments for your specific environment.
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-800">4</span>
            </div>
            <div>
              <strong>Deploy to production:</strong> Once tested, deploy the configuration to your FortiGate device.
            </div>
          </div>
        </div>
      </div>

      {/* Support Information */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Need help with the conversion? Check the FortiGate documentation or contact support.
        </p>
      </div>
    </div>
  );
};

export default DownloadSection;
