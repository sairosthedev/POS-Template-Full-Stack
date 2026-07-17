import React from 'react';
import { Spinner } from './Spinner';

/**
 * Full-screen branded splash shown while the app boots.
 */
export const Splash = ({ message = 'Preparing your workspace…' }) => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-white via-background to-success/10 animate-fade-in">
    <div className="relative flex items-center justify-center">
      <span className="absolute w-44 h-44 rounded-full bg-success/15 animate-splash-ring" />
      <img
        src="/images/logo.png"
        alt="Belcit Trading"
        className="w-32 h-32 rounded-full object-cover shadow-2xl shadow-primary/20 ring-4 ring-white animate-splash-pop"
      />
    </div>
    <h1 className="mt-8 text-xl font-black tracking-[0.3em] text-sidebar uppercase">Belcit Trading</h1>
    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.35em] text-primary/70">Grocery Shop</p>
    <div className="mt-8 flex items-center gap-3">
      <Spinner size="sm" />
      <span className="text-xs font-medium text-gray-400">{message}</span>
    </div>
  </div>
);
