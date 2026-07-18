import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children, onLogout, user }) => {
  // Desktop: icon-only collapsed mode (persisted). Mobile: off-canvas drawer.
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === '1');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const toggleCollapse = () =>
    setCollapsed((c) => {
      localStorage.setItem('sidebarCollapsed', c ? '0' : '1');
      return !c;
    });

  return (
    <div className="flex h-screen overflow-hidden bg-background w-full">
      <Sidebar
        user={user}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <Navbar onLogout={onLogout} user={user} onMenuClick={() => setMobileOpen(true)} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
