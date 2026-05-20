"use client";

import { useAuth } from '@/context/AuthContext';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-white/70 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 lg:px-10 dark:bg-slate-900/70 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <div className="flex items-center">
        <button
          type="button"
          className="text-gray-500 hover:text-primary-600 lg:hidden dark:text-gray-400 dark:hover:text-primary-400 transition-colors bg-gray-100 dark:bg-slate-800 p-2 rounded-lg"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="flex items-center gap-5">
        <div className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">
          Welcome, <span className="font-semibold text-primary-600 dark:text-primary-400">{user?.name || 'User'}</span>
        </div>
        <div 
          onClick={() => router.push('/profile')}
          className="group h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30 cursor-pointer hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all duration-300 ring-2 ring-white dark:ring-slate-800"
          title="Go to Profile"
        >
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
