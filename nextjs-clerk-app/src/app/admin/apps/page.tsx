'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AdminAppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const result = await fetchWithAuth<App[]>('/admin/apps');
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
  }, [fetchWithAuth]);

  const handleAppClick = (app: App) => {
    router.push(`/admin/apps/${app.app_key}`);
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
      </div>

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
    </div>
  );
} 