// src/components/dashboard/ChartWidget.jsx

import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import apiClient from "../../services/apiClient";
import useApi from "../../hooks/useApi";

const getSightingsData = () => apiClient.get("/sightings");
const getSpeciesData = () => apiClient.get("/species");

function ChartWidget() {
  const {
    data: sightings,
    loading: sightingsLoading,
    error: sightingsError,
  } = useApi(getSightingsData);
  const {
    data: speciesData,
    loading: speciesLoading,
    error: speciesError,
  } = useApi(getSpeciesData);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (sightings && speciesData) {
      const sightingsCount = sightings.reduce((acc, sighting) => {
        acc[sighting.species_id] = (acc[sighting.species_id] || 0) + 1;
        return acc;
      }, {});

      const processedData =
        speciesData?.results?.map((species) => ({
          name: species.common_name,
          count: sightingsCount[species.id] || 0,
        })) || [];

      setChartData(processedData);
    }
  }, [sightings, speciesData]);

  const isLoading = sightingsLoading || speciesLoading;
  const error = sightingsError || speciesError;

  if (isLoading) {
    // Corrected the height class from h-85 to h-96
    return (
      <div className="h-96 flex justify-center items-center bg-white rounded-lg shadow-md">
        Loading Chart Data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex justify-center items-center bg-red-100 text-red-600 rounded-lg shadow-md">
        Error loading chart data: {error.message}
      </div>
    );
  }

  return (
    // --- THE FIX IS HERE ---
    // We've added a fixed height (h-96) to this container.
    // Now the Plotly component inside, which uses height: '100%', has a container to fill.
    <div className="bg-white p-4 rounded-lg shadow-md h-96">
      <Plot
        data={[
          {
            x: chartData.map((item) => item.name),
            y: chartData.map((item) => item.count),
            type: "bar",
            marker: { color: "#3b82f6" },
          },
        ]}
        layout={{
          title: "Number of Sightings per Species",
          xaxis: { title: "Species" },
          yaxis: { title: "Sighting Count" },
          autosize: true, // Added for better resizing
        }}
        config={{ displaylogo: false, responsive: true }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default ChartWidget;
