'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import TaskManagerDashboard from '@/components/apps/task-manager/Dashboard';
import useApi from '@/hooks/useApi';

interface Account {
  id: string;
  name: string;
}

export default function AdminAppDashboard() {
  const params = useParams();
  const accountId = params.accountId as string;
  const appKey = params.appKey as string;
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        console.log('Fetching account details for:', accountId);
        const result = await fetchWithAuth<Account>(`/admin/accounts/${accountId}`);
        console.log('Account fetch result:', result);
        if (result.data) {
          setAccount(result.data);
        } else if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error fetching account:', err);
        setError('Failed to load account details');
      } finally {
        setIsLoading(false);
      }
    };

    if (accountId) {
      fetchAccount();
    }
  }, [accountId, fetchWithAuth]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !account) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error || 'Failed to load account'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only render the task manager dashboard for the task_manager app
  if (appKey !== 'task_manager') {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Invalid App</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>This dashboard is not available for the selected app.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {account.name}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Task Manager Dashboard
          </p>
        </div>
      </div>

      <TaskManagerDashboard accountId={accountId} isAdminView={true} />
    </div>
  );
} 