import React, { useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { useNitorStore } from '../../store/useNitorStore';

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-4">
    <div>
      <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
    <button
      type="button"
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600
        ${checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}
      `}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  </div>
);

export const NotificationsTab: React.FC = () => {
  const { addToast } = useNitorStore();
  const [isLoading, setIsLoading] = useState(false);

  // Mock State
  const [settings, setSettings] = useState({
    academic: {
      citations: true,
      mentions: true,
      papers: true,
    },
    social: {
      followers: true,
      likes: false,
      reposts: true,
    },
    channels: {
      push: true,
      email: false,
    }
  });

  const handleToggle = (category: 'academic' | 'social' | 'channels', key: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: !prev[category as keyof typeof prev][key as keyof typeof prev[keyof typeof prev]]
      }
    }));
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast('Notification preferences updated', 'success');
    }, 800);
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notifications</h2>
        <p className="text-slate-500 dark:text-slate-400">Choose what you want to hear about.</p>
      </div>

      <div className="space-y-8">
        
        {/* Academic Alerts */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4">Academic Alerts</h3>
           <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <Toggle 
                label="New Citations" 
                description="When someone cites your work in a new publication."
                checked={settings.academic.citations}
                onChange={() => handleToggle('academic', 'citations')}
              />
              <Toggle 
                label="Mentions & Tags" 
                description="When you are tagged in a discussion or comment."
                checked={settings.academic.mentions}
                onChange={() => handleToggle('academic', 'mentions')}
              />
              <Toggle 
                label="Paper Recommendations" 
                description="Weekly digest of papers relevant to your disciplines."
                checked={settings.academic.papers}
                onChange={() => handleToggle('academic', 'papers')}
              />
           </div>
        </div>

        {/* Social Alerts */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-4">Network Activity</h3>
           <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <Toggle 
                label="New Followers" 
                checked={settings.social.followers}
                onChange={() => handleToggle('social', 'followers')}
              />
              <Toggle 
                label="Reposts" 
                checked={settings.social.reposts}
                onChange={() => handleToggle('social', 'reposts')}
              />
              <Toggle 
                label="Endorsements (Likes)" 
                description="Notify me every time someone likes my post."
                checked={settings.social.likes}
                onChange={() => handleToggle('social', 'likes')}
              />
           </div>
        </div>

        {/* Channels */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Delivery Channels</h3>
           <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <Toggle 
                label="Push Notifications"
                description="Real-time alerts on your mobile device."
                checked={settings.channels.push}
                onChange={() => handleToggle('channels', 'push')}
              />
              <Toggle 
                label="Email Digest"
                description="Daily summary"
                checked={settings.channels.email}
                onChange={() => handleToggle('channels', 'email')}
              />
           </div>
        </div>

        <div className="flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-slate-900 dark:bg-slate-700 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
            >
               {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
               Update Preferences
            </button>
        </div>
      </div>
    </div>
  );
};