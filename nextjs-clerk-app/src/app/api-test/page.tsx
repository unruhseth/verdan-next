'use client';

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the API URL from environment variable
    const url = process.env.NEXT_PUBLIC_API_URL || '';
    setApiUrl(url);
  }, []);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      // Make sure the URL has the right protocol
      let testUrl = apiUrl;
      if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
        testUrl = 'https://' + testUrl;
      }

      // Try to connect to the API
      const response = await fetch(`${testUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Important: No credentials for the initial CORS test
        credentials: 'omit',
      });

      const data = await response.json();
      
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        data,
        headers: {
          'content-type': response.headers.get('content-type'),
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        }
      });
    } catch (err) {
      console.error("API test failed:", err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      // Try a CORS diagnostic
      try {
        await checkCorsIssue(apiUrl);
      } catch (corsErr) {
        console.error("CORS diagnostic failed:", corsErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkCorsIssue = async (url: string) => {
    if (!url) return;
    
    let testUrl = url;
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
      testUrl = 'https://' + testUrl;
    }
    
    try {
      // Try a simple OPTIONS preflight request
      const response = await fetch(testUrl, {
        method: 'OPTIONS',
        mode: 'cors',
      });
      
      setTestResult((prev: any) => ({
        ...prev,
        corsTest: {
          success: response.ok,
          status: response.status,
          headers: {
            'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
            'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
            'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
          }
        }
      }));
    } catch (err) {
      setTestResult((prev: any) => ({
        ...prev,
        corsTest: {
          success: false,
          error: err instanceof Error ? err.message : 'CORS preflight failed'
        }
      }));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">API Configuration</h2>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Current API URL from environment:</p>
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
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={testApiConnection}
            disabled={loading || !apiUrl}
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-medium text-yellow-800">Troubleshooting Tips:</h3>
            <ul className="mt-2 list-disc list-inside text-sm text-yellow-700 space-y-1">
              <li>Make sure your API URL includes <code>https://</code> (e.g., https://api.verdan.io)</li>
              <li>Check that your API server is running and accessible on the internet</li>
              <li>Verify CORS settings on your API server allow requests from your frontend domain</li>
              <li>Check network tab in developer tools for more detailed error information</li>
            </ul>
          </div>
        </div>
      )}

      {testResult && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Test Results</h2>
          <div className="bg-gray-100 p-4 rounded">
            <div className="mb-2">
              <span className="font-medium">Status: </span>
              <span className={testResult.status >= 200 && testResult.status < 300 ? 'text-green-600' : 'text-red-600'}>
                {testResult.status} {testResult.statusText}
              </span>
            </div>
            
            {testResult.headers && (
              <div className="mb-2">
                <span className="font-medium">Headers:</span>
                <pre className="mt-1 bg-gray-200 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(testResult.headers, null, 2)}
                </pre>
              </div>
            )}
            
            {testResult.data && (
              <div className="mb-2">
                <span className="font-medium">Response Data:</span>
                <pre className="mt-1 bg-gray-200 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            )}

            {testResult.corsTest && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-medium text-blue-800">CORS Diagnostic:</h3>
                <div className="mt-1 text-sm">
                  <div className="mb-1">
                    <span className="font-medium">Success: </span>
                    <span className={testResult.corsTest.success ? 'text-green-600' : 'text-red-600'}>
                      {testResult.corsTest.success ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  {testResult.corsTest.headers && (
                    <div>
                      <span className="font-medium">CORS Headers:</span>
                      <pre className="mt-1 bg-gray-200 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(testResult.corsTest.headers, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {testResult.corsTest.error && (
                    <div className="text-red-600">
                      Error: {testResult.corsTest.error}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">API Configuration Guide</h2>
        
        <p className="mb-4">
          The frontend needs to communicate with your backend API. Make sure:
        </p>
        
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>
            <strong>NEXT_PUBLIC_API_URL</strong> is set correctly in Vercel environment variables
            <div className="ml-6 mt-1 text-sm text-gray-600">
              Example: <code className="bg-gray-200 px-1 py-0.5 rounded">https://api.verdan.io</code> (include https://)
            </div>
          </li>
          
          <li>
            <strong>CORS is enabled</strong> on your API server
            <div className="ml-6 mt-1 text-sm text-gray-600">
              Your API must allow requests from: <code className="bg-gray-200 px-1 py-0.5 rounded">https://www.verdan.io</code>
            </div>
          </li>
          
          <li>
            <strong>API endpoints</strong> match what your frontend expects
            <div className="ml-6 mt-1 text-sm text-gray-600">
              Check that API routes are correctly implemented and accessible
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}