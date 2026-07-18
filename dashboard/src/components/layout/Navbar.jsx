import React from 'react';
import { RefreshCw, LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

const TopNavbar = ({ onLogout, user, onMenuClick }) => {
  return (
    <header className="h-[70px] bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border-subtle shadow-sm w-full shrink-0 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile: open sidebar drawer */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-lg sm:text-xl font-black text-sidebar tracking-tight truncate">Dashboard</h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <div className="flex items-center gap-3 sm:pr-6 sm:border-r border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-text-main leading-none">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1 tracking-wider">{user?.role || 'Staff'}</p>
          </div>
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary font-bold border border-slate-100 shadow-sm overflow-hidden shrink-0">
            {user?.avatar ? <img src={user.avatar} alt="" /> : user?.name?.charAt(0) || 'U'}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-400 hover:text-primary hover:bg-green-50/50">
            <RefreshCw size={20} />
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-danger/10 text-danger hover:bg-danger hover:text-white border-0 focus:ring-danger/20 gap-2 font-bold px-3 sm:px-4 py-2"
            onClick={onLogout}
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
