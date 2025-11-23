
import React, { useState } from 'react';
import { User, Post } from '../types';
import { Feed, FeedSkeleton } from './Feed';
import { Award, Users, BookOpen, GraduationCap, Check, FileText } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { Skeleton } from './ui/Skeleton';
import { CVManager } from './profile/CVManager';
import { useNitorStore } from '../store/useNitorStore';

interface ProfileViewProps {
  user?: User; // Optional to allow rendering skeleton without user data
  posts: Post[];
  onPostClick: (post: Post) => void;
  isLoading?: boolean;
}

type ProfileTab = 'overview' | 'publications' | 'updates' | 'network' | 'cv';

export const ProfileSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-12">
            {/* Banner Skeleton */}
            <div className="h-32 md:h-48 bg-slate-200 dark:bg-slate-800 w-full animate-pulse" />
            
            <div className="px-6 max-w-5xl mx-auto relative">
                {/* Header Skeleton */}
                <div className="flex justify-between items-end -mt-12 mb-6">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-900 p-1">
                            <Skeleton className="w-full h-full rounded-full" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-32 rounded-full mb-4" />
                </div>

                {/* Info Skeleton */}
                <div className="mb-8 space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-32" />
                    <div className="flex gap-4">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="space-y-2 max-w-2xl pt-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="flex gap-6 pt-4">
                        <Skeleton className="h-8 w-24 rounded-lg" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 mb-8 pb-1">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <Skeleton className="h-24 rounded-xl" />
                            <Skeleton className="h-24 rounded-xl" />
                            <Skeleton className="h-24 rounded-xl" />
                        </div>
                        <FeedSkeleton />
                    </div>
                    <div className="hidden lg:block space-y-6">
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProfileView: React.FC<ProfileViewProps> = ({ user, posts, onPostClick, isLoading }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const { user: currentUser } = useNitorStore();

  if (isLoading || !user) {
      return <ProfileSkeleton />;
  }

  // Filter posts based on tab
  const articles = posts.filter(p => p.isArticle);
  const updates = posts.filter(p => !p.isArticle);
  const pinned = posts.filter(p => p.pinned);

  // Check if viewing own profile
  const isOwnProfile = currentUser?.id === user.id;

  // Mock specific data for the CV feel
  const interests = ["Computational Neuroscience", "Bayesian Inference", "Plasticity", "AI Ethics"];
  const education = [
    { degree: "Ph.D. in Neuroscience", school: "Harvard University", year: "2018" },
    { degree: "B.S. in Computer Science", school: "MIT", year: "2014" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 animate-in fade-in pb-12">
      {/* Header Banner */}
      <div className="h-32 md:h-48 bg-gradient-to-r from-slate-800 to-slate-900 w-full relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Profile Info */}
      <div className="px-6 max-w-5xl mx-auto relative">
        <div className="flex justify-between items-end -mt-12 mb-4">
           <div className="relative">
             <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-950 bg-white dark:bg-slate-900 shadow-md object-cover"
             />
             {user.verified && (
                 <div className="absolute bottom-2 right-2 bg-white dark:bg-slate-800 rounded-full p-1 shadow-sm">
                     <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                 </div>
             )}
           </div>
           <button 
             onClick={() => setIsFollowing(!isFollowing)}
             className={`
                mb-4 font-bold px-6 py-2.5 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2
                ${isFollowing 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-indigo-900/30'}
             `}
           >
              {isFollowing ? (
                  <>
                    <Check className="w-4 h-4" />
                    Following
                  </>
              ) : (
                  'Connect'
              )}
           </button>
        </div>

        <div className="mb-8">
           <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              {user.name}
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-lg mb-1">{user.handle}</p>
           
           <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
               {user.role && <p className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1"><GraduationCap className="w-4 h-4 text-slate-400" /> {user.role}</p>}
               <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md w-fit">
                   <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                   {user.institution}
               </p>
           </div>
           
           <div className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl text-sm md:text-base">
              {user.bio}
           </div>

           <div className="flex flex-wrap gap-y-2 gap-x-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                 <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                 <span className="font-bold">Nitor Score: {user.nitorScore}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors p-1.5">
                 <Users className="w-4 h-4" />
                 <span className="font-bold text-slate-900 dark:text-slate-100">{user.followersCount}</span> followers
              </div>
              <div className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors p-1.5">
                 <span className="font-bold text-slate-900 dark:text-slate-100">{user.followingCount}</span> following
              </div>
              <div className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors p-1.5">
                 <BookOpen className="w-4 h-4" />
                 <span className="font-bold text-slate-900 dark:text-slate-100">{user.publicationsCount}</span> publications
              </div>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto hide-scrollbar">
           {[
             {id: 'overview', label: 'Overview'},
             {id: 'publications', label: 'Publications', count: articles.length},
             {id: 'cv', label: 'CV / Resume', icon: FileText},
             {id: 'updates', label: 'Updates'},
             {id: 'network', label: 'Network'},
           ].map(tab => (
              <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as ProfileTab)}
                 className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 outline-none focus:outline-none
                    ${activeTab === tab.id 
                       ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                       : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'}
                 `}
              >
                 {tab.icon && <tab.icon className="w-4 h-4" />}
                 {tab.label}
                 {tab.count !== undefined && <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-xs font-normal text-slate-600 dark:text-slate-400">{tab.count}</span>}
              </button>
           ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left/Main Content */}
           <div className="lg:col-span-2 space-y-8">
               {activeTab === 'overview' && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                     {/* Stats Row */}
                     <div className="grid grid-cols-3 gap-4">
                         {[
                             { label: 'Citations', value: '1,240' },
                             { label: 'h-index', value: '18' },
                             { label: 'i10-index', value: '24' }
                         ].map((stat, i) => (
                             <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center">
                                 <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                                 <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">{stat.label}</div>
                             </div>
                         ))}
                     </div>

                     {/* Education */}
                     <div className="bg-white dark:bg-slate-950">
                         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Education</h3>
                         <div className="space-y-4">
                             {education.map((edu, i) => (
                                 <div key={i} className="flex gap-4">
                                     <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                         <GraduationCap className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                     </div>
                                     <div>
                                         <p className="font-bold text-slate-900 dark:text-slate-100">{edu.school}</p>
                                         <p className="text-sm text-slate-600 dark:text-slate-400">{edu.degree}, {edu.year}</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>

                     {pinned.length > 0 && (
                         <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Pinned Research</h3>
                            <div className="border border-indigo-100 dark:border-indigo-900/30 rounded-xl overflow-hidden">
                                <Feed posts={pinned} onPostClick={onPostClick} />
                            </div>
                         </div>
                     )}

                     <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Activity</h3>
                        <Feed posts={posts.slice(0, 3)} onPostClick={onPostClick} />
                     </div>
                  </div>
               )}

               {activeTab === 'publications' && (
                  <div className="animate-in slide-in-from-bottom-2 duration-300">
                      <Feed posts={articles} onPostClick={onPostClick} />
                  </div>
               )}

               {activeTab === 'updates' && (
                  <div className="animate-in slide-in-from-bottom-2 duration-300">
                     <Feed posts={updates} onPostClick={onPostClick} />
                  </div>
               )}
               
               {activeTab === 'cv' && (
                   <div className="animate-in slide-in-from-bottom-2 duration-300">
                       {isOwnProfile ? (
                           <CVManager />
                       ) : (
                           <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl text-center border border-slate-200 dark:border-slate-800">
                               <p className="text-slate-500 dark:text-slate-400 mb-4">This user has not published their CV yet.</p>
                           </div>
                       )}
                   </div>
               )}
               
               {activeTab === 'network' && (
                  <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Connected Scholars</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {MOCK_USERS.map((peer) => (
                              <div key={peer.id} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm transition-all bg-white dark:bg-slate-900 cursor-pointer group">
                                  <img src={peer.avatarUrl} alt={peer.name} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                  <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{peer.name}</h4>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{peer.institution}</p>
                                  </div>
                                  <button className="px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40">
                                      Profile
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
               )}
           </div>

           {/* Right Sidebar (Context) */}
           {activeTab === 'overview' && (
               <div className="hidden lg:block space-y-6">
                   <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                       <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Research Interests</h3>
                       <div className="flex flex-wrap gap-2">
                           {interests.map((tag, i) => (
                               <span key={i} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium shadow-sm">
                                   {tag}
                               </span>
                           ))}
                       </div>
                   </div>
                   
                   <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
                       <h3 className="font-bold text-lg mb-2">Collaborate</h3>
                       <p className="text-indigo-100 text-sm mb-4">Open to research partnerships in computational biology and neural interfaces.</p>
                       <button className="w-full bg-white text-indigo-600 font-bold py-2 rounded-lg text-sm hover:bg-indigo-50 transition-colors">
                           Send Message
                       </button>
                   </div>
               </div>
           )}

        </div>
      </div>
    </div>
  );
};
