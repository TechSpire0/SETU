// src/components/dashboard/OtolithClassifier.jsx

import React, { useState } from 'react';
import apiClient from '../../services/apiClient';

// 1. Import our new reusable components.
import Button from '../common/Button';
import Spinner from '../common/Spinner';

function OtolithClassifier() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // --- THE FIX IS HERE ---
      // We create two promises: one for the API call and one for a minimum delay.
      // This ensures our spinner is visible for at least 1.5 seconds, making the UI feel more responsive.
      const apiCallPromise = apiClient.post('/classify_otolith', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const delayPromise = new Promise(resolve => setTimeout(resolve, 1500)); // 1.5-second delay

      // Using Promise.all, we wait for both the API call AND the delay to finish.
      const [response] = await Promise.all([apiCallPromise, delayPromise]);
      
      setResult(response.data);
    } catch (err) {
      setError('Failed to classify image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">AI Otolith Classifier</h3>
      
      <div className="mb-4">
        <label htmlFor="otolith-upload" className="block text-sm font-medium text-gray-700 mb-2">
          Upload Otolith Image
        </label>
        <input 
          id="otolith-upload"
          type="file" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* 2. Replace the standard <button> with our new <Button> component. */}
      <Button 
        onClick={handleUpload}
        disabled={isLoading || !selectedFile}
        className="w-full flex items-center justify-center" // Added flex utilities for centering the spinner
      >
        {/* 3. Conditionally render the Spinner or the text based on the isLoading state. */}
        {isLoading ? <Spinner /> : 'Classify'}
      </Button>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold text-gray-700">Classification Result:</h4>
          <p className="text-2xl font-bold text-green-600 my-2">{result.predicted_species}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${result.confidence_score}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-600 mt-1">
            Confidence: {Math.round(result.confidence_score)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default OtolithClassifier;

