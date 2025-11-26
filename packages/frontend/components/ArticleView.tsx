
import React, { useEffect, Suspense } from 'react';
import { ArrowLeft, Heart, MessageSquare, Repeat2, Bookmark, Share, Building2, User as UserIcon } from 'lucide-react';
import { Post, User } from '../types';
import { CommentSection } from './CommentSection';
import { Skeleton } from './ui/Skeleton';
import { useNitorStore } from '../store/useNitorStore';

const MathRenderer = React.lazy(() => import('./MathRenderer'));

interface ArticleViewProps {
  post: Post;
  onBack: () => void;
  onAuthorClick?: (user: User) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ post, onBack, onAuthorClick }) => {
  const { user: currentUser } = useNitorStore();

  // Client-side SEO Simulation
  useEffect(() => {
    const originalTitle = document.title;
    
    // Update Browser Title
    document.title = `${post.title || 'Post'} | NITOR Academic`;

    // Update Meta Tags (Simulation for Open Graph)
    const updateMeta = (name: string, content: string) => {
        let element = document.querySelector(`meta[property="${name}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    updateMeta('og:title', post.title || 'Scientific Update on NITOR');
    updateMeta('og:description', post.abstract || post.content.substring(0, 150));
    updateMeta('og:type', 'article');
    
    // Cleanup
    return () => {
        document.title = originalTitle;
    };
  }, [post]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 animate-in fade-in duration-300 pb-24 md:pb-0">
      {/* Article Header / Nav */}
      <div className="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-100 dark:border-slate-800 z-20 px-4 py-3 flex items-center justify-between max-w-4xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </button>
        <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><Bookmark className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><Share className="w-4 h-4" /></button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content Column */}
        <div className="lg:col-span-8">
          {/* Metadata */}
          <div className="mb-8">
             <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider rounded-full">
                    {post.isArticle ? 'Research Article' : 'Scientific Update'}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-sm">{post.timestamp}</span>
             </div>

             {post.title && (
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-slate-100 leading-tight mb-6">
                    {post.title}
                </h1>
             )}

             <div
               onClick={() => onAuthorClick?.(post.author)}
               className="flex items-center gap-4 py-5 border-y border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all rounded-lg px-3 -mx-3 group"
             >
                <img src={post.author.avatarUrl} alt="" className="w-14 h-14 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm" />
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{post.author.name}</p>
                        {post.author.verified && (
                           <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                        )}
                        <span className="text-sm text-slate-500 font-medium">{post.author.handle}</span>
                   </div>
                   <div className="flex flex-wrap items-center gap-3 mt-1">
                     {post.author.institution && (
                       <span className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                         <Building2 className="w-3.5 h-3.5 text-slate-400" />
                         {post.author.institution}
                       </span>
                     )}
                     <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                     <span className="text-sm text-slate-500 dark:text-slate-400">
                       Nitor Score: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{post.author.nitorScore}</span>
                     </span>
                   </div>
                </div>

                <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold group-hover:border-indigo-200 dark:group-hover:border-indigo-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shadow-sm">
                    <UserIcon className="w-3 h-3" />
                    Profile
                </button>
             </div>
          </div>

          {/* Abstract */}
          {post.abstract && (
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl mb-10 border border-slate-100 dark:border-slate-800">
               <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Abstract</h3>
               <p className="font-serif text-lg leading-relaxed text-slate-800 dark:text-slate-200 italic">
                 {post.abstract}
               </p>
            </div>
          )}

          {/* Body */}
          <article className="prose prose-lg prose-slate dark:prose-invert prose-headings:font-serif prose-p:font-serif prose-p:text-lg prose-p:leading-loose prose-li:font-serif text-slate-800 dark:text-slate-200 max-w-none">
            <Suspense fallback={<div className="space-y-4"><Skeleton className="h-6 w-full"/><Skeleton className="h-6 w-full"/><Skeleton className="h-6 w-2/3"/></div>}>
                 <MathRenderer content={post.content} />
            </Suspense>
          </article>

          {/* Keywords */}
          {post.keywords && (
             <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
               <div className="flex flex-wrap gap-2">
                  {post.keywords.map((k, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-sm hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                      #{k}
                    </span>
                  ))}
               </div>
             </div>
          )}

          {/* Interaction Layer */}
          <CommentSection postId={post.id} currentUser={currentUser!} />
        </div>

        {/* Sidebar Column */}
        <div className="hidden lg:block lg:col-span-4 space-y-8">
           <div className="sticky top-24">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                 <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Impact & Citations</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-slate-500 dark:text-slate-400 text-sm">Total Views</span>
                       <span className="font-mono font-bold text-slate-900 dark:text-slate-100">2.4k</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-slate-500 dark:text-slate-400 text-sm">Citations</span>
                       <span className="font-mono font-bold text-slate-900 dark:text-slate-100">14</span>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                    <div className="flex justify-around pt-2">
                       <button className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                          <Heart className="w-5 h-5" />
                          <span className="text-xs">{post.likes}</span>
                       </button>
                       <button className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                          <MessageSquare className="w-5 h-5" />
                          <span className="text-xs">{post.comments}</span>
                       </button>
                       <button className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                          <Repeat2 className="w-5 h-5" />
                          <span className="text-xs">{post.reposts}</span>
                       </button>
                    </div>
                 </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                  This article is Open Access under CC-BY-4.0.
                </p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};
