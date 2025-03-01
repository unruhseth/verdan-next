'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { getApiUrl, getImageUrl } from '@/utils/urls';
import LoadingSpinner from '@/components/LoadingSpinner';

interface App {
  id: string;
  name: string;
  description: string;
  app_key: string;
  icon_url?: string;
  fa_icon?: string;
}

interface Account {
  id: string;
  name: string;
  installed_apps?: { id: string }[];
}

export default function AppPage() {
  const { app_key } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [app, setApp] = useState<App | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        
        const token = await getToken();

        // Fetch the app and account data
        const [appResponse, accountsResponse] = await Promise.all([
          fetch(`${getApiUrl()}/admin/apps/${app_key}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(`${getApiUrl()}/admin/accounts`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (!appResponse.ok || !accountsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [appData, accountsData] = await Promise.all([
          appResponse.json(),
          accountsResponse.json()
        ]);

        // For each account, fetch its installed apps
        const accountsWithApps = await Promise.all(
          accountsData.map(async (account: Account) => {
            const installedAppsResponse = await fetch(
              `${getApiUrl()}/admin/accounts/${account.id}/apps/installed`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            if (installedAppsResponse.ok) {
              const installedApps = await installedAppsResponse.json();
              return {
                ...account,
                installed_apps: installedApps
              };
            }
            return account;
          })
        );

        setApp(appData);
        setAccounts(accountsWithApps);
        setPreviewUrl(appData.icon_url ? getImageUrl(appData.icon_url) : null);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (app_key && user) {
      fetchData();
    }
  }, [app_key, getToken, user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleSaveIcon = async () => {
    if (!selectedFile || !app_key) return;

    try {
      setIsUploading(true);
      setUploadError(null);

      const token = await getToken();
      const formData = new FormData();
      formData.append('icon', selectedFile);

      const response = await fetch(`${getApiUrl()}/admin/apps/${app_key}/icon`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload icon');
      }

      const updatedApp = await response.json();
      setApp(updatedApp);
      setSelectedFile(null);
      setPreviewUrl(updatedApp.icon_url ? getImageUrl(updatedApp.icon_url) : null);
    } catch (err) {
      console.error('Error uploading icon:', err);
      setUploadError(err instanceof Error ? err.message : 'Failed to upload icon');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!app_key) return;

    try {
      const token = await getToken();
      const response = await fetch(`${getApiUrl()}/admin/apps/${app_key}/icon`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove icon');
      }

      const updatedApp = await response.json();
      setApp(updatedApp);
      setPreviewUrl(null);
    } catch (err) {
      console.error('Error removing icon:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove icon');
    }
  };

  const handleInstall = async () => {
    if (!app || selectedAccounts.length === 0) {
      setError('Please select at least one account');
      return;
    }

    try {
      const token = await getToken();
      const accountId = selectedAccounts[0]; // We'll use the first selected account
      
      const response = await fetch(`${getApiUrl()}/admin/accounts/${accountId}/apps/install`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: app.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to install app');
      }

      // Refresh the accounts data to update the UI
      const accountsResponse = await fetch(`${getApiUrl()}/admin/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!accountsResponse.ok) {
        throw new Error('Failed to refresh accounts data');
      }

      const accountsData = await accountsResponse.json();
      const accountsWithApps = await Promise.all(
        accountsData.map(async (account: Account) => {
          const installedAppsResponse = await fetch(
            `${getApiUrl()}/admin/accounts/${account.id}/apps/installed`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          if (installedAppsResponse.ok) {
            const installedApps = await installedAppsResponse.json();
            return {
              ...account,
              installed_apps: installedApps
            };
          }
          return account;
        })
      );

      setAccounts(accountsWithApps);
      setSelectedAccounts([]);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to install app');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">App not found</h3>
      </div>
    );
  }

  const installedAccounts = accounts.filter(account => 
    account.installed_apps?.some(installedApp => installedApp.id === app.id)
  );

  const availableAccounts = accounts.filter(account => 
    !account.installed_apps?.some(installedApp => installedApp.id === app.id)
  );

  return (
    <div className="space-y-6 p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Manage {app.name}</h1>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">App Icon</h3>
          <div className="mt-5">
            <div className="flex items-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={app.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                  <i className={`fas ${app.fa_icon || 'fa-cube'} text-gray-400 text-2xl`}></i>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
              {selectedFile && (
                <button
                  onClick={handleSaveIcon}
                  disabled={isUploading}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Save'}
                </button>
              )}
              {app.icon_url && (
                <button
                  onClick={handleRemoveImage}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove
                </button>
              )}
            </div>
            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">App Details</h3>
          <div className="mt-5 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="py-4">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{app.name}</dd>
              </div>
              <div className="py-4">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{app.description}</dd>
              </div>
              <div className="py-4">
                <dt className="text-sm font-medium text-gray-500">App Key</dt>
                <dd className="mt-1 text-sm text-gray-900">{app.app_key}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Install App</h3>
          <div className="mt-5">
            <select
              id="account"
              name="account"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedAccounts[0] || ''}
              onChange={(e) => setSelectedAccounts([e.target.value])}
            >
              <option value="">Select an account</option>
              {availableAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleInstall}
              disabled={selectedAccounts.length === 0}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Install
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Installed On</h3>
          <div className="mt-5">
            <div className="flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {installedAccounts.map((account) => (
                  <li key={account.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {account.name}
                      </div>
                    </div>
                  </li>
                ))}
                {installedAccounts.length === 0 && (
                  <li className="py-4">
                    <div className="text-sm text-gray-500">
                      Not installed on any accounts
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 