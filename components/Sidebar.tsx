import React from 'react';
import { Home, Search, Bell, User, PenTool, Zap, Settings } from 'lucide-react';
import { ViewMode } from '../types';
import { useNitorStore } from '../store/useNitorStore';
import { CURRENT_USER } from '../constants';

interface SidebarProps {
  currentView: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setViewMode }) => {
  const { openComposer } = useNitorStore();

  const menuItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="hidden md:flex flex-col gap-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setViewMode(item.id as ViewMode)}
            className={`
              flex items-center gap-4 px-4 py-3 rounded-full text-lg font-medium transition-all duration-200 text-left w-full
              ${isActive 
                ? 'bg-slate-100 text-slate-900 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
            {item.label}
          </button>
        );
      })}
      
      <button
        onClick={() => setViewMode('pricing')}
        className={`
          flex items-center gap-4 px-4 py-3 rounded-full text-lg font-medium transition-all duration-200 text-left w-full text-slate-500 hover:bg-slate-50 hover:text-slate-900
          ${currentView === 'pricing' ? 'bg-slate-100 text-slate-900 font-semibold' : ''}
        `}
      >
        <Zap className={`w-6 h-6 ${currentView === 'pricing' ? 'text-yellow-500' : 'text-slate-400'}`} />
        Nitor Plus
      </button>

      <button
        onClick={() => setViewMode('settings')}
        className={`
          flex items-center gap-4 px-4 py-3 rounded-full text-lg font-medium transition-all duration-200 text-left w-full text-slate-500 hover:bg-slate-50 hover:text-slate-900
          ${currentView === 'settings' ? 'bg-slate-100 text-slate-900 font-semibold' : ''}
        `}
      >
        <Settings className={`w-6 h-6 ${currentView === 'settings' ? 'text-indigo-600' : 'text-slate-400'}`} />
        Settings
      </button>

      <div className="mt-8 px-2">
        <button 
          onClick={openComposer}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-indigo-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <PenTool className="w-5 h-5" />
          <span className="hidden lg:inline">Publish</span>
        </button>
      </div>
    </nav>
  );
};