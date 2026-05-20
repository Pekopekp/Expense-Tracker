"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { Loader2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/transactions/summary');
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];
  
  const pieData = summary?.expense_by_category 
    ? Object.keys(summary.expense_by_category).map((key) => ({
        name: key,
        value: summary.expense_by_category[key]
      }))
    : [];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
        <div className="text-sm font-medium text-slate-500 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
          {format(new Date(), 'MMMM d, yyyy')}
        </div>
      </div>
      
      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="group overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg shadow-primary-100/20 dark:bg-slate-900/60 dark:shadow-none border border-white/40 dark:border-slate-800/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-200/40 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-primary-50 dark:bg-primary-500/10 rounded-xl">
                <DollarSign className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-semibold text-slate-500 dark:text-slate-400">Total Balance</dt>
                  <dd className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₹{summary?.remaining_balance?.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="group overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg shadow-emerald-100/20 dark:bg-slate-900/60 dark:shadow-none border border-white/40 dark:border-slate-800/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-200/40 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-semibold text-slate-500 dark:text-slate-400">Total Income</dt>
                  <dd className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹{summary?.total_income?.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="group overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg shadow-red-100/20 dark:bg-slate-900/60 dark:shadow-none border border-white/40 dark:border-slate-800/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-200/40 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-red-50 dark:bg-red-500/10 rounded-xl">
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-semibold text-slate-500 dark:text-slate-400">Total Expense</dt>
                  <dd className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">₹{summary?.total_expense?.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Chart */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Expense by Category</h2>
          <div className="flex-1 min-h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${value}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255,255,255,0.9)' }} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: 500 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                No expense data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
            <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
              View All
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ul className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {summary?.recent_transactions?.map((transaction: any) => (
                <li key={transaction.id} className="py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-xl px-2 transition-colors -mx-2">
                  <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{transaction.title}</p>
                      <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')} <span className="mx-1">•</span> 
                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300">
                          {transaction.category}
                        </span>
                      </p>
                    </div>
                    <div className={`text-base font-bold ${
                      transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
              {summary?.recent_transactions?.length === 0 && (
                <li className="py-8 text-center text-slate-500 font-medium">No recent transactions</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
