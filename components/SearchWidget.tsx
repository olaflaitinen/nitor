
import React, { useState } from 'react';
import { Search, Filter, Check, X } from 'lucide-react';

export const SearchWidget: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
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

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="relative group">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people, math, or papers"
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>
      
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
