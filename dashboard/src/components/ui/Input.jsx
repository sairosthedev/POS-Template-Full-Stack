import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input 
        className={`px-3 py-2 bg-white border rounded-lg text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1c3eb2] focus:border-[#1c3eb2] ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
