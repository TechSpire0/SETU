import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layout and Page Components
import Header from './components/layouts/Header';
import Sidebar from './components/layouts/Sidebar';
import DashboardPage from './pages/DashboardPage';
import OtolithClassifierPage from './pages/OtolithClassifierPage';

const ComingSoon = () => (
  <div className="p-8"><h2 className="text-2xl font-bold">Coming Soon!</h2></div>
);

function App() {
  // This state controls whether the sidebar is currently visible.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // This state controls whether the sidebar is "locked" open.
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

  // --- LOGIC FOR HOVER AND PINNING ---

  const handlePinToggle = () => {
    const newPinnedState = !isSidebarPinned;
    setIsSidebarPinned(newPinnedState);
    // If we are pinning the sidebar, we must ensure it's open.
    if (newPinnedState) {
      setSidebarOpen(true);
    }
  };

  // When the mouse enters the trigger area (the button in the header), open the sidebar.
  const handleMouseEnter = () => {
    setSidebarOpen(true);
  };

  // When the mouse leaves the sidebar itself, close it, but only if it's not pinned.
  const handleMouseLeave = () => {
    if (!isSidebarPinned) {
      setSidebarOpen(false);
    }
  };
  
  // When a user clicks a nav link, the sidebar closes (if it's not pinned).
  const handleNavLinkClick = () => {
    if (!isSidebarPinned) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar
        sidebarOpen={sidebarOpen}
        onMouseLeave={handleMouseLeave}
        onNavLinkClick={handleNavLinkClick}
        isSidebarPinned={isSidebarPinned}
        onPinToggle={handlePinToggle}
      />
      
      {/* This main content area is given a relative position and a lower z-index */}
      {/* This is the key to ensuring the fixed Header always stays on top during scroll. */}
      <div className={`relative z-10 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <Header
          sidebarOpen={sidebarOpen}
          onMouseEnter={handleMouseEnter}
        />

        {/* Padding top on the main content prevents it from starting underneath the fixed header */}
        <main className="pt-20 p-4 lg:p-8">
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

