import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AccountLayoutProps {
  children: ReactNode;
  accountId: string;
  accountName: string;
}

export default function AccountLayout({ children, accountId, accountName }: AccountLayoutProps) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Dashboard', href: `/admin/accounts/${accountId}` },
    { name: 'Users', href: `/admin/accounts/${accountId}/users` },
    { name: 'Apps', href: `/admin/accounts/${accountId}/apps` },
    { name: 'Settings', href: `/admin/accounts/${accountId}/settings` },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-semibold text-gray-900">{accountName}</h1>
            <p className="mt-1 text-sm text-gray-500">Account ID: {accountId}</p>
          </div>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`
                    whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                    ${pathname === tab.href
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="mt-8 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
} 