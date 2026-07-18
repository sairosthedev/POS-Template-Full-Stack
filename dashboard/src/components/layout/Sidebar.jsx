import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Package,
  Box,
  Store,
  Users,
  HelpCircle,
  Settings,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt
} from 'lucide-react';

const Sidebar = ({ user, collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) => {
  const location = useLocation();
  const role = String(user?.role || '').toLowerCase();
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} />, roles: ['admin', 'manager'] },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} />, roles: ['admin', 'manager'] },
    { name: 'Products', path: '/products', icon: <Package size={20} />, roles: ['admin', 'manager'] },
    { name: 'Inventory Management', path: '/inventory', icon: <Box size={20} />, roles: ['admin', 'manager'] },
    { name: 'Store Management', path: '/stores', icon: <Store size={20} />, roles: ['admin'] },
    { name: 'People', path: '/people', icon: <Users size={20} />, roles: ['admin', 'manager'] },
    { name: 'Expenses', path: '/expenses', icon: <Receipt size={20} />, roles: ['admin', 'manager'] },
    { name: 'Support', path: '/support', icon: <HelpCircle size={20} />, roles: ['admin', 'manager'] },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} />, roles: ['admin'] },
  ].filter((i) => !i.roles || i.roles.includes(role));

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          bg-sidebar text-slate-400 flex flex-col h-screen border-r border-white/5 z-50
          fixed inset-y-0 left-0 w-[260px] transition-all duration-300 ease-in-out
          md:static md:translate-x-0 md:shrink-0
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          ${collapsed ? 'md:w-[76px]' : 'md:w-[260px]'}
        `}
      >
        <div className={`h-[70px] flex items-center border-b border-white/5 ${collapsed ? 'md:justify-center md:px-0 px-6 justify-between' : 'px-6 justify-between'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/images/logo.png"
              alt="Belcit Trading"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20 bg-white shrink-0"
            />
            <span className={`text-white font-bold tracking-tight text-lg truncate ${collapsed ? 'md:hidden' : ''}`}>
              Belcit Trading
            </span>
          </div>
          {/* Mobile: close drawer */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={`p-3 flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'md:items-center' : ''}`}>
          <p className={`px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ${collapsed ? 'md:hidden' : ''}`}>
            Main Menu
          </p>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                to={item.path}
                key={item.name}
                title={item.name}
                onClick={onCloseMobile}
                className={`
                  flex items-center rounded-xl text-[0.9rem] font-medium transition-all group
                  ${collapsed ? 'md:w-11 md:h-11 md:justify-center md:px-0 px-4 py-3' : 'px-4 py-3'}
                  ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'hover:bg-white/5 hover:text-white'}
                `}
              >
                <span className={`transition-colors shrink-0 ${collapsed ? 'md:mr-0 mr-3' : 'mr-3'} ${isActive ? 'text-white' : 'group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                <span className={`truncate ${collapsed ? 'md:hidden' : ''}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop: collapse / expand toggle */}
        <button
          onClick={onToggleCollapse}
          className={`hidden md:flex items-center gap-3 mx-3 mb-2 px-4 py-2.5 rounded-xl text-[0.85rem] font-medium hover:bg-white/5 hover:text-white transition-colors ${collapsed ? 'justify-center px-0 w-11 h-11 mx-auto' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          <span className={collapsed ? 'hidden' : ''}>Collapse</span>
        </button>

        <div className={`p-5 border-t border-white/5 text-center ${collapsed ? 'md:px-1' : ''}`}>
          <p className={`text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none ${collapsed ? 'md:hidden' : ''}`}>
            &copy; {new Date().getFullYear()} Belcit Trading
          </p>
          <p className={`hidden text-[10px] font-bold text-slate-600 leading-none ${collapsed ? 'md:block' : ''}`}>&copy;</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
