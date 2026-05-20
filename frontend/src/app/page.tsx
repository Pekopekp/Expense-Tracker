"use client";

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowRight, PieChart, ShieldCheck, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-primary-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Expense Tracker
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <button 
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-sm font-bold text-white shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 hover:shadow-primary-500/50 transition-all"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors hidden sm:block">
                  Sign In
                </Link>
                <Link href="/register" className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-400/20 dark:bg-primary-500/10 blur-3xl" />
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Take Control of Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">Financial Future.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Track your income, manage expenses, and visualize your wealth in real-time with our beautifully designed premium dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-lg font-bold text-white shadow-xl shadow-primary-500/30 hover:-translate-y-1 hover:shadow-primary-500/50 transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <Link 
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-lg font-bold text-white shadow-xl shadow-primary-500/30 hover:-translate-y-1 hover:shadow-primary-500/50 transition-all flex items-center justify-center gap-2"
              >
                Start for Free <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Everything you need to succeed</h2>
            <p className="text-slate-600 dark:text-slate-400">Simple, powerful, and built for your everyday life.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Tracking</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Log your daily expenses and recurring monthly income. The dashboard automatically calculates your exact monthly equivalents.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <PieChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Beautiful Analytics</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Visualize your spending habits with stunning, interactive charts. Understand exactly where your money goes every month.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bank-Grade Security</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your data is securely hashed and stored. With our robust architecture, your financial information remains private and safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-500 dark:text-slate-400 border-t border-slate-200/50 dark:border-slate-800/50">
        <p>© {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
      </footer>

    </div>
  );
}
