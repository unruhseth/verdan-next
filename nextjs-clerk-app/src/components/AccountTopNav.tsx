'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AccountTopNavProps {
  accountId: string;
}

export default function AccountTopNav({ accountId }: AccountTopNavProps) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', href: `/admin/accounts/${accountId}` },
    { name: 'Users', href: `/admin/accounts/${accountId}/users` },
    { name: 'Apps', href: `/admin/accounts/${accountId}/apps` },
    { name: 'Settings', href: `/admin/accounts/${accountId}/settings` }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16">
          <div className="flex">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 