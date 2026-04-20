import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cdm-50 via-white to-cdm-100 dark:from-gray-900 dark:via-cdm-900/20 dark:to-gray-900">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;