'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useApi from '@/hooks/useApi';
import LoadingSpinner from '@/components/LoadingSpinner';

interface App {
  id: string;
  name: string;
  description: string;
  app_key: string;
  icon_url?: string;
  fa_icon?: string;
}

export default function AccountAppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId');
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    const fetchApps = async () => {
      if (!accountId) {
        setError('No account ID provided');
        setLoading(false);
        return;
      }

      try {
        const result = await fetchWithAuth<App[]>(`/admin/accounts/${accountId}/apps/installed`);
        if (result.data) {
          setApps(result.data);
        } else if (result.error) {
          setError(result.error);
        }
      } catch (error) {
        setError('Failed to fetch apps');
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [accountId, fetchWithAuth]);

  const handleAppClick = (app: App) => {
    router.push(`/account/apps/${app.app_key}/dashboard?accountId=${accountId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
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
        <h1 className="text-2xl font-semibold text-gray-900">Apps</h1>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => router.push(`/account/apps/install?accountId=${accountId}`)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Install New App
          </button>
        </div>
      </div>

      {apps.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No apps installed</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by installing your first app.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <div
              key={app.id}
              onClick={() => handleAppClick(app)}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 cursor-pointer"
            >
              <div className="flex-shrink-0">
                {app.icon_url ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={app.icon_url}
                    alt={app.name}
                  />
                ) : app.fa_icon ? (
                  <i className={`fas ${app.fa_icon} text-2xl text-gray-500`}></i>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl text-gray-500">
                      {app.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{app.name}</p>
                <p className="truncate text-sm text-gray-500">
                  {app.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 