'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function AccountsPage() {
  const { user } = useUser();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get API URL from environment variable
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        
        // Ensure API URL has https:// prefix
        if (apiUrl && !apiUrl.startsWith('http')) {
          apiUrl = `https://${apiUrl}`;
        }
        
        // Log the URL being used (for debugging)
        console.log('Using API URL:', apiUrl);
        
        // Make the API request with the properly formatted URL
        const response = await fetch(`${apiUrl}/accounts`, {
          headers: {
            'Content-Type': 'application/json',
            // Use session token if available, or omit Authorization header
            ...(user ? { 'Authorization': `Bearer ${user.id}` } : {}),
          },
        });
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setAccounts(data);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Accounts</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Accounts</h1>
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-medium text-yellow-800">Troubleshooting:</h3>
            <ul className="mt-2 list-disc list-inside text-sm text-yellow-700 space-y-1">
              <li>Check that your API URL is correctly set in Vercel environment variables</li>
              <li>Make sure your API URL includes <code>https://</code> (e.g., https://www.api.verdan.io)</li>
              <li>Verify that your API server is running and accessible</li>
              <li>Check that CORS is properly configured on your API server</li>
              <li>Visit <a href="/api-config" className="text-blue-600 underline">API Config</a> to verify your settings</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Accounts</h1>
      
      {accounts.length === 0 ? (
        <p className="text-gray-500">No accounts found.</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {accounts.map((account) => (
              <li key={account.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.email}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      account.status === 'active' ? 'bg-green-100 text-green-800' : 
                      account.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {account.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">API Configuration</h2>
        <p className="mb-2">
          Current API URL: <code className="bg-gray-200 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_URL || 'Not set'}</code>
        </p>
        <p>
          Visit <a href="/api-config" className="text-blue-600 underline">API Config</a> page to check your API configuration.
        </p>
      </div>
    </div>
  );
}