// src/App.jsx

import React from 'react';
import Header from './components/layouts/Header'; // Corrected path
import Sidebar from './components/layouts/Sidebar'; // Corrected path
import MapWidget from './components/dashboard/MapWidget'; // 1. Import the new MapWidget
import ChartWidget from './components/dashboard/ChartWidget';

// Note: The imports for apiClient and useApi have been removed from this file,
// because all the data fetching logic is now handled inside MapWidget.

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-8 pt-24">
          
          {/* --- EDITED LINE --- */}
          {/* We've changed `lg:grid-cols-2` to `md:grid-cols-2`. */}
          {/* This makes the two-column layout activate sooner, on medium-sized screens */}
          {/* (typically 768px and wider), which is more suitable for most laptop/tablet views. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The MapWidget is the first item in our responsive grid. */}
            <MapWidget />

            {/* The ChartWidget is the second item. */}
            <ChartWidget />

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;