
import React from 'react';
import { SearchWidget } from './SearchWidget';
import { ViewMode } from '../types';

// Helper hook to get the view setter context would be ideal, 
// but for now we will pass it or assume it's not needed for this specific component snippet 
// unless we prop drill. 
// To keep it simple without refactoring the entire app prop drilling,
// I will assume this component is used inside App structure where we can access navigation 
// via a prop if we were to refactor Widgets.
// However, based on current architecture, Widgets is a leaf. 
// I will just make them generic links or buttons that would trigger an event if connected.
// *Correction*: I will add an interface to Widgets to accept the navigation handler.

interface WidgetsProps {
  onNavigate?: (mode: ViewMode) => void;
}

export const Widgets: React.FC<WidgetsProps> = ({ onNavigate }) => {
  const trendingTopics = [
    { topic: "Large Language Models", posts: "12.5k" },
    { topic: "CRISPR-Cas9", posts: "8.2k" },
    { topic: "Quantum Entanglement", posts: "5.1k" },
    { topic: "Climate Modeling", posts: "4.9k" },
  ];

  const suggestedScholars = [
    { name: "Dr. Aris Thorne", handle: "@aris_t", institute: "CERN" },
    { name: "Prof. L. Vance", handle: "@vance_lab", institute: "Stanford" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Search Module */}
      <SearchWidget />

      {/* Trending Box */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <h3 className="font-bold text-xl text-slate-900 mb-4 px-2">Trending in Science</h3>
        <div className="flex flex-col gap-1">
          {trendingTopics.map((item, idx) => (
            <div key={idx} className="hover:bg-slate-200/50 px-3 py-2.5 rounded-xl cursor-pointer transition-colors">
              <p className="text-xs text-slate-500 font-medium">Trending</p>
              <p className="text-sm font-bold text-slate-800">{item.topic}</p>
              <p className="text-xs text-slate-500">{item.posts} Publications</p>
            </div>
          ))}
        </div>
        <button className="w-full text-left px-3 py-3 text-indigo-600 text-sm hover:underline mt-2">
          Show more
        </button>
      </div>

      {/* Who to follow */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <h3 className="font-bold text-xl text-slate-900 mb-4 px-2">Scholars to Follow</h3>
        <div className="flex flex-col gap-4">
          {suggestedScholars.map((scholar, idx) => (
            <div key={idx} className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                    {scholar.name[0]}
                 </div>
                 <div className="flex flex-col">
                   <span className="text-sm font-bold text-slate-900">{scholar.name}</span>
                   <span className="text-xs text-slate-500">{scholar.institute}</span>
                 </div>
              </div>
              <button className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-2 text-xs text-slate-400 leading-relaxed flex flex-wrap gap-x-4 gap-y-1">
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
