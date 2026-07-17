import React from 'react';

const SIZES = {
  xs: 'w-3.5 h-3.5 border-2',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-[2.5px]',
  lg: 'w-10 h-10 border-[3px]',
  xl: 'w-14 h-14 border-4',
};

/**
 * Branded circular loader. `tone="light"` for use on dark/colored backgrounds.
 */
export const Spinner = ({ size = 'md', tone = 'brand', className = '' }) => (
  <span
    role="status"
    aria-label="Loading"
    className={`inline-block rounded-full animate-spin border-solid ${
      tone === 'light'
        ? 'border-white/30 border-t-white'
        : 'border-primary/20 border-t-primary'
    } ${SIZES[size] || SIZES.md} ${className}`}
  />
);

/** Centered loader block for page/section loading states. */
export const LoadingBlock = ({ label = 'Loading…', className = '' }) => (
  <div className={`flex flex-col items-center justify-center gap-3 py-16 ${className}`}>
    <Spinner size="lg" />
    <span className="text-sm font-medium text-gray-400">{label}</span>
  </div>
);
