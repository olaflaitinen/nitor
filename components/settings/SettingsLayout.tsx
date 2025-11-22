import React, { useState } from 'react';
import { ArrowLeft, User, Shield, Bell, Eye, Lock, ChevronRight } from 'lucide-react';
import { useNitorStore } from '../../store/useNitorStore';
import { ProfileTab } from './ProfileTab';
import { NotificationsTab } from './NotificationsTab';
import { AccountTab } from './AccountTab';
import { PrivacyTab } from './PrivacyTab';
import { AppearanceTab } from './AppearanceTab';

type SettingsTab = 'account' | 'profile' | 'appearance' | 'notifications' | 'privacy';

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'account', label: 'Account & Security', icon: Shield },
  { id: 'profile', label: 'Academic Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Eye },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Data', icon: Lock },
];

export const SettingsLayout: React.FC = () => {
  const { setViewMode, user } = useNitorStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const renderContent = () => {
    switch (activeTab) {
        case 'account': return <AccountTab />;
        case 'profile': return <ProfileTab />;
        case 'notifications': return <NotificationsTab />;
        case 'appearance': return <AppearanceTab />;
        case 'privacy': return <PrivacyTab />;
        default: return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
                <button 
                    onClick={() => setViewMode('feed')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
                    aria-label="Back to Feed"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Settings & Preferences</h1>
            </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="md:w-64 shrink-0">
                
                {/* Mobile: Select Dropdown */}
                <div className="md:hidden mb-6">
                    <label htmlFor="settings-tab" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Navigate Settings
                    </label>
                    <div className="relative">
                        <select
                            id="settings-tab"
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value as SettingsTab)}
                            className="block w-full appearance-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-4 pr-10 text-base text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            {TABS.map((tab) => (
                                <option key={tab.id} value={tab.id}>
                                    {tab.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            <ChevronRight className="h-4 w-4 rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Desktop: Vertical List */}
                <nav className="hidden md:flex flex-col gap-1 sticky top-24">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left group
                                    ${isActive 
                                        ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm border border-slate-200 dark:border-slate-800' 
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                                    {tab.label}
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                            </button>
                        );
                    })}
                    
                    <div className="mt-8 px-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={user?.avatarUrl} className="w-8 h-8 rounded-full opacity-50 grayscale" alt="User" />
                            <div className="text-xs text-slate-400">
                                <p>Signed in as</p>
                                <p className="font-bold truncate w-32">{user?.name}</p>
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {renderContent()}
            </main>
        </div>
    </div>
  );
};