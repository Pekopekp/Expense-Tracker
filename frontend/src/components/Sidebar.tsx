"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Wallet, User, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Income', href: '/income', icon: Wallet },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Add Transaction', href: '/transactions/add', icon: PlusCircle },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="flex h-full w-full flex-col bg-slate-900 dark:bg-slate-950/80 dark:backdrop-blur-2xl text-white transition-all duration-300 border-r border-slate-800 shadow-2xl z-50 relative">
      <div className="flex h-20 items-center px-8 font-bold text-2xl border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
            Tracker
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-2 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-600/10 text-primary-400 border border-primary-500/20 shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <item.icon
                  className={`mr-4 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-primary-300'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-slate-800/80 p-4 bg-slate-900/50">
        <button
          onClick={logout}
          className="group flex w-full items-center rounded-xl px-4 py-3.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300"
        >
          <LogOut className="mr-4 h-5 w-5 flex-shrink-0 text-slate-500 group-hover:text-red-400 transition-transform duration-300 group-hover:scale-110" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
