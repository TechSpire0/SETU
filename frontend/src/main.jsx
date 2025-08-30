// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// --- CRUCIAL FIX ---
// This line imports the required stylesheet for Leaflet maps.
// Without it, the map tiles will not be positioned correctly, leading to the
// jumbled look you are seeing. This is the most likely source of the error.
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
