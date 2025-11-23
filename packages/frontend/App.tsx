
import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { Widgets } from './components/Widgets';
import { NitorComposer } from './components/NitorComposer';
import { ArticleView } from './components/ArticleView';
import { ProfileView } from './components/ProfileView';
import { NotificationsView } from './components/NotificationsView';
import { AuthPage } from './components/AuthPage';
import { MobileNav } from './components/MobileNav';
import { AboutPage, PrivacyPage, TermsPage } from './components/StaticPages';
import { PricingPage } from './components/PricingPage';
import { SettingsPage } from './components/SettingsPage';
import { OnboardingPage } from './components/OnboardingPage';
import { ToastContainer } from './components/ui/Toast';
import { Post, ViewMode, User } from './types';
import { MOCK_POSTS, MOCK_NOTIFICATIONS } from './constants';
import { useNitorStore } from './store/useNitorStore';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const App: React.FC = () => {
  // Use Global Store
  const { 
    user, 
    isAuthenticated, 
    needsOnboarding,
    setNeedsOnboarding,
    viewMode, 
    isComposerOpen,
    login, 
    setViewMode, 
    closeComposer,
    addToast 
  } = useNitorStore();
  
  // Local Data State
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);

  // Real Data Fetching
  useEffect(() => {
    const fetchPosts = async () => {
        if (!isSupabaseConfigured()) {
            setPosts(MOCK_POSTS);
            setIsLoading(false);
            return;
        }

        try {
            // Fetch Content with Author relation
            const { data, error } = await supabase
                .from('content')
                .select(`
                    *,
                    author:profiles(*)
                `)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;

            if (data && data.length > 0) {
                // Map DB format to App format
                const mappedPosts: Post[] = data.map(item => ({
                    id: item.id,
                    author: {
                        id: item.author.id,
                        name: item.author.full_name,
                        handle: item.author.handle,
                        avatarUrl: item.author.avatar_url,
                        institution: item.author.institution,
                        nitorScore: item.author.nitor_score || 0,
                        verified: item.author.verified || false,
                    },
                    content: item.body,
                    timestamp: new Date(item.created_at).toLocaleDateString(),
                    likes: item.likes_count || 0,
                    reposts: item.reposts_count || 0,
                    comments: 0, // Relation query needed for count
                    isArticle: item.type === 'article',
                    title: item.title,
                    abstract: item.abstract,
                    keywords: item.keywords,
                    pinned: false
                }));
                setPosts(mappedPosts);
            } else {
                // Fallback to Mocks if DB is empty (Zero State / Fresh Install)
                setPosts(MOCK_POSTS);
            }
        } catch (err) {
            console.error("Failed to fetch posts:", err);
            setPosts(MOCK_POSTS); // Fallback
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        fetchPosts();
    } else {
        setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Actions
  const handleCreatePost = (newPost: Post) => {
    // Optimistic Update
    setPosts((prev) => [newPost, ...prev]);
    closeComposer();
    
    // Async Persist
    if (isSupabaseConfigured()) {
        supabase.from('content').insert({
            author_id: user?.id,
            type: newPost.isArticle ? 'article' : 'post',
            body: newPost.content,
            title: newPost.title,
            abstract: newPost.abstract,
            keywords: newPost.keywords,
            created_at: new Date().toISOString()
        }).then(({ error }) => {
            if (error) {
                addToast("Failed to save post to server", "error");
                console.error(error);
            } else {
                addToast('Publication broadcasted successfully', 'success');
            }
        });
    } else {
        addToast('Publication broadcasted (Demo Mode)', 'success');
    }
    
    setViewMode('feed');
  };

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    setViewMode('article');
  };

  const navigateToProfile = (user: User) => {
    setSelectedProfileUser(user);
    setViewMode('profile');
  };

  // --- PUBLIC / STATIC ROUTES ---
  if (viewMode === 'about') return <AboutPage onBack={() => setViewMode('feed')} />;
  if (viewMode === 'privacy') return <PrivacyPage onBack={() => setViewMode('feed')} />;
  if (viewMode === 'terms') return <TermsPage onBack={() => setViewMode('feed')} />;
  if (viewMode === 'pricing') return <PricingPage onBack={() => setViewMode('feed')} />;

  // --- AUTH GUARD ---
  if (!isAuthenticated) {
      return <AuthPage onLogin={() => {}} />; 
  }

  // --- ONBOARDING FLOW ---
  if (needsOnboarding) {
      return <OnboardingPage onComplete={() => setNeedsOnboarding(false)} />;
  }

  // --- SETTINGS ROUTE ---
  if (viewMode === 'settings') {
      return (
        <>
          <SettingsPage />
          <ToastContainer />
        </>
      );
  }

  // --- FOCUS MODES (Full Screen Views) ---
  if (viewMode === 'article' && selectedPost) {
    return (
      <>
        <ArticleView 
          post={selectedPost} 
          onBack={() => {
            setSelectedPost(null);
            setViewMode('feed');
          }}
          onAuthorClick={navigateToProfile}
        />
        <ToastContainer />
        {isComposerOpen && user && (
          <NitorComposer 
             currentUser={user}
             onPublish={handleCreatePost}
             onCancel={closeComposer}
          />
        )}
      </>
    );
  }

  // --- MAIN SHELL LAYOUT ---
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto bg-white dark:bg-slate-950 transition-colors">
        
        {/* Global Toast Container */}
        <ToastContainer />

        {/* Global Composer Modal Overlay */}
        {isComposerOpen && user && (
            <NitorComposer 
                currentUser={user}
                onPublish={handleCreatePost}
                onCancel={closeComposer}
            />
        )}
        
        {/* Desktop Header / Sidebar */}
        <aside className="hidden md:block md:w-64 border-r border-slate-100 dark:border-slate-800 sticky top-0 h-screen bg-white dark:bg-slate-950">
          <div className="p-6 flex flex-col h-full">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 cursor-pointer" onClick={() => setViewMode('feed')}>NITOR</h1>
            </div>
            <Sidebar 
              currentView={viewMode} 
              setViewMode={(mode) => {
                if (mode === 'profile') navigateToProfile(user!);
                else setViewMode(mode);
              }} 
            />
            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
              <div 
                className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                onClick={() => navigateToProfile(user!)}
              >
                <img src={user?.avatarUrl} alt="User" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.institution}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-center">
           <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">NITOR</h1>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 md:border-r border-slate-200 dark:border-slate-800 min-h-screen bg-white dark:bg-slate-950 pb-20 md:pb-0">
          
          <div className="hidden md:flex sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {viewMode === 'feed' ? 'Home' : 
               viewMode === 'profile' ? (selectedProfileUser?.handle || 'Profile') : 
               viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
            </h2>
          </div>
          
          {viewMode === 'feed' && (
              <Feed posts={posts} onPostClick={handleViewPost} isLoading={isLoading} />
          )}

          {viewMode === 'profile' && (
              <ProfileView 
                  user={selectedProfileUser || undefined} 
                  posts={selectedProfileUser ? posts.filter(p => p.author.id === selectedProfileUser.id) : []} 
                  onPostClick={handleViewPost} 
                  isLoading={isLoading && !selectedProfileUser}
              />
          )}
          
          {viewMode === 'notifications' && (
              <NotificationsView notifications={MOCK_NOTIFICATIONS} />
          )}

          {viewMode === 'explore' && (
              <div className="p-6">
                   <h2 className="text-xl font-bold mb-4 dark:text-slate-100">Explore</h2>
                   <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-12 text-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-700">
                      <p>Global graph visualization coming soon.</p>
                   </div>
              </div>
          )}
        </main>

        {/* Right Widgets */}
        <aside className="hidden lg:block w-80 p-6 sticky top-0 h-screen overflow-y-auto bg-white dark:bg-slate-950">
          <Widgets onNavigate={setViewMode} />
        </aside>

        {/* Mobile Bottom Navigation */}
        <MobileNav 
            currentView={viewMode} 
            setViewMode={(mode) => {
                if (mode === 'profile') navigateToProfile(user!);
                else setViewMode(mode);
            }}
            currentUser={user!}
        />

      </div>
    </HashRouter>
  );
};

export default App;
