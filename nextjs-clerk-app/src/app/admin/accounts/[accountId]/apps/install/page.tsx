'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import LoadingSpinner from '@/components/LoadingSpinner';
import AppCard from '@/components/AppCard';
import { getApiUrl } from '@/utils/urls';

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
}

export default function InstallAppsPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params.accountId as string;
  const { getToken } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [installing, setInstalling] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getToken();
        const [appsResponse, installedResponse] = await Promise.all([
          fetch(`${getApiUrl()}/admin/apps`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }),
          fetch(`${getApiUrl()}/admin/accounts/${accountId}/apps/installed`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          })
        ]);

        if (!appsResponse.ok || !installedResponse.ok) {
          throw new Error('Failed to fetch apps');
        }

        const [appsData, installedData] = await Promise.all([
          appsResponse.json(),
          installedResponse.json()
        ]);

        setApps(appsData);
        setInstalledApps(installedData.map((app: App) => app.app_key));
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [accountId, getToken]);

  const handleInstall = async (app_key: string) => {
    try {
      setInstalling(app_key);
      const token = await getToken();
      const response = await fetch(`${getApiUrl()}/admin/accounts/${accountId}/apps/${app_key}/install`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to install app');
      }

      router.push(`/admin/accounts/${accountId}/apps`);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to install app');
    } finally {
      setInstalling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
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

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Install Apps</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => {
          const isInstalled = installedApps.includes(app.app_key);
          const isInstalling = installing === app.app_key;

          return (
            <div key={app.id} className="relative">
              <AppCard
                name={app.name}
                description={app.description}
                iconUrl={app.icon_url}
                faIcon={app.fa_icon}
                className="h-full"
              />
              <div className="absolute bottom-4 inset-x-0 flex justify-center">
                {isInstalled ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Installed
                  </span>
                ) : (
                  <button
                    onClick={() => handleInstall(app.app_key)}
                    disabled={isInstalling}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                  >
                    {isInstalling ? (
                      <>
                        <LoadingSpinner className="h-4 w-4 mr-2" />
                        Installing...
                      </>
                    ) : (
                      'Install'
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 