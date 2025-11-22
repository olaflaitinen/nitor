import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Key, Smartphone, AlertTriangle, Trash2, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { useNitorStore } from '../../store/useNitorStore';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const AccountTab: React.FC = () => {
  const { user, addToast, logout } = useNitorStore();
  const [isLoading, setIsLoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const onPasswordSubmit = (data: PasswordFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      reset();
      addToast('Password updated successfully', 'success');
    }, 1500);
  };

  const handleDeleteAccount = () => {
    if (!user) return;
    if (deleteInput === user.handle) {
      setIsLoading(true);
      setTimeout(() => {
          addToast('Account deleted.', 'success');
          logout();
      }, 1000);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-300 space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account & Security</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your credentials and account access.</p>
      </div>

      {/* Email Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
             <Shield className="w-5 h-5 text-indigo-600" /> Credentials
          </h3>
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                   <Lock className="w-4 h-4" />
                   {/* Mock email since it's not in user object, usually stored in auth session */}
                   <span>{user?.name.toLowerCase().replace(/\s/g, '.')}@university.edu</span> 
                   <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Verified</span>
                </div>
             </div>
          </div>
      </div>

      {/* Password Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
             <Key className="w-5 h-5 text-indigo-600" /> Change Password
          </h3>
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                <input 
                    type={showPassword ? "text" : "password"}
                    {...register('currentPassword')}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>}
             </div>
             <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                    <input 
                        type={showPassword ? "text" : "password"}
                        {...register('newPassword')}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                    <input 
                        type={showPassword ? "text" : "password"}
                        {...register('confirmPassword')}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                </div>
             </div>
             
             <div className="flex items-center justify-between pt-2">
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                     {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                 </button>
                 <button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                 >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Password
                 </button>
             </div>
          </form>
      </div>

      {/* 2FA Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                 <Smartphone className="w-5 h-5 text-indigo-600" /> Two-Factor Authentication
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Secure your account with an authenticator app.</p>
          </div>
          <button 
            onClick={() => { setIs2FAEnabled(!is2FAEnabled); addToast(is2FAEnabled ? '2FA Disabled' : '2FA Enabled', 'success'); }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${is2FAEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${is2FAEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-950/10 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
          <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
             <AlertTriangle className="w-5 h-5" /> Danger Zone
          </h3>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between pb-4 border-b border-red-100 dark:border-red-900/30">
                 <div>
                    <p className="font-medium text-slate-900 dark:text-slate-200">Deactivate Account</p>
                    <p className="text-sm text-slate-500">Hide your profile and content without deleting data.</p>
                 </div>
                 <button 
                    onClick={() => addToast('Account deactivated', 'success')}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                 >
                    Deactivate
                 </button>
             </div>

             {!showDeleteConfirm ? (
                 <div className="flex items-center justify-between">
                     <div>
                        <p className="font-medium text-slate-900 dark:text-slate-200">Delete Account</p>
                        <p className="text-sm text-slate-500">Permanently remove your account and all data.</p>
                     </div>
                     <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-colors"
                     >
                        Delete Account
                     </button>
                 </div>
             ) : (
                 <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-red-100 dark:border-red-900/30 animate-in fade-in slide-in-from-top-2">
                     <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Are you absolutely sure?</p>
                     <p className="text-xs text-slate-500 mb-3">This action cannot be undone. Type <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{user?.handle}</span> to confirm.</p>
                     
                     <div className="flex gap-2">
                        <input 
                            type="text"
                            value={deleteInput}
                            onChange={(e) => setDeleteInput(e.target.value)}
                            placeholder={user?.handle}
                            className="flex-1 p-2 rounded border border-slate-300 dark:border-slate-700 text-sm outline-none focus:border-red-500 dark:bg-slate-800 dark:text-white"
                        />
                        <button 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-3 py-2 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDeleteAccount}
                            disabled={deleteInput !== user?.handle || isLoading}
                            className="px-3 py-2 bg-red-600 text-white font-bold text-sm rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                            <Trash2 className="w-3 h-3" /> Confirm Delete
                        </button>
                     </div>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};