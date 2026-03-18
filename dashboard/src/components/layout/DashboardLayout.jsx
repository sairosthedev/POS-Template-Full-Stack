import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children, onLogout, user }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background w-full">
      <Sidebar user={user} />
      <main className="flex-1 flex flex-col min-w-0">
        <Navbar onLogout={onLogout} user={user} />
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
