// src/components/dashboard/InsightsPanel.jsx

import React from "react";
import useApi from "../../hooks/useApi";
import apiClient from "../../services/apiClient";

// A simple utility to get a color based on the severity of the hypothesis.
const getSeverityBadgeColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Define the API call to fetch the hypotheses.
const getHypotheses = () => apiClient.get("/api/hypotheses");

function InsightsPanel() {
  const { data: hypotheses, loading, error } = useApi(getHypotheses);

  // Render a loading state while the data is being fetched.
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  // Render an error message if the API call fails.
  if (error) {
    return (
      <div className="bg-red-100 text-red-600 p-4 rounded-lg shadow-md">
        Error loading insights: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        AI-Generated Insights
      </h3>
      <div className="space-y-4">
        {hypotheses &&
          Array.isArray(hypotheses) &&
          hypotheses.map((hyp) => (
            <div key={hyp.id} className="border border-gray-200 p-4 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-700">{hyp.title}</h4>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getSeverityBadgeColor(
                    hyp.severity
                  )}`}
                >
                  {hyp.severity}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{hyp.statement}</p>
              <p className="text-xs text-gray-500">
                Based on {hyp.supporting_data_points} data points.
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default InsightsPanel;
