'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import LoadingSpinner from '@/components/LoadingSpinner';
import TaskManagerDashboard from '@/components/apps/task-manager/Dashboard';

export default function AppDashboardPage() {
  const params = useParams();
  const app_key = params.app_key as string;
  const accountId = params.accountId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();

        // Verify access to this account
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to verify account access');
        }

        const userData = await response.json();
        if (userData.account_id !== accountId) {
          throw new Error('You do not have access to this account');
        }

        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccess();
  }, [getToken, accountId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
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

  // Only render the task manager dashboard for the task_manager app
  if (app_key !== 'task_manager') {
    return (
      <div className="p-6">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskManagerDashboard accountId={accountId} isAdminView={false} />
    </div>
  );
} 