
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { MessageSquare, Repeat2, Heart, Share, FileText, MoreHorizontal, AlertTriangle, X, Link as LinkIcon, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { Post } from '../types';
import { Skeleton } from './ui/Skeleton';
import { useNitorStore } from '../store/useNitorStore';
import { apiClient } from '../src/api/client';

// Lazy load the heavy Math rendering component
const MathRenderer = React.lazy(() => import('./MathRenderer'));

interface FeedCardProps {
  post: Post;
  onClick?: () => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({ post, onClick }) => {
  const { addToast } = useNitorStore();
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Interaction State
  const [likes, setLikes] = useState(post.likes);
  const [hasEndorsed, setHasEndorsed] = useState(false);
  const [reposts, setReposts] = useState(post.reposts);
  const [hasReposted, setHasReposted] = useState(false);

  // Viewport Visibility State for Lazy Loading
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const isArticle = post.isArticle;

  useEffect(() => {
    // Only set up observer if it's not an article preview (which is lightweight)
    if (isArticle) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading when element is 200px away from viewport
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, [isArticle]);

  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Optimistic update
    if (hasEndorsed) {
      setLikes(prev => Math.max(0, prev - 1));
      setHasEndorsed(false);
    } else {
      setLikes(prev => prev + 1);
      setHasEndorsed(true);
    }

    try {
      if (hasEndorsed) {
        await apiClient.unendorseContent(post.id);
      } else {
        await apiClient.endorseContent(post.id);
        addToast('Publication endorsed', 'success');
      }
    } catch (error: any) {
      // Revert on error
      if (hasEndorsed) {
        setLikes(prev => prev + 1);
        setHasEndorsed(true);
      } else {
        setLikes(prev => Math.max(0, prev - 1));
        setHasEndorsed(false);
      }
      console.error('Failed to toggle endorsement:', error);
      addToast(error.response?.data?.message || 'Failed to endorse content', 'error');
    }
  };

  const handleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Optimistic update
    if (hasReposted) {
      setReposts(prev => Math.max(0, prev - 1));
      setHasReposted(false);
    } else {
      setReposts(prev => prev + 1);
      setHasReposted(true);
    }

    try {
      if (hasReposted) {
        await apiClient.unrepostContent(post.id);
      } else {
        await apiClient.repostContent(post.id);
        addToast('Shared to your profile', 'success');
      }
    } catch (error: any) {
      // Revert on error
      if (hasReposted) {
        setReposts(prev => prev + 1);
        setHasReposted(true);
      } else {
        setReposts(prev => Math.max(0, prev - 1));
        setHasReposted(false);
      }
      console.error('Failed to toggle repost:', error);
      addToast(error.response?.data?.message || 'Failed to repost content', 'error');
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
    setShowShareMenu(false);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
    setShowMenu(false);
  };

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowReportModal(true);
  };

  const handleSubmitReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedReason) return;
    
    setIsReporting(true);
    // Simulate API call
    setTimeout(() => {
        addToast('Report submitted. Our academic integrity board will review this content.', 'success');
        setShowReportModal(false);
        setSelectedReason('');
        setIsReporting(false);
    }, 1000);
  };

  const getPostUrl = () => {
    return `${window.location.origin}${window.location.pathname}#/post/${post.id}`;
  };

  const copyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = getPostUrl();
    navigator.clipboard.writeText(link).then(() => {
        addToast('Link copied to clipboard', 'success');
    }).catch(() => {
        addToast('Failed to copy link', 'error');
    });
    setShowShareMenu(false);
  };

  const shareTo = (platform: 'twitter' | 'linkedin', e: React.MouseEvent) => {
    e.stopPropagation();
    const link = encodeURIComponent(getPostUrl());
    const text = encodeURIComponent(post.title || post.content.substring(0, 100) + '...');
    
    let url = '';
    if (platform === 'twitter') {
        url = `https://twitter.com/intent/tweet?text=${text}&url=${link}`;
    } else if (platform === 'linkedin') {
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const closeMenus = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowMenu(false);
      setShowShareMenu(false);
  };

  return (
    <>
      {(showMenu || showShareMenu) && (
          <div 
            className="fixed inset-0 z-10 cursor-default" 
            onClick={closeMenus}
          />
      )}

      <article 
        onClick={onClick}
        className={`
          group p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 transition-all duration-200 cursor-pointer relative
          hover:bg-white hover:shadow-md hover:scale-[1.005] hover:z-10 hover:border-transparent dark:hover:bg-slate-900
          ${isArticle ? 'bg-white dark:bg-slate-900' : 'bg-white/40 dark:bg-slate-900/40'}
        `}
      >
        {post.pinned && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2 ml-14">
             <svg className="w-3 h-3 fill-slate-500" viewBox="0 0 24 24"><path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" /></svg>
             Pinned Publication
          </div>
        )}

        <div className="flex gap-4">
          <div className="shrink-0">
            <img 
              src={post.author.avatarUrl} 
              alt={post.author.name} 
              className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1 relative">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 dark:text-slate-100 hover:underline decoration-indigo-500/30">{post.author.name}</span>
                {post.author.verified && (
                  <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                )}
                <span className="text-slate-500 text-sm">{post.author.handle}</span>
                <span className="text-slate-300 dark:text-slate-700 text-sm">·</span>
                <span className="text-slate-500 text-sm hover:underline">{post.timestamp}</span>
              </div>
              
              <div className="relative z-20">
                <button onClick={handleMenuClick} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg w-48 py-1 animate-in fade-in zoom-in-95 duration-100">
                    <button 
                        onClick={handleReportClick}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        Report Content
                    </button>
                    </div>
                )}
              </div>
            </div>

            {post.author.institution && (
              <div className="mb-3 flex items-center gap-2">
                <div className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {post.author.institution}
                </div>
                <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 rounded border border-indigo-100 dark:border-indigo-900/30">
                  Nitor: {post.author.nitorScore}
                </div>
              </div>
            )}

            {isArticle ? (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors mb-3">
                    <div className="p-4 md:p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                Open Access
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Article
                            </span>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-3 leading-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                            {post.title}
                        </h3>
                        <p className="font-serif text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 italic mb-4">
                            {post.abstract}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                             {post.keywords?.slice(0,2).map(k => (
                                 <span key={k} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">#{k}</span>
                             ))}
                             <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 ml-auto">Read Full Article →</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" ref={contentRef} style={{ minHeight: '60px' }}>
                   {isVisible ? (
                     <Suspense fallback={<div className="space-y-2"><Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-3/4"/></div>}>
                        <MathRenderer content={post.content} className="prose prose-slate dark:prose-invert prose-p:text-slate-800 dark:prose-p:text-slate-200 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 max-w-none" />
                     </Suspense>
                   ) : (
                     /* Placeholder while waiting for viewport intersection */
                     <div className="space-y-2">
                       <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full opacity-50"></div>
                       <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 opacity-50"></div>
                     </div>
                   )}
                </div>
            )}

            <div className="flex items-center justify-between mt-2 max-w-md text-slate-500 dark:text-slate-400">
              <button 
                  onClick={handleInteraction}
                  className="flex items-center gap-2 group/btn hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <div className="p-2 rounded-full group-hover/btn:bg-indigo-50 dark:group-hover/btn:bg-indigo-900/30 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium">{post.comments}</span>
              </button>
              
              <button
                  onClick={handleRepost}
                  className={`flex items-center gap-2 group/btn transition-colors ${hasReposted ? 'text-green-600 dark:text-green-500' : 'hover:text-green-600 dark:hover:text-green-500'}`}
              >
                <div className={`p-2 rounded-full transition-colors ${hasReposted ? 'bg-green-50 dark:bg-green-900/30' : 'group-hover/btn:bg-green-50 dark:group-hover/btn:bg-green-900/30'}`}>
                  <Repeat2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium">{reposts}</span>
              </button>
              
              <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 group/btn transition-colors ${hasEndorsed ? 'text-pink-600 dark:text-pink-500' : 'hover:text-pink-600 dark:hover:text-pink-500'}`}
              >
                <div className={`p-2 rounded-full transition-colors ${hasEndorsed ? 'bg-pink-50 dark:bg-pink-900/30' : 'group-hover/btn:bg-pink-50 dark:group-hover/btn:bg-pink-900/30'}`}>
                  <Heart className={`w-4 h-4 ${hasEndorsed ? 'fill-current' : ''}`} />
                </div>
                <span className="text-xs font-medium">{likes}</span>
              </button>

              <div className="relative z-20">
                  <button 
                      onClick={handleShareClick}
                      className={`flex items-center gap-2 group/btn hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${showShareMenu ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
                  >
                    <div className={`p-2 rounded-full group-hover/btn:bg-indigo-50 dark:group-hover/btn:bg-indigo-900/30 transition-colors ${showShareMenu ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}>
                      <Share className="w-4 h-4" />
                    </div>
                  </button>

                   {showShareMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl w-48 py-1 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            Share via
                        </div>
                        <button onClick={copyLink} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 transition-colors">
                            <LinkIcon className="w-4 h-4" /> Copy Link
                        </button>
                        <button onClick={(e) => shareTo('twitter', e)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 transition-colors">
                            <Twitter className="w-4 h-4" /> Share to X (Twitter)
                        </button>
                        <button onClick={(e) => shareTo('linkedin', e)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 transition-colors">
                            <Linkedin className="w-4 h-4" /> LinkedIn
                        </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </article>

      {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => {e.stopPropagation(); setShowReportModal(false);}}>
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          Report Academic Violation
                      </h3>
                      <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" /></button>
                  </div>
                  <div className="p-6">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Select the primary reason for flagging this content. Nitor takes scientific integrity seriously.</p>
                      <div className="space-y-2">
                          {['Plagiarism', 'Fabricated Data', 'Hate Speech', 'Copyright Infringement', 'Non-Academic Spam'].map((reason) => (
                              <label key={reason} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedReason === reason ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                  <input 
                                    type="radio" 
                                    name="report_reason" 
                                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:border-slate-600" 
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                  />
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{reason}</span>
                              </label>
                          ))}
                      </div>
                      <div className="mt-6 flex justify-end gap-3">
                          <button onClick={() => setShowReportModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                          <button 
                            onClick={handleSubmitReport} 
                            disabled={!selectedReason || isReporting}
                            className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                          >
                              {isReporting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Report'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};
