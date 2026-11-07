import React from 'react';
import Navbar from '../common/Navbar.jsx';
import Sidebar from '../common/Sidebar.jsx';
import Footer from '../common/Footer.jsx';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-agri-bg">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
