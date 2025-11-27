
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
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { MobileNav } from './components/MobileNav';
import { AboutPage, PrivacyPage, TermsPage } from './components/StaticPages';
import { PricingPage } from './components/PricingPage';
import { SettingsPage } from './components/SettingsPage';
import { OnboardingPage } from './components/OnboardingPage';
import { ToastContainer } from './components/ui/Toast';
import { Post, ViewMode, User } from './types';
import { useNitorStore } from './store/useNitorStore';
import { apiClient } from './src/api/client';

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
      try {
        const response = await apiClient.getFeed(0, 20);

        // Map backend response to frontend Post format
        const mappedPosts: Post[] = response.content.map((item: any) => ({
          id: item.id,
          author: {
            id: item.author.id,
            name: item.author.fullName,
            handle: item.author.handle,
            avatarUrl: item.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.author.fullName)}&background=random`,
            institution: item.author.institution || '',
            nitorScore: item.author.nitorScore || 0,
            verified: item.author.verified || false,
            bio: item.author.bio || '',
          },
          content: item.body,
          timestamp: new Date(item.createdAt).toLocaleDateString(),
          likes: item.likesCount || 0,
          reposts: item.repostsCount || 0,
          comments: item.commentsCount || 0,
          isArticle: item.type === 'ARTICLE',
          title: item.title,
          abstract: item.abstract,
          keywords: item.keywords || [],
          pinned: false,
          commentsList: []
        }));

        setPosts(mappedPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        addToast("Failed to load feed", "error");
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPosts();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, addToast]);

  // Actions
  const handleCreatePost = async (newPost: Post) => {
    try {
      // Create content via API
      const createdContent = await apiClient.createContent({
        type: newPost.isArticle ? 'ARTICLE' : 'POST',
        body: newPost.content,
        title: newPost.title,
        abstract: newPost.abstract,
        keywords: newPost.keywords,
      });

      // Map the response to Post format and add to feed
      const mappedPost: Post = {
        id: createdContent.id,
        author: {
          id: user!.id,
          name: user!.name,
          handle: user!.handle,
          avatarUrl: user!.avatarUrl,
          institution: user!.institution || '',
          nitorScore: user!.nitorScore || 0,
          verified: user!.verified || false,
          bio: user!.bio || '',
        },
        content: createdContent.body,
        timestamp: new Date(createdContent.createdAt).toLocaleDateString(),
        likes: 0,
        reposts: 0,
        comments: 0,
        isArticle: createdContent.type === 'ARTICLE',
        title: createdContent.title,
        abstract: createdContent.abstract,
        keywords: createdContent.keywords || [],
        pinned: false,
        commentsList: []
      };

      setPosts((prev) => [mappedPost, ...prev]);
      closeComposer();
      addToast('Publication broadcasted successfully', 'success');
      setViewMode('feed');
    } catch (error: any) {
      console.error("Failed to create post:", error);
      addToast(error.response?.data?.message || "Failed to create post", "error");
    }
  };

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    setViewMode('article');
  };

  const navigateToProfile = (user: User) => {
    setSelectedProfileUser(user);
    setViewMode('profile');
  };

  // --- HASH NAVIGATION LISTENER ---
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // --- PUBLIC / STATIC ROUTES ---
  if (viewMode === 'about') return <AboutPage onBack={() => setViewMode('feed')} />;
  if (viewMode === 'privacy') return <PrivacyPage onBack={() => setViewMode('feed')} />;
  if (viewMode === 'terms') return <TermsPage onBack={() => setViewMode('feed')} />;
  if (viewMode === 'pricing') return <PricingPage onBack={() => setViewMode('feed')} />;

  // --- HASH ROUTES (Public) ---
  if (currentHash.startsWith('#/forgot-password')) {
    return <ForgotPasswordPage onBack={() => { window.location.hash = ''; }} />;
  }
  if (currentHash.startsWith('#/reset-password')) {
    const urlParams = new URLSearchParams(currentHash.split('?')[1]);
    const token = urlParams.get('token') || '';
    return <ResetPasswordPage onBack={() => { window.location.hash = ''; }} token={token} />;
  }
  if (currentHash.startsWith('#/terms')) {
    return <TermsPage onBack={() => { window.location.hash = ''; }} initialSection="tos" />;
  }
  if (currentHash.startsWith('#/integrity')) {
    return <TermsPage onBack={() => { window.location.hash = ''; }} initialSection="integrity" />;
  }

  // --- AUTH GUARD ---
  if (!isAuthenticated) {
    return <AuthPage onLogin={() => { }} />;
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
            <NotificationsView />
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
