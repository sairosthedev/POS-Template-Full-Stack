import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <input
        className={`h-10 px-3.5 bg-white border rounded-xl text-sm shadow-sm transition-all
          placeholder:text-gray-300
          focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary
          hover:border-gray-300 ${
            error ? 'border-danger focus:ring-danger/10 focus:border-danger' : 'border-border-subtle'
          }`}
        {...props}
      />
      {error && <span className="text-xs font-medium text-danger">{error}</span>}
    </div>
  );
};
