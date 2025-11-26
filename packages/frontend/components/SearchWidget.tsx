
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Check, X, FileText, User as UserIcon, Loader2 } from 'lucide-react';
import { apiClient } from '../src/api/client';
import { useNitorStore } from '../store/useNitorStore';

interface SearchResult {
  type: 'content' | 'profile';
  id: string;
  title: string;
  subtitle: string;
  avatarUrl?: string;
  handle?: string;
}

export const SearchWidget: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { setViewMode } = useNitorStore();

  // Filter State
  const [filters, setFilters] = useState({
    openAccess: false,
    peerReviewed: false,
    institutions: false
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters({ openAccess: false, peerReviewed: false, institutions: false });
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      setShowResults(true);

      try {
        // Search both content and profiles
        const [contentResponse, profilesResponse] = await Promise.all([
          apiClient.searchContent(query, 0, 5),
          apiClient.searchProfiles(query, 0, 5),
        ]);

        const combinedResults: SearchResult[] = [];

        // Map content results
        contentResponse.content.forEach((item: any) => {
          combinedResults.push({
            type: 'content',
            id: item.id,
            title: item.title || item.body.substring(0, 60) + '...',
            subtitle: `by ${item.author.fullName}`,
            avatarUrl: item.author.avatarUrl,
          });
        });

        // Map profile results
        profilesResponse.content.forEach((user: any) => {
          combinedResults.push({
            type: 'profile',
            id: user.id,
            title: user.fullName,
            subtitle: user.institution || 'Independent Researcher',
            avatarUrl: user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`,
            handle: user.handle,
          });
        });

        setResults(combinedResults);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search by 300ms
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'content') {
      setViewMode('article');
      // TODO: Pass content ID to article view
    } else {
      setViewMode('profile');
      // TODO: Pass profile ID to profile view
    }
    setShowResults(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="relative group">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowResults(true)}
          placeholder="Search people, math, or papers"
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-3 w-4 h-4 text-indigo-500 animate-spin" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && query.trim() && (
        <div className="mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left"
                >
                  {result.type === 'profile' ? (
                    <img
                      src={result.avatarUrl}
                      alt={result.title}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {result.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {result.subtitle}
                    </p>
                  </div>
                  {result.type === 'profile' && (
                    <UserIcon className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              ))}
            </div>
          ) : !isSearching ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">No results found</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try different keywords</p>
            </div>
          ) : null}
        </div>
      )}
      
      <div className="mt-3">
         <div className="flex items-center justify-between">
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-2 text-xs font-bold transition-colors px-2 py-1 -ml-2 rounded-lg
                  ${showFilters || activeFilterCount > 0 ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
                `}
            >
                <Filter className="w-3 h-3" />
                Advanced Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-indigo-600 text-white text-[10px] px-1.5 rounded-full min-w-[16px] h-4 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
            </button>

            {activeFilterCount > 0 && showFilters && (
              <button 
                onClick={clearFilters}
                className="text-[10px] font-medium text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                Clear all
              </button>
            )}
         </div>
         
         <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
             <div className="space-y-2 p-1">
                 <FilterCheckbox 
                    label="Open Access Only" 
                    checked={filters.openAccess} 
                    onChange={() => toggleFilter('openAccess')} 
                 />
                 <FilterCheckbox 
                    label="Peer Reviewed" 
                    checked={filters.peerReviewed} 
                    onChange={() => toggleFilter('peerReviewed')} 
                 />
                 <FilterCheckbox 
                    label="Verified Institutions" 
                    checked={filters.institutions} 
                    onChange={() => toggleFilter('institutions')} 
                 />
             </div>
         </div>
      </div>
    </div>
  );
};

// Sub-component for a consistent, accessible Checkbox
const FilterCheckbox: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group select-none">
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        className="peer sr-only" 
        checked={checked} 
        onChange={onChange} 
      />
      <div className={`
        w-4 h-4 border rounded shadow-sm transition-all duration-200 flex items-center justify-center
        peer-focus:ring-2 peer-focus:ring-indigo-500/30
        ${checked 
          ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500' 
          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-indigo-400 dark:group-hover:border-indigo-400'}
      `}>
        <Check className={`w-3 h-3 text-white transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
      </div>
    </div>
    <span className={`text-sm transition-colors ${checked ? 'text-slate-900 dark:text-slate-100 font-medium' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>
      {label}
    </span>
  </label>
);
