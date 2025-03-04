'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-bold text-gray-800">
            Verdan Admin
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>

        <nav className="space-y-1">
          <Link
            href="/admin/dashboard"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              pathname.includes('/admin/dashboard')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-home mr-3 w-4 h-4" />
            Dashboard
          </Link>

          <Link
            href="/admin/accounts"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              pathname.includes('/admin/accounts')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-building mr-3 w-4 h-4" />
            Accounts
          </Link>

          <Link
            href="/admin/apps"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              pathname.includes('/admin/apps')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-cube mr-3 w-4 h-4" />
            Apps
          </Link>
        </nav>
      </div>
    </div>
  );
} 