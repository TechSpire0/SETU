// src/pages/DashboardPage.jsx

import React from "react";

// Import all the widgets that will appear on the dashboard.
import MapWidget from "../components/dashboard/MapWidget";
import InsightsPanel from "../components/dashboard/InsightsPanel";
import DataCharts from "../components/dashboard/ChartWidget";

function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          CMLRE Species Explorer
        </h1>
        <p className="mt-1 text-gray-600">
          Welcome back, by TechSpire Team. Here is the latest overview of the
          marine biodiversity data.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map takes up 2/3 of the width on large screens */}
        <div className="lg:col-span-2">
          <MapWidget />
        </div>

        {/* AI Insights Panel takes up 1/3 */}
        <div className="lg:col-span-1">
          <InsightsPanel />
        </div>

        {/* Data Chart takes the full width below the map */}
        <div className="lg:col-span-3">
          <DataCharts />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
