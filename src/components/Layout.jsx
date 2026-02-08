// components/Layout.jsx
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import PageLoader from './PageLoader';

const Layout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-50 to-blue-50/20">
      {/* Sidebar - Fixed width (no collapse feature) */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content with smooth entrance animation */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;