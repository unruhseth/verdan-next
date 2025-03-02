'use client';

import { useState, useEffect } from 'react';
import { API_CONFIG, checkConfig } from '../../utils/config';

export default function ApiConfigPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [configStatus, setConfigStatus] = useState({ valid: false, issues: [] as string[] });
  
  useEffect(() => {
    // Set the API URL
    setApiUrl(API_CONFIG.BASE_URL);
    
    // Check configuration
    setConfigStatus(checkConfig());
  }, []);
  
  // Create an example URL based on the API config
  const createExampleUrl = (endpoint: string): string => {
    if (!apiUrl) return 'API URL not configured';
    
    // Properly format the URL
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    return `${baseUrl}${formattedEndpoint}`;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Configuration</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Current Configuration</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Base API URL:</p>
          <div className="flex items-center">
            <code className="block bg-gray-200 p-2 rounded font-mono">
              {apiUrl || '(not set)'}
            </code>
            {!apiUrl && (
              <span className="ml-2 text-red-500 text-sm">
                NEXT_PUBLIC_API_URL is not set in environment variables
              </span>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Configuration Status:</p>
          <div className={`p-2 rounded ${configStatus.valid ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="font-medium">
              {configStatus.valid ? 'Configuration Valid' : 'Configuration Invalid'}
            </div>
            {configStatus.issues.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm">
                {configStatus.issues.map((issue, index) => (
                  <li key={index} className="text-red-700">{issue}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Example API URLs</h2>
        
        <div className="grid gap-2">
          {Object.entries(API_CONFIG.ENDPOINTS).map(([name, endpoint]) => (
            <div key={name} className="p-2 border-b border-gray-200 last:border-b-0">
              <div className="font-medium">{name}:</div>
              <div className="mt-1 font-mono text-sm bg-gray-200 p-2 rounded overflow-x-auto">
                {createExampleUrl(endpoint)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">How to Fix</h2>
        
        <p className="mb-4">
          If you see any issues with your API configuration, update your Vercel environment variables:
        </p>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Set NEXT_PUBLIC_API_URL correctly</strong>
            <div className="ml-6 mt-1 text-sm text-gray-600">
              Example: <code className="bg-gray-200 px-1 py-0.5 rounded">https://api.verdan.io</code> (include https://)
            </div>
          </li>
          
          <li>
            <strong>Do not include trailing slashes</strong>
            <div className="ml-6 mt-1 text-sm text-gray-600">
              Correct: <code className="bg-gray-200 px-1 py-0.5 rounded">https://api.verdan.io</code><br />
              Incorrect: <code className="bg-gray-200 px-1 py-0.5 rounded">https://api.verdan.io/</code>
            </div>
          </li>
        </ol>
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Updates Made to Fix URL Issues</h2>
        
        <p className="mb-2">
          The following improvements have been made to fix the API URL issues:
        </p>
        
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>
            Added robust API URL formatting to handle missing protocols automatically
            <div className="ml-6 mt-1 text-sm">
              <code>www.api.verdan.io</code> → <code>https://www.api.verdan.io</code>
            </div>
          </li>
          
          <li>
            Created utility hooks to properly construct API URLs
          </li>
          
          <li>
            Implemented configuration validation to catch issues early
          </li>
        </ul>
        
        <p className="mt-4 text-sm">
          These changes ensure that API calls will work correctly even when the URL is formatted
          incorrectly in environment variables.
        </p>
      </div>
    </div>
  );
}