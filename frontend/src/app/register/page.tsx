"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-500/20 dark:bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 dark:bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-xl shadow-primary-500/30">
            <span className="text-white font-bold text-3xl tracking-tighter">ET</span>
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
          Join ExpenseTracker today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 dark:bg-slate-900/80 border border-white/40 dark:border-slate-800/60">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300/50 bg-white/50 px-4 py-3 placeholder-slate-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300/50 bg-white/50 px-4 py-3 placeholder-slate-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300/50 bg-white/50 px-4 py-3 placeholder-slate-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white transition-all duration-300"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-primary-600 to-primary-700 py-3 px-4 text-sm font-bold text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-800 pt-6">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
