"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { Loader2, Search, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Transactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let url = '/transactions/?limit=100';
      if (categoryFilter) url += `&category=${categoryFilter}`;
      if (typeFilter) url += `&type=${typeFilter}`;
      
      const response = await api.get(url);
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [categoryFilter, typeFilter]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        toast.success('Transaction deleted');
        fetchTransactions();
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Transactions</h1>
      </div>

      <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60 p-6 relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category Filter</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search categories..."
                className="block w-full rounded-xl border border-slate-300/50 bg-white/50 pl-10 pr-4 py-2.5 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 sm:text-sm dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-white transition-all duration-300 focus:outline-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Transaction Type</label>
            <select
              className="block w-full rounded-xl border border-slate-300/50 bg-white/50 px-4 py-2.5 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 sm:text-sm dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-white transition-all duration-300 focus:outline-none appearance-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60 overflow-hidden relative z-10">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-800/50">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Amount</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50 bg-transparent">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
                      {format(new Date(t.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                      {t.title}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center rounded-lg bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 border border-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:border-primary-500/20">
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm font-bold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => router.push(`/transactions/edit/${t.id}`)} 
                        className="p-2 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 mr-2"
                        title="Edit Transaction"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)} 
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Transaction"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                      No transactions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
