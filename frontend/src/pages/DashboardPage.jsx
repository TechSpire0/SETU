// src/pages/DashboardPage.jsx

import React from 'react';
// 1. Import the PageWrapper component.
import PageWrapper from '../components/layouts/PageWrapper';

// Import the specific widgets this page needs.
import MapWidget from '../components/dashboard/MapWidget';
import ChartWidget from '../components/dashboard/ChartWidget';
import InsightsPanel from '../components/dashboard/InsightsPanel';

function DashboardPage() {
  return (
    // 2. Wrap the entire page content within the PageWrapper.
    // We provide a `title` and a `description` as props.
    <PageWrapper
      title="Species Explorer Dashboard"
      description="An overview of marine biodiversity data, sightings, and AI-generated insights."
    >
      {/* 3. The unique content for this page (the grid of widgets) is passed as `children`. */}
      {/* The wrapper will handle the title, description, and fade-in animation automatically. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <MapWidget />
        </div>
        <div className="md:col-span-2">
          <InsightsPanel />
        </div>
        <ChartWidget />
      </div>
    </PageWrapper>
  );
}

export default DashboardPage;

