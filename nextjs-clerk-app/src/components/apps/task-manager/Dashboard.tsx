'use client';

import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';
import useAuth from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'COMPLETED';
  created_at: string;
}

interface Props {
  accountId: string;
  isAdminView?: boolean;
}

export default function TaskManagerDashboard({ accountId, isAdminView = false }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchWithAuth } = useApi();
  const { userRole } = useAuth();

  useEffect(() => {
    loadTasks();
  }, [accountId]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const result = await fetchWithAuth<{ data: Task[] }>(`/api/apps/task-manager/${accountId}/tasks`);
      
      if (result.data?.data) {
        setTasks(result.data.data);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const result = await fetchWithAuth<{ data: { task: Task } }>('/api/apps/task-manager/tasks', {
        method: 'POST',
        body: JSON.stringify({
          account_id: accountId,
          title: newTask.title,
          description: newTask.description,
        }),
      });

      if (result?.data?.data?.task) {
        setTasks(prev => [...prev, result.data.data.task]);
        setNewTask({ title: '', description: '' });
      } else if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to create task');
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setError(null);
      const result = await fetchWithAuth<{ message: string }>(`/api/apps/task-manager/tasks/${taskId}`, {
        method: 'DELETE',
        body: JSON.stringify({
          account_id: accountId,
        }),
      });

      if (result.data?.message) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      } else if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: 'PENDING' | 'COMPLETED') => {
    try {
      setError(null);
      const result = await fetchWithAuth<{ data: { task: Task } }>(`/api/apps/task-manager/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          account_id: accountId,
          status: newStatus,
        }),
      });

      if (result.data?.data?.task) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? result.data.data.task : task
        ));
      } else if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to update task status');
      console.error('Error updating task status:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Task Manager</h1>
        {isAdminView && (
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => loadTasks()}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Refresh Tasks
            </button>
          </div>
        )}
      </div>

      {error && (
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
      )}

      <form onSubmit={handleCreateTask} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Task Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="submit"
            disabled={isSubmitting || !newTask.title}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <ul role="list" className="divide-y divide-gray-100">
          {[...tasks].reverse().map((task) => (
            <li key={task.id} className="flex items-center justify-between gap-x-6 py-5 px-5">
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-sm font-semibold leading-6 text-gray-900">{task.title}</p>
                  <p className={`rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    task.status === 'COMPLETED' 
                      ? 'text-green-700 bg-green-50 ring-green-600/20' 
                      : 'text-gray-600 bg-gray-50 ring-gray-500/10'
                  }`}>
                    {task.status}
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  <p className="whitespace-nowrap">{task.description}</p>
                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <p className="truncate">Created {new Date(task.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <button
                  onClick={() => handleUpdateStatus(task.id, task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED')}
                  className={`rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ${
                    task.status === 'COMPLETED'
                      ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  {task.status === 'COMPLETED' ? 'Mark Pending' : 'Mark Complete'}
                </button>
                {isAdminView && (
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 