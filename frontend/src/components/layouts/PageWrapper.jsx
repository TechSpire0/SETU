// src/components/layout/PageWrapper.jsx

import React from 'react';

// This is a reusable wrapper component for our pages.
// It takes 'title', 'children', and an optional 'description' as props.
// 'children' is a special prop in React that contains whatever components are nested inside this one.
function PageWrapper({ title, description, children }) {
  return (
    // The `animate-fadeIn` class is a custom animation we will add later for a nice visual effect.
    <div className="animate-fadeIn">
      {/* The page title is rendered here, making it consistent across all pages. */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>

      {/* If a description is provided, it's rendered here. */}
      {description && (
        <p className="mb-8 text-gray-600">{description}</p>
      )}

      {/* The 'children' prop is rendered here. This is where the unique content */}
      {/* of each page (like the MapWidget or OtolithClassifier) will be displayed. */}
      <div>
        {children}
      </div>
    </div>
  );
}

export default PageWrapper;
