"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

export default function AddTransaction() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Phone Recharge',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/transactions/', {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      toast.success('Transaction added successfully');
      router.push('/transactions');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Add New Transaction</h1>

      <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60 p-6 sm:p-8 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
                placeholder="E.g. Groceries"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className={`font-bold ${formData.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {formData.type === 'income' ? '+' : '-'}₹
                  </span>
                </div>
                <input
                  type="number"
                  name="amount"
                  required
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Type</label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all appearance-none"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all appearance-none"
              >
                <option value="Phone Recharge">Phone Recharge</option>
                <option value="Wifi Bill">Wifi Bill</option>
                <option value="Electricity bill">Electricity bill</option>
                <option value="Rent">Rent</option>
                <option value="Grocery">Grocery</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Extra">Extra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description (Optional)</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center items-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 hover:shadow-primary-500/50 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
