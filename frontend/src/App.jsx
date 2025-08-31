// src/App.jsx

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/layouts/Header';
import Sidebar from './components/layouts/Sidebar';
import DashboardPage from './pages/DashboardPage';
import OtolithClassifierPage from './pages/OtolithClassifierPage';

const ComingSoon = () => (
  <div className="p-8"><h2 className="text-2xl font-bold">Coming Soon!</h2></div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

  const handlePinToggle = () => {
    const newPinnedState = !isSidebarPinned;
    setIsSidebarPinned(newPinnedState);
    if (newPinnedState) {
      setSidebarOpen(true);
    }
  };

  const handleMouseEnter = () => {
    setSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isSidebarPinned) {
      setSidebarOpen(false);
    }
  };
  
  const handleNavLinkClick = () => {
    setIsSidebarPinned(false);
    setSidebarOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar
        sidebarOpen={sidebarOpen}
        onMouseLeave={handleMouseLeave}
        onNavLinkClick={handleNavLinkClick}
        isSidebarPinned={isSidebarPinned}
      />
      
      {/* --- THE FIX --- */}
      {/* The main content's margin-left is now controlled by `sidebarOpen` instead of `isSidebarPinned`. */}
      {/* This ensures the content pushes to the side whenever the sidebar is visible, for both hover and pin. */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <Header
          sidebarOpen={sidebarOpen}
          onPinToggle={handlePinToggle}
          onMouseEnter={handleMouseEnter}
        />

        <main className="p-8 pt-24">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/otolith-classifier" element={<OtolithClassifierPage />} />
            <Route path="/edna-browser" element={<ComingSoon />} />
            <Route path="/data-upload" element={<ComingSoon />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

