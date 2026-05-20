"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-transparent transition-colors duration-300">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="relative flex w-72 max-w-xs flex-1 flex-col bg-slate-900">
            <div className="absolute top-0 right-0 -mr-12 pt-4 pr-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 bg-slate-800/50 hover:bg-slate-700 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:w-72">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
