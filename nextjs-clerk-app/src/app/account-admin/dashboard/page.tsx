'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import LoadingSpinner from '@/components/LoadingSpinner';

interface DashboardStats {
  totalUsers: number;
  totalApps: number;
}

export default function AccountAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalApps: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [getToken]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Account Dashboard</h1>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Welcome to your dashboard</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Dashboard statistics will be available here soon.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Account Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{stats.totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Installed Apps</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{stats.totalApps}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">App Widgets Coming Soon</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>This space will be populated with widgets from your installed apps.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 