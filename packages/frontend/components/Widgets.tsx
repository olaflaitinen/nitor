
import React, { useState, useEffect } from 'react';
import { SearchWidget } from './SearchWidget';
import { ViewMode } from '../types';
import { apiClient } from '../src/api/client';
import { useNitorStore } from '../store/useNitorStore';

interface WidgetsProps {
  onNavigate?: (mode: ViewMode) => void;
}

interface ScholarSuggestion {
  id: string;
  name: string;
  handle: string;
  institute: string;
  avatarUrl: string;
  isFollowing?: boolean;
}

export const Widgets: React.FC<WidgetsProps> = ({ onNavigate }) => {
  const [suggestedScholars, setSuggestedScholars] = useState<ScholarSuggestion[]>([]);
  const [isLoadingScholars, setIsLoadingScholars] = useState(true);
  const { addToast } = useNitorStore();

  // Fetch suggested scholars from real API
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await apiClient.searchProfiles('', 0, 4);
        const scholars = response.content.map((user: any) => ({
          id: user.id,
          name: user.fullName,
          handle: user.handle,
          institute: user.institution || 'Independent Researcher',
          avatarUrl: user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`,
        }));
        setSuggestedScholars(scholars);
      } catch (error) {
        console.error('Failed to fetch suggested scholars:', error);
        setSuggestedScholars([]);
      } finally {
        setIsLoadingScholars(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleFollow = async (scholarId: string) => {
    const scholar = suggestedScholars.find(s => s.id === scholarId);
    if (!scholar) return;

    // Optimistic update
    setSuggestedScholars(prev =>
      prev.map(s => s.id === scholarId ? { ...s, isFollowing: !s.isFollowing } : s)
    );

    try {
      if (scholar.isFollowing) {
        await apiClient.unfollowUser(scholarId);
        addToast('Unfollowed successfully', 'success');
      } else {
        await apiClient.followUser(scholarId);
        addToast('Following successfully', 'success');
      }
    } catch (error: any) {
      // Revert on error
      setSuggestedScholars(prev =>
        prev.map(s => s.id === scholarId ? { ...s, isFollowing: scholar.isFollowing } : s)
      );
      console.error('Failed to toggle follow:', error);
      addToast(error.response?.data?.message || 'Failed to follow user', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Module */}
      <SearchWidget />

      {/* Who to follow - Real data from API */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-4 px-2">Scholars to Follow</h3>
        <div className="flex flex-col gap-4">
          {isLoadingScholars ? (
            // Loading skeletons
            [1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between px-2 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div className="flex flex-col gap-1">
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              </div>
            ))
          ) : suggestedScholars.length > 0 ? (
            suggestedScholars.map((scholar) => (
              <div key={scholar.id} className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <img
                    src={scholar.avatarUrl}
                    alt={scholar.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{scholar.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{scholar.institute}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(scholar.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                    scholar.isFollowing
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-300'
                  }`}
                >
                  {scholar.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-400 dark:text-slate-500 text-sm">
              <p>No suggestions available</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-2 text-xs text-slate-400 dark:text-slate-500 leading-relaxed flex flex-wrap gap-x-4 gap-y-1">
        <span>© 2024 NITOR</span>
        {onNavigate ? (
           <>
             <button onClick={() => onNavigate('privacy')} className="hover:underline">Privacy</button>
             <button onClick={() => onNavigate('terms')} className="hover:underline">Terms</button>
             <button onClick={() => onNavigate('about')} className="hover:underline">About</button>
           </>
        ) : (
           <p>Privacy · Terms · Open Access Policy</p>
        )}
      </div>
    </div>
  );
};
