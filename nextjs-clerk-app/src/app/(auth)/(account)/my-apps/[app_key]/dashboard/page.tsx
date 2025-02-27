'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import LoadingSpinner from '@/components/LoadingSpinner';
import TaskManagerDashboard from '@/components/apps/task-manager/Dashboard';

interface Props {
  params: {
    app_key: string;
  }
}

export default function AppDashboardPage({ params }: Props) {
  const app_key = params.app_key as string;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchAccountId = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/${app_key}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch app information');
        }

        const data = await response.json();
        setAccountId(data.account_id);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (app_key) {
      fetchAccountId();
    }
  }, [app_key, getToken]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!accountId) {
    return <div>App not found</div>;
  }

  if (app_key !== 'task_manager') {
    return <div>Invalid app key</div>;
  }

  return <TaskManagerDashboard accountId={accountId} />;
} 