
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, Sun, Moon, Monitor, Type, Loader2 } from 'lucide-react';
import { useNitorStore } from '../../store/useNitorStore';

const appearanceSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  fontSize: z.number().min(12).max(24),
  latexRendering: z.enum(['always', 'click', 'source']),
});

type AppearanceFormValues = z.infer<typeof appearanceSchema>;

export const AppearanceTab: React.FC = () => {
  const { addToast, theme, setTheme } = useNitorStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: theme || 'system',
      fontSize: 16,
      latexRendering: 'always',
    }
  });

  const currentTheme = watch('theme');
  const currentFontSize = watch('fontSize');

  const onSubmit = (data: AppearanceFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Appearance Settings:', data);
      setTheme(data.theme);
      addToast('Appearance updated successfully', 'success');
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-300 space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Appearance</h2>
        <p className="text-slate-500 dark:text-slate-400">Customize your reading and writing experience.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Theme Selection */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
               <Eye className="w-5 h-5 text-indigo-600" /> Theme
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
                <label className={`
                    cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all
                    ${currentTheme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}
                `}>
                    <input {...register('theme')} type="radio" value="light" className="sr-only" />
                    <Sun className="w-6 h-6" />
                    <span className="text-sm font-medium">Light</span>
                </label>

                <label className={`
                    cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all
                    ${currentTheme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}
                `}>
                    <input {...register('theme')} type="radio" value="dark" className="sr-only" />
                    <Moon className="w-6 h-6" />
                    <span className="text-sm font-medium">Dark</span>
                </label>

                <label className={`
                    cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all
                    ${currentTheme === 'system' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}
                `}>
                    <input {...register('theme')} type="radio" value="system" className="sr-only" />
                    <Monitor className="w-6 h-6" />
                    <span className="text-sm font-medium">System</span>
                </label>
            </div>
        </div>

        {/* Font Size */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
               <Type className="w-5 h-5 text-indigo-600" /> Reading Experience
            </h3>
            
            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Font Size</span>
                    <span className="text-sm text-slate-500">{currentFontSize}px</span>
                </div>
                <input 
                    type="range" 
                    min={12} 
                    max={24} 
                    step={1}
                    {...register('fontSize', { valueAsNumber: true })}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="font-serif leading-relaxed" style={{ fontSize: `${currentFontSize}px` }}>
                        The quick brown fox jumps over the lazy dog. Science is the poetry of reality.
                    </p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">LaTeX Rendering Strategy</label>
                <select 
                    {...register('latexRendering')}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="always">Always Render (Recommended)</option>
                    <option value="click">Click to Render (Save Data)</option>
                    <option value="source">Show Plain LaTeX Source</option>
                </select>
            </div>
        </div>

        <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-slate-900 dark:bg-slate-700 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
            >
               {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
               Update Appearance
            </button>
        </div>

      </form>
    </div>
  );
};
