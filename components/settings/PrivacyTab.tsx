
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Eye, Download, Loader2, Globe } from 'lucide-react';
import { useNitorStore } from '../../store/useNitorStore';

const privacySchema = z.object({
  visibility: z.enum(['public', 'followers', 'private']),
  allowIndexing: z.boolean(),
  dataUsage: z.boolean(),
});

type PrivacyFormValues = z.infer<typeof privacySchema>;

export const PrivacyTab: React.FC = () => {
  const { addToast, user } = useNitorStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { register, handleSubmit, formState: { isDirty } } = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      visibility: 'public',
      allowIndexing: true,
      dataUsage: false,
    }
  });

  const onSubmit = (data: PrivacyFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Privacy Settings:', data);
      addToast('Privacy settings updated', 'success');
      setIsLoading(false);
    }, 800);
  };

  const handleExportData = () => {
    setIsExporting(true);
    
    // Simulate backend processing time to gather data
    setTimeout(() => {
      try {
        // 1. Construct the data object
        const dataToExport = {
            meta: {
                version: "1.0",
                exportedAt: new Date().toISOString(),
                platform: "NITOR Academic Network"
            },
            userProfile: user || "Guest",
            settings: {
                // In a real app, we would grab current form values or state
                visibility: "public", 
                allowIndexing: true
            },
            content: {
                posts: 0,
                articles: 0,
                comments: 0
            },
            message: "This is a complete archive of your personal data held by Nitor."
        };

        // 2. Create a Blob from the JSON
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // 3. Create a download link and trigger it
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nitor_archive_${user?.handle?.replace('@', '') || 'user'}_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        
        // 4. Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addToast('Data export downloaded successfully', 'success');
      } catch (error) {
        addToast('Failed to generate export', 'error');
      } finally {
        setIsExporting(false);
      }
    }, 2000);
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-300 space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Privacy & Data</h2>
        <p className="text-slate-500 dark:text-slate-400">Control who sees your research and how your data is handled.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Profile Visibility */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
               <Eye className="w-5 h-5 text-indigo-600" /> Profile Visibility
            </h3>
            
            <div className="space-y-4">
               <div className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <input 
                    {...register('visibility')} 
                    type="radio" 
                    value="public" 
                    id="vis-public" 
                    className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <label htmlFor="vis-public" className="cursor-pointer">
                      <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">Public (Recommended)</span>
                      <span className="block text-xs text-slate-500">Visible to everyone. Eligible for Nitor Score calculation and global discovery.</span>
                  </label>
               </div>

               <div className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <input 
                    {...register('visibility')} 
                    type="radio" 
                    value="followers" 
                    id="vis-followers" 
                    className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <label htmlFor="vis-followers" className="cursor-pointer">
                      <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">Followers Only</span>
                      <span className="block text-xs text-slate-500">Only approved followers can see your publications and activity.</span>
                  </label>
               </div>

               <div className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <input 
                    {...register('visibility')} 
                    type="radio" 
                    value="private" 
                    id="vis-private" 
                    className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <label htmlFor="vis-private" className="cursor-pointer">
                      <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">Private (Stealth Mode)</span>
                      <span className="block text-xs text-slate-500">Hidden from everyone. Use this when preparing sensitive patents.</span>
                  </label>
               </div>
            </div>
        </div>

        {/* Search Engines */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
               <Globe className="w-5 h-5 text-indigo-600" /> Search & Discovery
            </h3>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Search Engine Indexing</p>
                    <p className="text-xs text-slate-500">Allow Google Scholar and other engines to index your public articles.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" {...register('allowIndexing')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                </label>
            </div>
        </div>

        {/* Data Export */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
               <Download className="w-5 h-5 text-indigo-600" /> Data Portability
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Download a JSON archive of all your posts, articles, and interaction history. This process may take a few minutes.
            </p>
            <button 
                type="button"
                onClick={handleExportData}
                disabled={isExporting}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 disabled:opacity-50 transition-all"
            >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isExporting ? 'Preparing JSON Archive...' : 'Download My Data (JSON)'}
            </button>
        </div>

        <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isLoading || !isDirty}
              className="bg-slate-900 dark:bg-slate-700 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
               {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
               Save Privacy Settings
            </button>
        </div>

      </form>
    </div>
  );
};
