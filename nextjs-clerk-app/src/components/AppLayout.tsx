'use client';

import { useState } from 'react';
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from '@/hooks/useAuth';
import { Role } from '@/config/roles';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CubeIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userRole, isRoleAtLeast } = useAuth();
  const isHighLevelAdmin = isRoleAtLeast('org:master_admin');

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Accounts', href: '/admin/accounts', icon: BuildingOfficeIcon },
    { name: 'Apps', href: '/admin/apps', icon: CubeIcon },
  ];

  return (
    <div>
      {/* Mobile sidebar */}
      <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true">
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-0 flex">
              <div className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
                {/* Sidebar component for mobile */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link href={isHighLevelAdmin ? "/admin" : "/dashboard"} className="text-xl font-bold">
                      {isHighLevelAdmin ? "Verdan Admin" : "Verdan"}
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={`
                                  group flex gap-x-3 rounded-md p-2 text-sm font-semibold
                                  ${pathname === item.href 
                                    ? 'bg-gray-100 text-indigo-600' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                  }
                                `}
                              >
                                <item.icon 
                                  className={`h-6 w-6 shrink-0 ${
                                    pathname === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                                  }`} 
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href={isHighLevelAdmin ? "/admin" : "/dashboard"} className="text-xl font-bold">
              {isHighLevelAdmin ? "Verdan Admin" : "Verdan"}
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm font-semibold
                          ${pathname === item.href 
                            ? 'bg-gray-100 text-indigo-600' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                          }
                        `}
                      >
                        <item.icon 
                          className={`h-6 w-6 shrink-0 ${
                            pathname === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                          }`} 
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <UserButton afterSignOutUrl="/" />
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}