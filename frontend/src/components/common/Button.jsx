// src/components/common/Button.jsx

import React from 'react';

// This is a generic, reusable button component.
// It accepts all the standard props a regular <button> would, plus a `className` for custom styling.
// The `...props` syntax gathers all other passed-in props (like onClick, disabled, type) into an object.
function Button({ children, className = '', ...props }) {
  // Base classes define the fundamental look and feel of the button.
  const baseClasses = "font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:cursor-not-allowed";
  
  // Primary styles for the default button appearance.
  const primaryClasses = "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400";

  return (
    <button
      // We combine the base styles, the default primary styles, and any custom classes passed in.
      // This allows us to override or extend the button's look from outside the component.
      className={`${baseClasses} ${primaryClasses} ${className}`}
      {...props} // All other props (e.g., onClick={handleUpload}, disabled={isLoading}) are applied here.
    >
      {children} {/* The text or icon inside the button is passed as children. */}
    </button>
  );
}

export default Button;
