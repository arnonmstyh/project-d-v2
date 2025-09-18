import React from 'react';

const AITLogo = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* AIT Logo - Orange sphere with grey abstract shape */}
      <div className="relative">
        {/* Main orange sphere */}
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg flex items-center justify-center relative overflow-hidden`}>
          {/* Highlight on the sphere */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-80"></div>
          {/* Inner sphere */}
          <div className="w-3/4 h-3/4 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full"></div>
        </div>
        
        {/* Grey abstract shape wrapping around */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-500 rounded-full opacity-60"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gray-400 rounded-full opacity-50"></div>
        
        {/* Curved grey shape */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1 left-1 w-2 h-2 bg-gray-600 rounded-full opacity-40"></div>
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-gray-500 rounded-full opacity-30"></div>
        </div>
      </div>
      
      {showText && (
        <div className="text-left">
          <div className={`font-bold text-gray-900 ${textSizes[size]}`}>
            AIT
          </div>
          <div className={`text-orange-600 font-medium ${textSizes[size] === 'text-xs' ? 'text-xs' : 'text-xs'}`}>
            Cybersecurity
          </div>
        </div>
      )}
    </div>
  );
};

export default AITLogo;
