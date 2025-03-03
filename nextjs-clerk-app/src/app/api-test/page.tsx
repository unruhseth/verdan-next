'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ApiTestPage() {
  const { user } = useUser();
  const [apiTests, setApiTests] = useState<{ endpoint: string; status: 'pending' | 'success' | 'error'; message: string }[]>([
    { endpoint: '/accounts', status: 'pending', message: 'Not tested yet' },
    { endpoint: '/apps', status: 'pending', message: 'Not tested yet' },
    { endpoint: '/devices', status: 'pending', message: 'Not tested yet' },
  ]);
  
  const [apiUrl, setApiUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualTestUrl, setManualTestUrl] = useState('');
  const [manualTestResult, setManualTestResult] = useState<{status: 'pending' | 'success' | 'error', message: string}>({
    status: 'pending',
    message: 'Not tested yet'
  });

  useEffect(() => {
    // Get API URL from environment variable
    const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    setApiUrl(configuredApiUrl);
    
    // Auto-populate the manual test field with a default endpoint
    if (configuredApiUrl) {
      setManualTestUrl(`${configuredApiUrl}/health-check`);
    }
  }, []);

  // Function to test all predefined API endpoints
  const runAllTests = async () => {
    if (!apiUrl) {
      setApiTests(apiTests.map(test => ({
        ...test,
        status: 'error',
        message: 'API URL is not configured'
      })));
      return;
    }

    setLoading(true);
    
    // Create a copy of the tests to update
    const updatedTests = [...apiTests];
    
    // Process each test one by one
    for (let i = 0; i < updatedTests.length; i++) {
      const test = updatedTests[i];
      
      // Update status to pending
      updatedTests[i] = { ...test, status: 'pending', message: 'Testing...' };
      setApiTests([...updatedTests]);
      
      try {
        // Format the API URL properly, ensuring it has https:// prefix
        let baseUrl = apiUrl;
        if (baseUrl && !baseUrl.startsWith('http')) {
          baseUrl = `https://${baseUrl}`;
        }
        
        // Make the API request with proper format
        const fullUrl = `${baseUrl}${test.endpoint}`;
        console.log(`Testing API endpoint: ${fullUrl}`);
        
        const response = await fetch(fullUrl, {
          headers: {
            'Content-Type': 'application/json',
            // Add authorization if user is available
            ...(user ? { 'Authorization': `Bearer ${user.id}` } : {}),
          },
          // Adding a cache buster to avoid cached responses
          cache: 'no-store',
        });
        
        if (response.ok) {
          updatedTests[i] = { 
            ...test, 
            status: 'success', 
            message: `Status: ${response.status} ${response.statusText}` 
          };
        } else {
          updatedTests[i] = { 
            ...test, 
            status: 'error', 
            message: `Failed with status: ${response.status} ${response.statusText}` 
          };
        }
      } catch (error) {
        updatedTests[i] = { 
          ...test, 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Unknown error occurred' 
        };
      }
      
      // Update the state with the current test results
      setApiTests([...updatedTests]);
    }
    
    setLoading(false);
  };

  // Function to test a manual (user-specified) endpoint
  const runManualTest = async () => {
    if (!manualTestUrl) {
      setManualTestResult({
        status: 'error',
        message: 'Please enter a URL to test'
      });
      return;
    }

    setManualTestResult({
      status: 'pending',
      message: 'Testing...'
    });
    
    try {
      // Determine if the URL contains http/https already
      const url = manualTestUrl.startsWith('http') 
        ? manualTestUrl 
        : `https://${manualTestUrl}`;
      
      console.log(`Testing manual URL: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { 'Authorization': `Bearer ${user.id}` } : {}),
        },
        cache: 'no-store',
      });
      
      if (response.ok) {
        let responseText = '';
        try {
          const data = await response.json();
          responseText = JSON.stringify(data, null, 2);
        } catch (e) {
          responseText = await response.text();
        }
        
        setManualTestResult({ 
          status: 'success', 
          message: `Status: ${response.status} ${response.statusText}\n\nResponse:\n${responseText}` 
        });
      } else {
        setManualTestResult({ 
          status: 'error', 
          message: `Failed with status: ${response.status} ${response.statusText}` 
        });
      }
    } catch (error) {
      setManualTestResult({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Connectivity Test</h1>
      
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Configuration</h2>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Configured API URL:</p>
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
        <div>
          <p className="text-sm text-gray-600 mb-1">URL Used for Testing:</p>
          <code className="block bg-gray-200 p-2 rounded font-mono">
            {apiUrl && !apiUrl.startsWith('http') ? `https://${apiUrl}` : apiUrl || '(not set)'}
          </code>
        </div>
        
        {/* Authentication status */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Authentication Status:</p>
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${user ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>{user ? 'Authenticated' : 'Not Authenticated'}</span>
          </div>
          {user && (
            <div className="mt-2 text-sm text-gray-600">
              User ID: <code className="bg-gray-200 px-1 py-0.5 rounded">{user.id}</code>
            </div>
          )}
        </div>
      </div>
      
      {/* Predefined API Tests */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Predefined API Tests</h2>
          <button
            onClick={runAllTests}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>
        
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200">
            {apiTests.map((test, index) => (
              <li key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-3
                      ${test.status === 'success' ? 'bg-green-500' : 
                        test.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}
                    ></span>
                    <div>
                      <p className="font-medium">{apiUrl}{test.endpoint}</p>
                      <p className={`text-sm ${
                        test.status === 'success' ? 'text-green-600' : 
                        test.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {test.message}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Manual API Test */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Test Custom Endpoint</h2>
        
        <div className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={manualTestUrl}
              onChange={(e) => setManualTestUrl(e.target.value)}
              placeholder="Enter API URL to test"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={runManualTest}
              className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
            >
              Test
            </button>
          </div>
        </div>
        
        {manualTestResult.status !== 'pending' && (
          <div className={`p-4 rounded ${
            manualTestResult.status === 'success' ? 'bg-green-50 border border-green-200' : 
            'bg-red-50 border border-red-200'
          }`}>
            <h3 className={`font-medium ${
              manualTestResult.status === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {manualTestResult.status === 'success' ? 'Success' : 'Error'}
            </h3>
            <pre className="mt-2 text-sm overflow-auto p-2 bg-black bg-opacity-5 rounded">
              {manualTestResult.message}
            </pre>
          </div>
        )}
      </div>
      
      {/* Troubleshooting Guide */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Troubleshooting</h2>
        
        <div className="mb-4">
          <h3 className="font-medium text-yellow-700">If tests are failing:</h3>
          <ul className="mt-2 list-disc list-inside text-sm text-yellow-700 space-y-1">
            <li>Check that your API server is running and accessible</li>
            <li>Verify that CORS is properly configured on your API server</li>
            <li>Make sure your API URL includes the <code>https://</code> protocol</li>
            <li>Check that you're authenticated if the endpoints require authentication</li>
            <li>Verify that the endpoints exist and are spelled correctly</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-yellow-700">Environment Variables:</h3>
          <p className="mt-1 text-sm text-yellow-700">
            Update your environment variables in the Vercel dashboard:
          </p>
          <ol className="mt-2 list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Go to your Vercel project dashboard</li>
            <li>Navigate to Settings &gt; Environment Variables</li>
            <li>Set <code>NEXT_PUBLIC_API_URL</code> to <code>https://www.api.verdan.io</code></li>
            <li>Redeploy your application</li>
          </ol>
        </div>
      </div>
    </div>
  );
}