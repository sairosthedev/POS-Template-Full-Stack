import React from 'react';

export const Card = ({ children, className = '', padding = 'p-6' }) => {
  return (
    <div className={`card-premium ${padding} ${className} relative overflow-hidden`}>
      {children}
    </div>
  );
};
