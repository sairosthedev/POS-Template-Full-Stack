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
  Menu,
  Receipt
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Inventory Management', path: '/inventory', icon: <Box size={20} /> },
    { name: 'Store Management', path: '/stores', icon: <Store size={20} /> },
    { name: 'People', path: '/people', icon: <Users size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <Receipt size={20} /> },
    { name: 'Support', path: '/support', icon: <HelpCircle size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-[260px] bg-sidebar text-slate-400 flex flex-col h-screen shrink-0 border-r border-white/5">
      <div className="h-[70px] px-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-lg">M</div>
          <span className="text-white font-bold tracking-tight text-lg">Miccs POS</span>
        </div>
        <Menu size={20} className="cursor-pointer hover:text-white transition-colors" />
      </div>
      
      <nav className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
        <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Menu</p>
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              to={item.path} 
              key={item.name} 
              className={`
                flex items-center px-4 py-3 rounded-xl text-[0.9rem] font-medium transition-all group
                ${isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className={`mr-3 transition-colors ${isActive ? 'text-white' : 'group-hover:text-primary'}`}>
                {item.icon}
              </span> 
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">
          &copy; {new Date().getFullYear()} Miccs Tech
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
