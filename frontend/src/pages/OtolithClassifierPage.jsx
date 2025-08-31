// src/pages/OtolithClassifierPage.jsx

import React from 'react';
import OtolithClassifier from '../components/dashboard/OtolithClassifier';

// This component represents the page for the Otolith Classifier tool.
function OtolithClassifierPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">AI Otolith Classifier</h2>
      <div className="max-w-xl mx-auto"> {/* Center the component and limit its width */}
        <OtolithClassifier />
      </div>
    </div>
  );
}

export default OtolithClassifierPage;
