import React from 'react';
import { Spinner } from './Spinner';

const VARIANTS = {
  primary:
    'bg-primary text-white shadow-sm shadow-primary/30 hover:bg-green-800 focus-visible:ring-primary/40',
  success:
    'bg-success text-sidebar font-bold hover:brightness-95 focus-visible:ring-success/50',
  outline:
    'border border-border-subtle bg-white text-gray-700 hover:border-primary/40 hover:text-primary hover:bg-primary/5 focus-visible:ring-primary/30',
  danger:
    'bg-danger text-white shadow-sm shadow-danger/30 hover:bg-red-700 focus-visible:ring-danger/40',
  ghost:
    'bg-transparent text-gray-600 hover:bg-primary/10 hover:text-primary focus-visible:ring-primary/30',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-0',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all
      focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-1 active:scale-[0.97]
      disabled:opacity-50 disabled:pointer-events-none
      ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <Spinner size="sm" tone={variant === 'outline' || variant === 'ghost' ? 'brand' : 'light'} />}
    {children}
  </button>
);
