// src/components/layout/Sidebar.jsx

import React from 'react';
// We'll add our CMLRE logo here later.
// import CmlreLogo from '../../assets/cmlre-logo.png';

// This is the main navigation panel on the left side of the dashboard.
function Sidebar() {
  return (
    // 'aside' is a semantic HTML5 tag for side content.
    <aside
      className="
        fixed        // Keeps the sidebar visible while scrolling.
        top-0        // Positions it at the very top of the viewport.
        left-0       // Positions it at the very left.
        h-screen     // Makes the sidebar take up the full height of the screen.
        w-64         // Sets a fixed width of 16rem (width-64 in Tailwind).
        bg-slate-900 // Sets a very dark blue-gray background.
        text-white   // Sets the default text color for all children to white.
        p-4          // Applies 1rem of padding.
        z-20         // Sets a higher z-index than the header to ensure it's on top.
      "
    >
      {/* Logo and Project Title Section */}
      <div className="mb-8 text-center">
        {/* <img src={CmlreLogo} alt="CMLRE Logo" className="w-24 mx-auto mb-4" /> */}
        <div className="w-24 h-12 mx-auto mb-4 bg-gray-500 rounded">Logo Placeholder</div>
        <h2 className="text-lg font-bold">CMLRE Unified Platform</h2>
        <p className="text-xs text-gray-400">SIH 2025 - ID25041</p>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul>
          {/* We will map over a list of navigation items later to make this dynamic */}
          <li className="mb-4">
            <a href="#" className="block p-2 rounded bg-blue-600">Dashboard</a>
          </li>
          <li className="mb-4">
            <a href="#" className="block p-2 rounded hover:bg-slate-700">eDNA Browser</a>
          </li>
          <li className="mb-4">
            <a href="#" className="block p-2 rounded hover:bg-slate-700">Otolith Classifier</a>
          </li>
          <li className="mb-4">
            <a href="#" className="block p-2 rounded hover:bg-slate-700">Data Upload</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;