'use client';

import { useEffect, useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import { getApiUrl } from '@/utils/urls';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';

interface Account {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const { getToken } = useAuth();

  const createNewAccount = async () => {
    if (!accountName.trim()) {
      setError('Account name is required');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${getApiUrl()}/accounts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: accountName
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to create account';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      await response.json();
      setAccountName('');
      setShowModal(false);
      fetchAccounts();
    } catch (err) {
      console.error('Error in account creation process:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsCreating(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${getApiUrl()}/admin/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 403) {
        setError('You do not have permission to view accounts. Please contact your administrator.');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      
      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`${getApiUrl()}/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      setAccounts(accounts.filter(account => account.id !== accountId));
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    }
  };

  const updateAccount = async (accountId: string, newName: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${getApiUrl()}/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update account');
      }

      const updatedAccount = await response.json();
      setAccounts(accounts.map(account => 
        account.id === accountId ? updatedAccount : account
      ));
      setEditingAccount(null);
    } catch (err) {
      console.error('Error updating account:', err);
      setError(err instanceof Error ? err.message : 'Failed to update account');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [getToken]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Account
          </button>
        </div>
      </div>

      {error && (
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
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {editingAccount?.id === account.id ? (
                    <input
                      type="text"
                      value={editingAccount.name}
                      onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                      onBlur={() => updateAccount(account.id, editingAccount.name)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <span onClick={() => setEditingAccount(account)} className="cursor-pointer hover:text-indigo-600">
                      {account.name}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(account.created_at), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => deleteAccount(account.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Account</h3>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Account name"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={createNewAccount}
                disabled={isCreating}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 