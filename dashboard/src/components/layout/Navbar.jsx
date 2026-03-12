import React from 'react';
import { RefreshCw, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

const TopNavbar = ({ onLogout, user }) => {
  return (
    <header className="h-[70px] bg-white flex items-center justify-between px-8 border-b border-border-subtle shadow-sm w-full shrink-0">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-black text-sidebar tracking-tight">Dashboard Overview</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-text-main leading-none">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1 tracking-wider">{user?.role || 'Staff'}</p>
          </div>
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary font-bold border border-slate-100 shadow-sm overflow-hidden">
            {user?.avatar ? <img src={user.avatar} alt="" /> : user?.name?.charAt(0) || 'U'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-primary hover:bg-blue-50/50">
            <RefreshCw size={20} />
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            className="bg-danger/10 text-danger hover:bg-danger hover:text-white border-0 focus:ring-danger/20 gap-2 font-bold px-4 py-2"
            onClick={onLogout}
          >
            <LogOut size={16} /> <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
