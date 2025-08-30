// src/components/dashboard/MapWidget.jsx

import React from 'react';
// These are the core components from the react-leaflet library.
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// We'll also import our API service layer tools.
import apiClient from '../../services/apiClient';
import useApi from '../../hooks/useApi';

// 1. Define the API call to get sightings data.
const getSightingsData = () => apiClient.get('/sightings');

function MapWidget() {
  // 2. Use our custom hook to fetch the sightings data.
  // We rename 'data' to 'sightings' for better readability.
  const { data: sightings, loading, error } = useApi(getSightingsData);

  // Set the initial position and zoom level for the map.
  // Centered on India.
  const initialPosition = [20.5937, 78.9629];

  // 3. Handle loading and error states.
  if (loading) {
    return <div className="h-96 flex justify-center items-center bg-gray-200 rounded-lg">Loading Map...</div>;
  }

  if (error) {
    return <div className="h-96 flex justify-center items-center bg-red-100 text-red-600 rounded-lg">Error loading map data: {error.message}</div>;
  }

  // 4. Render the map once data is available.
  return (
    <div className="h-[500px] w-full rounded-lg shadow-md overflow-hidden">
      {/* 'MapContainer' is the main component that creates the map. */}
      <MapContainer center={initialPosition} zoom={5} style={{ height: '100%', width: '100%' }}>
        
        {/* 'TileLayer' is responsible for the visual map tiles (the background map image). */}
        {/* We're using OpenStreetMap, a free and open-source map provider. */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 5. Dynamically create markers from our API data. */}
        {/* We check if 'sightings' exists and is an array before mapping. */}
        {sightings && sightings.map(sighting => (
          // 'Marker' places a pin at a specific geographic coordinate.
          <Marker
            key={sighting.sighting_id} // A unique key is required for lists in React.
            position={[sighting.latitude, sighting.longitude]}
          >
            {/* 'Popup' creates a small bubble that appears when you click the marker. */}
            <Popup>
              <b>Sighting ID:</b> {sighting.sighting_id} <br />
              <b>Species ID:</b> {sighting.species_id} <br />
              <b>Temp:</b> {sighting.sea_surface_temp_c}°C
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapWidget;