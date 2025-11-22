
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Building2, CheckCircle, ArrowRight, GraduationCap, Loader2 } from 'lucide-react';
import { useNitorStore } from '../store/useNitorStore';
import { supabase } from '../lib/supabase';
import { AvatarUploader } from './ui/AvatarUploader';
import confetti from 'canvas-confetti';

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  handle: z.string().min(3, "Handle is too short").startsWith('@', "Handle must start with @"),
  institution: z.string().min(2, "Institution is required"),
  role: z.string().min(2, "Academic role is required"),
  discipline: z.string().min(2, "Primary discipline is required"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface OnboardingPageProps {
    onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const { updateUser, user, addToast } = useNitorStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const { register, handleSubmit, formState: { errors } } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
        fullName: user?.name || '',
        handle: user?.handle || '@',
        institution: '',
        role: '',
        discipline: '',
    }
  });

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsLoading(true);
    
    try {
        // Real DB Update
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: data.fullName,
                handle: data.handle,
                institution: data.institution,
                academic_title: data.role,
                bio: `${data.role} at ${data.institution}. Researching ${data.discipline}.`,
                avatar_url: avatarUrl || user?.avatarUrl || `https://ui-avatars.com/api/?name=${data.fullName}&background=6366f1&color=fff`,
                updated_at: new Date().toISOString(),
                onboarding_complete: true // IMPORTANT: This flag enables access to the feed
            })
            .eq('id', user?.id);

        if (error) throw error;

        // Update Local State
        updateUser({
            name: data.fullName,
            handle: data.handle,
            institution: data.institution,
            role: data.role,
            avatarUrl: avatarUrl || user?.avatarUrl || `https://ui-avatars.com/api/?name=${data.fullName}&background=6366f1&color=fff`,
            bio: `${data.role} at ${data.institution}. Researching ${data.discipline}.`,
        });

        // Trigger Celebration
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#4f46e5', '#818cf8']
        });

        setTimeout(() => {
            setIsLoading(false);
            onComplete();
        }, 1500);

    } catch (err: any) {
        console.error(err);
        addToast(err.message || "Failed to save profile. Please try again.", "error");
        setIsLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      
      {isAvatarModalOpen && (
        <AvatarUploader 
            onSave={(url) => { setAvatarUrl(url); setIsAvatarModalOpen(false); }}
            onClose={() => setIsAvatarModalOpen(false)}
        />
      )}

      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 50% 50%, #6366f1 0%, transparent 50%)'}}></div>
            <h1 className="text-3xl font-serif font-bold text-white relative z-10">Setup Your Profile</h1>
            <p className="text-indigo-200 mt-2 relative z-10">Step {step} of 2</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            
            {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-6">
                        <div 
                            className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors"
                            onClick={() => setIsAvatarModalOpen(true)}
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10" />
                            )}
                        </div>
                        <button type="button" onClick={() => setIsAvatarModalOpen(true)} className="text-sm text-indigo-600 font-bold hover:underline">
                            {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Full Name</label>
                        <input 
                            {...register('fullName')}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="Dr. Jane Doe"
                        />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Academic Handle</label>
                        <input 
                            {...register('handle')}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="@janedoe_lab"
                        />
                        {errors.handle && <p className="text-xs text-red-500 mt-1">{errors.handle.message}</p>}
                    </div>

                    <button 
                        type="button"
                        onClick={nextStep}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                        Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-indigo-600" /> Institution
                        </label>
                        <input 
                            {...register('institution')}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="University or Lab Name"
                        />
                        {errors.institution && <p className="text-xs text-red-500 mt-1">{errors.institution.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-indigo-600" /> Academic Role
                        </label>
                        <input 
                            {...register('role')}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="e.g. Postdoctoral Fellow"
                        />
                        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Primary Discipline</label>
                        <input 
                            {...register('discipline')}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="e.g. Quantum Physics, Microbiology"
                        />
                        {errors.discipline && <p className="text-xs text-red-500 mt-1">{errors.discipline.message}</p>}
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        {isLoading ? 'Finalizing...' : 'Complete Setup'}
                    </button>
                </div>
            )}

        </form>
      </div>
    </div>
  );
};
