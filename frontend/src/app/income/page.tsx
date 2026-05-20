"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Trash2, Loader2, Wallet, Edit2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function IncomePage() {
  const { user } = useAuth();
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const res = await api.get('/income');
      setSources(res.data);
    } catch (error) {
      toast.error('Failed to load income sources');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;
    
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await api.put(`/income/${editingId}`, {
          name,
          amount: parseFloat(amount),
          frequency
        });
        setSources(sources.map(s => s.id === editingId ? res.data : s));
        toast.success('Income source updated successfully!');
      } else {
        const res = await api.post('/income', {
          name,
          amount: parseFloat(amount),
          frequency
        });
        setSources([res.data, ...sources]);
        toast.success('Income source added successfully!');
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save income source');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (source: any) => {
    setName(source.name);
    setAmount(source.amount.toString());
    setFrequency(source.frequency);
    setEditingId(source.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setName('');
    setAmount('');
    setFrequency('monthly');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this income source?')) return;
    try {
      await api.delete(`/income/${id}`);
      setSources(sources.filter((s) => s.id !== id));
      toast.success('Income source deleted');
    } catch (error) {
      toast.error('Failed to delete income source');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Income Sources</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 hover:shadow-primary-500/50 transition-all"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Income Source
        </button>
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
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Source Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Frequency</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Date Added</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50 bg-transparent">
                {sources.map((s) => (
                  <tr key={s.id} className="hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="flex-shrink-0 p-2 bg-primary-50 dark:bg-primary-500/10 rounded-lg text-primary-600 dark:text-primary-400">
                        <Wallet className="h-5 w-5" />
                      </div>
                      {s.name}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{s.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center rounded-lg bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 border border-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:border-primary-500/20 capitalize">
                        {s.frequency}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
                      {format(new Date(s.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(s)} 
                        className="p-2 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 mr-2"
                        title="Edit Source"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)} 
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Source"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {sources.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                      No income sources added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {editingId ? 'Edit Income Source' : 'Add Income Source'}
            </h2>
            
            <form onSubmit={handleSubmitSource} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Source Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salary, Freelance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Frequency</label>
                <select
                  required
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all appearance-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex justify-center items-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 hover:shadow-primary-500/50 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
