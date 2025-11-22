import React from 'react';
import { Home, Search, Bell, User, PenTool } from 'lucide-react';
import { ViewMode, User as UserType } from '../types';
import { useNitorStore } from '../store/useNitorStore';

interface MobileNavProps {
  currentView: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentUser: UserType;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, setViewMode }) => {
  const { openComposer } = useNitorStore();
  
  const navItems = [
    { id: 'feed', icon: Home },
    { id: 'explore', icon: Search },
    { id: 'composer', icon: PenTool, special: true, action: openComposer }, 
    { id: 'notifications', icon: Bell },
    { id: 'profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 z-50 safe-area-bottom flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        if (item.special) {
            return (
                <button
                    key={item.id}
                    onClick={item.action}
                    className="bg-indigo-600 text-white p-3 rounded-full -mt-8 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-transform active:scale-95"
                    aria-label="Create Post"
                >
                    <Icon className="w-6 h-6" />
                </button>
            )
        }

        return (
          <button
            key={item.id}
            onClick={() => setViewMode(item.id as ViewMode)}
            className={`p-2 rounded-xl transition-colors ${isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
          </button>
        );
      })}
    </div>
  );
};