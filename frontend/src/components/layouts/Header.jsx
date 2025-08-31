import React from 'react';

function Header({ sidebarOpen, onPinToggle, onMouseEnter }) {
  return (
    <header
      className={`
        fixed top-0 bg-white p-4 border-b border-gray-200 
        flex justify-between items-center z-20 
        transition-all duration-300 right-0
        ${sidebarOpen ? 'lg:left-64' : 'left-0'} 
      `}
    >
      <div className="flex items-center">
        {/* This button is only visible when the sidebar is CLOSED. */}
        {/* It handles both opening on hover and pinning on click. */}
        <button 
          onClick={onPinToggle}
          onMouseEnter={onMouseEnter}
          className={`fixed top-2 left-2 p-2 rounded-full text-gray-500 z-50 transition-all duration-300 hover:bg-gray-100 hover:text-gray-800 ${
            !sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <h1 className="text-xl font-semibold text-gray-800 ml-16 hidden sm:block">
          Species Explorer
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-600 hidden md:block">Jayanth (Lead Developer)</span>
        <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
      </div>
    </header>
  );
}

export default Header;

