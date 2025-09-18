import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const ProgressTracker = ({ progress, currentStep, steps }) => {
  const getStepStatus = (stepIndex) => {
    const stepProgress = ((stepIndex + 1) / steps.length) * 100;
    if (progress >= stepProgress) return 'completed';
    if (progress >= stepProgress - 20) return 'current';
    return 'pending';
  };

  const getStepIcon = (step, status) => {
    if (status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === 'current') {
      return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
    } else {
      return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Converting Configuration</h2>
        <p className="text-gray-600">Please wait while we process your ASA configuration...</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Progress Percentage */}
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {Math.round(progress)}%
        </div>
        <div className="text-sm text-gray-600">
          {currentStep}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const Icon = step.icon;
          
          return (
            <div 
              key={step.id}
              className={`
                flex items-center space-x-4 p-4 rounded-lg transition-all duration-200
                ${status === 'completed' 
                  ? 'bg-green-50 border border-green-200' 
                  : status === 'current'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 border border-gray-200'
                }
              `}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step, status)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <h3 className={`font-medium ${
                    status === 'completed' ? 'text-green-800' : 
                    status === 'current' ? 'text-blue-800' : 'text-gray-600'
                  }`}>
                    {step.name}
                  </h3>
                </div>
                
                {status === 'current' && (
                  <div className="mt-2 text-sm text-blue-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Processing...</span>
                    </div>
                  </div>
                )}
                
                {status === 'completed' && (
                  <div className="mt-2 text-sm text-green-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Processing Details */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Processing Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Configuration Parsing</span>
              <span className="font-medium text-green-600">✓ Complete</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Object Conversion</span>
              <span className="font-medium text-green-600">✓ Complete</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Policy Translation</span>
              <span className="font-medium text-green-600">✓ Complete</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Interface Mapping</span>
              <span className="font-medium text-green-600">✓ Complete</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VPN Configuration</span>
              <span className="font-medium text-green-600">✓ Complete</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Validation</span>
              <span className="font-medium text-blue-600">In Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
