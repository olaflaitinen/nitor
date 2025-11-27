
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Upload, X, Plus, Save, Loader2, Building2, GraduationCap } from 'lucide-react';
import { useNitorStore } from '../../store/useNitorStore';
import { AvatarUploader } from '../ui/AvatarUploader';
import { apiClient } from '../../src/api/client';

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  institution: z.string().min(2, "Institution is required"),
  role: z.string().optional(),
  orcid: z.string()
    .regex(/^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/, "Invalid ORCID. Format must be 0000-0000-0000-0000")
    .or(z.literal('')),
  bio: z.string().max(300, "Bio must be under 300 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileTab: React.FC = () => {
  const { user, addToast, updateUser } = useNitorStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [disciplines, setDisciplines] = useState<string[]>(['Neuroscience', 'Physics']);
  const [disciplineInput, setDisciplineInput] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.name || '',
      institution: user?.institution || '',
      role: user?.role || '',
      orcid: '0000-0002-1825-0097', // Mock placeholder if empty
      bio: user?.bio || '',
    }
  });

  const bioValue = watch('bio');

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);

    try {
      // Update via API with disciplines
      await apiClient.updateProfile(user!.id, {
        fullName: data.fullName,
        institution: data.institution,
        academicTitle: data.role,
        bio: data.bio,
        discipline: disciplines.join(', '), // Save disciplines as comma-separated string
      });

      // Update Store
      updateUser({
        name: data.fullName,
        institution: data.institution,
        role: data.role,
        bio: data.bio,
      });

      addToast('Profile updated successfully', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarSave = async (newUrl: string) => {
    try {
      await apiClient.updateProfile(user!.id, {
        avatarUrl: newUrl
      });

      updateUser({ avatarUrl: newUrl });
      addToast('Profile photo updated', 'success');
      setIsAvatarModalOpen(false);
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save photo', 'error');
    }
  };

  const addDiscipline = () => {
    if (disciplineInput.trim() && !disciplines.includes(disciplineInput.trim())) {
      setDisciplines([...disciplines, disciplineInput.trim()]);
      setDisciplineInput('');
    }
  };

  const removeDiscipline = (d: string) => {
    setDisciplines(disciplines.filter(item => item !== d));
  };

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      addToast('Please upload a PDF file', 'error');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      addToast('File size must be less than 10MB', 'error');
      return;
    }

    setIsLoading(true);
    try {
      addToast('CV uploaded successfully (backend upload not yet implemented)', 'success');
      // TODO: Implement actual upload to MinIO/S3
      // const formData = new FormData();
      // formData.append('cv', file);
      // await apiClient.uploadCV(formData);
    } catch (error: any) {
      console.error('Failed to upload CV:', error);
      addToast(error.response?.data?.message || 'Failed to upload CV', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-300">
      {isAvatarModalOpen && (
        <AvatarUploader
          currentAvatarUrl={user?.avatarUrl}
          onSave={handleAvatarSave}
          onClose={() => setIsAvatarModalOpen(false)}
        />
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Academic Profile</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage how you appear to the scientific community.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Identity Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" /> Identity
          </h3>
          <div className="grid gap-6">
            <div className="flex items-start gap-6">
              <div className="shrink-0">
                <img src={user?.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="mt-2 text-xs text-indigo-600 font-bold hover:underline block text-center w-full"
                >
                  Change
                </button>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input {...register('fullName')} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                  <textarea
                    {...register('bio')}
                    rows={3}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.bio ? (
                      <p className="text-xs text-red-500">{errors.bio.message}</p>
                    ) : (
                      <span></span>
                    )}
                    <p className={`text-xs ${bioValue?.length > 300 ? 'text-red-500' : 'text-slate-400'}`}>
                      {bioValue?.length || 0}/300 characters
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliation Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" /> Affiliation
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Institution</label>
              <input {...register('institution')} placeholder="e.g. MIT" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              {errors.institution && <p className="text-xs text-red-500 mt-1">{errors.institution.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Academic Role</label>
              <input {...register('role')} placeholder="e.g. Associate Professor" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ORCID iD</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">iD</span>
                <input
                  {...register('orcid')}
                  placeholder="0000-0000-0000-0000"
                  className="w-full p-2.5 pl-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                />
              </div>
              {errors.orcid && <p className="text-xs text-red-500 mt-1">{errors.orcid.message}</p>}
            </div>
          </div>
        </div>

        {/* Disciplines Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" /> Disciplines & CV
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Research Fields</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {disciplines.map(d => (
                <span key={d} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  {d}
                  <button type="button" onClick={() => removeDiscipline(d)} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={disciplineInput}
                onChange={(e) => setDisciplineInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDiscipline())}
                placeholder="Add a discipline..."
                className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <button type="button" onClick={addDiscipline} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Plus className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Curriculum Vitae</label>
            <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={handleCVUpload}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400">PDF only (max 10MB)</p>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
};
