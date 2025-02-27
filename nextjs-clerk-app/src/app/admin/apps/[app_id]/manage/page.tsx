'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface Props {
  params: {
    app_id: string;
  }
}

export default function AppPage({ params }: Props) {
  console.log('=== Component Mount ===');
  const app_id = params.app_id;
  console.log('App ID:', app_id);
  
  const router = useRouter();
  const { getToken, isLoaded: isAuthLoaded, userId } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  
  console.log('Auth State:', { isAuthLoaded, userId });
  console.log('User State:', { isUserLoaded, hasUser: !!user });

  const [app, setApp] = useState<App | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  const fetchData = async () => {
    console.log('=== Starting Data Fetch ===');
    try {
      if (!isAuthLoaded || !isUserLoaded) {
        console.log('Auth or User not loaded yet');
        return;
      }

      if (!userId) {
        console.log('No user ID found, redirecting to sign in');
        router.push('/sign-in');
        return;
      }

      setIsLoading(true);
      const token = await getToken();
      console.log('Got auth token:', !!token);

      // Fetch app details
      console.log('Fetching app details from:', `${getApiUrl()}/admin/apps/${app_id}`);
      const appResponse = await fetch(`${getApiUrl()}/admin/apps/${app_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('App API Response status:', appResponse.status);
      if (!appResponse.ok) {
        throw new Error('Failed to fetch app details');
      }

      const appData = await appResponse.json();
      console.log('Received app data:', appData);
      setApp(appData);

      // Fetch accounts
      console.log('Fetching accounts');
      const accountsResponse = await fetch(`${getApiUrl()}/admin/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Accounts API Response status:', accountsResponse.status);
      if (!accountsResponse.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const accountsData = await accountsResponse.json();
      console.log('Received accounts data:', accountsData);

      // Fetch installed apps for each account
      const accountsWithInstallStatus = await Promise.all(
        accountsData.map(async (account: Account) => {
          console.log(`Fetching installed apps for account ${account.id}`);
          const installedAppsResponse = await fetch(
            `${getApiUrl()}/admin/accounts/${account.id}/apps/installed`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            }
          );

          if (installedAppsResponse.ok) {
            const installedApps = await installedAppsResponse.json();
            console.log(`Account ${account.id} installed apps:`, installedApps);
            return {
              ...account,
              installed_apps: installedApps
            };
          }

          console.log(`Failed to fetch installed apps for account ${account.id}`);
          return account;
        })
      );

      setAccounts(accountsWithInstallStatus);
      setPreviewUrl(appData.icon_url ? getImageUrl(appData.icon_url) : null);
      setError(null);
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      console.log('=== Finished Data Fetch ===');
    }
  };

  useEffect(() => {
    fetchData();
  }, [app_id, getToken, isAuthLoaded, isUserLoaded, userId, router]);

  console.log('Current render state:', { 
    isLoading, 
    error, 
    hasApp: !!app, 
    accountsCount: accounts.length 
  });

  if (!isAuthLoaded || !isUserLoaded) {
    console.log('Rendering initial loading state');
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!userId) {
    console.log('No user ID, should redirect');
    return null;
  }

  if (isLoading) {
    console.log('Rendering data loading state');
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    console.log('Rendering error state:', error);
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!app) {
    console.log('Rendering app not found state');
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">App not found</h3>
        </div>
      </div>
    );
  }

  console.log('Rendering main app content');

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
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveIcon = async () => {
    if (!selectedFile || !app_id) return;

    try {
      setIsUploading(true);
      setUploadError(null);

      const token = await getToken();
      const formData = new FormData();
      formData.append('icon', selectedFile);

      const response = await fetch(`${getApiUrl()}/admin/apps/${app_id}/icon`, {
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
    if (!app_id) return;

    try {
      const token = await getToken();
      const response = await fetch(`${getApiUrl()}/admin/apps/${app_id}/icon`, {
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

  const handleInstall = async (accountId: string) => {
    try {
      setIsInstalling(true);
      const token = await getToken();

      const response = await fetch(`${getApiUrl()}/admin/accounts/${accountId}/apps/install`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          app_id: app?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to install app');
      }

      // Refresh the data to update the UI
      await fetchData();
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to install app');
    } finally {
      setIsInstalling(false);
    }
  };

  const handleUninstall = async (accountId: string) => {
    if (!app) return;

    try {
      const token = await getToken();
      const response = await fetch(`${getApiUrl()}/admin/accounts/${accountId}/apps/uninstall`, {
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
        throw new Error('Failed to uninstall app');
      }

      // Update the accounts list to reflect the change
      setAccounts(accounts.map(account => {
        if (account.id === accountId) {
          return {
            ...account,
            installed_apps: account.installed_apps?.filter(installedApp => installedApp.id !== app.id)
          };
        }
        return account;
      }));
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to uninstall app');
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* App Details Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">App Details</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{app.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-sm text-gray-900">{app.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">App Key</label>
              <p className="mt-1 text-sm text-gray-900">{app.app_key}</p>
            </div>
          </div>
        </div>

        {/* Icon Management Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">App Icon</h3>
          <div className="mt-4 flex items-start space-x-4">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="App icon"
                  className="h-32 w-32 object-cover rounded-lg"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
                >
                  <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="icon-upload"
              />
              <label
                htmlFor="icon-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                Choose Icon
              </label>
              {selectedFile && (
                <button
                  onClick={handleSaveIcon}
                  disabled={isUploading}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isUploading ? 'Uploading...' : 'Save Icon'}
                </button>
              )}
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">{uploadError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Installation Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Install App</h3>
          <div className="mt-4">
            <div className="space-y-4">
              {accounts.map((account) => {
                const isInstalled = account.installed_apps?.some(
                  installedApp => installedApp.id === app_id
                );

                return (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{account.name}</h4>
                      {isInstalled && (
                        <p className="text-xs text-gray-500 mt-1">
                          App is currently installed
                        </p>
                      )}
                    </div>
                    <div>
                      {isInstalled ? (
                        <button
                          onClick={() => handleUninstall(account.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Uninstall
                        </button>
                      ) : (
                        <button
                          onClick={() => handleInstall(account.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Install
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {accounts.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">No accounts available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 