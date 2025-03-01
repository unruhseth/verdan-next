'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import LoadingSpinner from '@/components/LoadingSpinner';
import TaskManagerDashboard from '@/components/apps/task-manager/Dashboard';

interface Props {
  params: {
    accountId: string;
    app_key: string;
  }
}

export default function AppDashboardPage({ params }: Props) {
  const app_key = params.app_key as string;
  const accountId = params.accountId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/${accountId}/verify-access`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to verify account access');
        }

        const data = await response.json();
        setHasAccess(data.hasAccess);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (accountId) {
      verifyAccess();
    }
  }, [accountId, getToken]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!hasAccess) {
    return <div>You do not have access to this account</div>;
  }

  if (app_key !== 'task_manager') {
    return <div>Invalid app key</div>;
  }

  return <TaskManagerDashboard accountId={accountId} />;
} 