// src/components/layout/Header.jsx

import React from 'react';

// This is the top navigation bar of our application.
function Header() {
  return (
    // 'header' is a semantic HTML5 tag for the top section of a page.
    // Tailwind CSS classes are used for styling.
    <header
      className="
        fixed           // Keeps the header at the top of the viewport.
        top-0           // Positions it at the very top.
        left-64         // Starts it to the right of the sidebar (width 64 = 16rem).
        right-0         // Stretches it to the right edge of the viewport.
        bg-white        // Sets a solid white background color.
        p-4             // Applies 1rem of padding on all sides.
        border-b        // Adds a 1px border to the bottom.
        border-gray-200 // Sets the border color to a light gray.
        flex            // Enables flexbox layout.
        justify-between // Pushes child elements to opposite ends (left and right).
        items-center    // Aligns child elements vertically in the center.
        z-10            // Ensures the header stays above the main content.
      "
    >
      {/* Left side of the header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Species Explorer</h1>
      </div>

      {/* Right side of the header */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Jayanth (Lead Developer)</span>
        <div className="w-10 h-10 bg-blue-500 rounded-full"></div> {/* Placeholder for a user avatar */}
      </div>
    </header>
  );
}

export default Header;