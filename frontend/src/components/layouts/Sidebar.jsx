import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ sidebarOpen, onMouseLeave, onNavLinkClick, isSidebarPinned, onPinToggle }) {
  const linkStyle = "flex items-center p-2 rounded text-gray-300 hover:bg-slate-700 transition-colors duration-200";
  
  return (
    <aside
      onMouseLeave={onMouseLeave}
      className={`
        fixed top-0 left-0 h-screen w-64 bg-slate-900 p-4 z-50 
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-24 h-12 bg-gray-700 rounded flex items-center justify-center text-gray-300">Logo</div>
        
        <button 
          onClick={onPinToggle}
          className={`p-2 rounded-full transition-colors ${isSidebarPinned ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}
          title={isSidebarPinned ? "Unpin sidebar" : "Pin sidebar"}
        >
          {/* Pin Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 12.756 13 14.062 13 15.5a.5.5 0 0 1-1 0c0-.962-.328-1.77-1.03-2.516-.22-.172-.46-.337-.682-.502l-.078-.048v-4.43c.104-.074.228-.173.354-.298C11.658 2.174 12 1.68 12 1V.5a.5.5 0 0 1-.5-.5h-7a.5.5 0 0 1-.354-.146zM8 5a1 1 0 0 0-1 1v4.43l-1.447 1.256A4.5 4.5 0 0 0 3 15.5a.5.5 0 0 0 1 0c0-.962.328-1.77 1.03-2.516.22-.172.46-.337-.682-.502l.078-.048V6a1 1 0 0 0-1-1z"/>
          </svg>
        </button>
      </div>

      <div className="text-center my-4">
        <h2 className="text-lg font-bold text-white">CMLRE Unified Platform</h2>
        <p className="text-xs text-gray-400">SIH 2025 - ID25041</p>
      </div>

      <nav>
        <ul>
          {[
            { to: "/", label: "Dashboard" },
            { to: "/edna-browser", label: "eDNA Browser" },
            { to: "/otolith-classifier", label: "Otolith Classifier" },
            { to: "/data-upload", label: "Data Upload" },
          ].map((item) => (
            <li className="mb-2" key={item.to}>
              <NavLink 
                to={item.to} 
                className={({ isActive }) => `${linkStyle} ${isActive ? 'bg-blue-700 text-white' : ''}`}
                onClick={onNavLinkClick}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;

