// src/components/dashboard/ChartWidget.jsx

import React, { useState, useEffect } from 'react';
// Plot is the main component from react-plotly.js used to render charts.
import Plot from 'react-plotly.js';
import apiClient from '../../services/apiClient';
import useApi from '../../hooks/useApi';

// 1. We define the two separate API calls we need for this component.
const getSightingsData = () => apiClient.get('/sightings');
const getSpeciesData = () => apiClient.get('/species');

function ChartWidget() {
  // 2. We use our custom hook twice, one for each data source.
  // We rename the destructured variables to avoid naming conflicts.
  const { data: sightings, loading: sightingsLoading, error: sightingsError } = useApi(getSightingsData);
  const { data: speciesData, loading: speciesLoading, error: speciesError } = useApi(getSpeciesData);

  // 3. We use React's useState to hold the final data that will be passed to the chart.
  // This state is populated only after we process the raw data from our API calls.
  const [chartData, setChartData] = useState([]);

  // 4. useEffect runs after the component renders. We use it to process our data.
  // It will re-run whenever the data from our API calls changes.
  useEffect(() => {
    // We only proceed if both API calls were successful and returned data.
    if (sightings && speciesData) {
      // Data processing logic: Count sightings for each species.
      const sightingsCount = sightings.reduce((acc, sighting) => {
        acc[sighting.species_id] = (acc[sighting.species_id] || 0) + 1;
        return acc;
      }, {});

      // Map species names to their sighting counts.
      const processedData = speciesData.results.map(species => ({
        name: species.common_name,
        count: sightingsCount[species.id] || 0, // Default to 0 if no sightings
      }));

      // Update our state with the processed data, ready for the chart.
      setChartData(processedData);
    }
  }, [sightings, speciesData]); // The dependency array ensures this code runs when data arrives.

  // 5. We define a combined loading state. The chart is loading if either API call is in progress.
  const isLoading = sightingsLoading || speciesLoading;
  // We also define a combined error state.
  const error = sightingsError || speciesError;

  if (isLoading) {
    return <div className="h-96 flex justify-center items-center bg-white rounded-lg shadow-md">Loading Chart Data...</div>;
  }

  if (error) {
    return <div className="h-96 flex justify-center items-center bg-red-100 text-red-600 rounded-lg shadow-md">Error loading chart data: {error.message}</div>;
  }

  // 6. Once data is ready, we render the Plotly chart.
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Plot
        // The `data` prop expects an array of "traces" (datasets to be plotted).
        data={[
          {
            // We use our processed chartData to define the x and y axes.
            x: chartData.map(item => item.name), // Species names
            y: chartData.map(item => item.count), // Sighting counts
            type: 'bar', // We specify that we want a bar chart.
            marker: { color: '#3b82f6' }, // Sets the bar color to a nice blue.
          },
        ]}
        // The `layout` prop configures the chart's appearance (titles, fonts, etc.).
        layout={{
          title: 'Number of Sightings per Species',
          xaxis: { title: 'Species' },
          yaxis: { title: 'Sighting Count' },
        }}
        // The `config` prop controls chart behaviors, like removing the Plotly logo.
        config={{ displaylogo: false, responsive: true }}
        // `useResizeHandler` and `style` make the chart fully responsive to its container size.
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default ChartWidget;
