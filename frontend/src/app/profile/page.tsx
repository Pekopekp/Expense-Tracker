"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, User as UserIcon, Lock } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  
  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', { name, email });
      updateUser(res.data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword
      });
      toast.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Profile Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Personal Information */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60 p-6 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-shrink-0 p-2 bg-primary-50 dark:bg-primary-500/10 rounded-lg text-primary-600 dark:text-primary-400">
              <UserIcon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Personal Info</h2>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full flex justify-center items-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 hover:shadow-primary-500/50 transition-all disabled:opacity-50"
              >
                {savingProfile ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60 p-6 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-shrink-0 p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-400">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security</h2>
          </div>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full flex justify-center items-center rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/30 hover:-translate-y-0.5 hover:shadow-rose-500/50 transition-all disabled:opacity-50"
              >
                {savingPassword ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
