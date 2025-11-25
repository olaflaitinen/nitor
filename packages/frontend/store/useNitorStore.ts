import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ViewMode } from '../types';
import { apiClient } from '../src/api/client';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface NitorState {
  // Session
  user: User | null;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  accessToken: string | null;
  refreshToken: string | null;

  // UI State
  viewMode: ViewMode;
  isComposerOpen: boolean;
  toasts: Toast[];
  theme: 'light' | 'dark' | 'system';

  // Actions
  register: (data: { email: string; password: string; fullName: string; handle: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setNeedsOnboarding: (needs: boolean) => void;
  loadCurrentUser: () => Promise<void>;

  setViewMode: (mode: ViewMode) => void;
  openComposer: () => void;
  closeComposer: () => void;
  addToast: (message: string, type: 'success' | 'error') => void;
  removeToast: (id: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Helper to apply theme
const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // System preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

export const useNitorStore = create<NitorState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      needsOnboarding: false,
      accessToken: null,
      refreshToken: null,
      viewMode: 'feed',
      isComposerOpen: false,
      toasts: [],
      theme: 'system',

      register: async (data) => {
        try {
          const response = await apiClient.register(data);

          // Store tokens
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          // Update state
          set({
            isAuthenticated: true,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: {
              id: response.user.id,
              name: response.user.fullName,
              handle: response.user.handle,
              email: response.user.email,
              avatarUrl: response.user.avatarUrl,
              institution: response.user.institution || '',
              bio: response.user.bio || '',
              nitorScore: response.user.nitorScore || 0,
              verified: response.user.verified || false,
            },
            needsOnboarding: true, // New users need onboarding
          });

          get().addToast('Account created successfully!', 'success');
        } catch (error: any) {
          get().addToast(error.response?.data?.message || 'Registration failed', 'error');
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        try {
          const response = await apiClient.login({ email, password });

          // Store tokens
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          // Update state
          set({
            isAuthenticated: true,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: {
              id: response.user.id,
              name: response.user.fullName,
              handle: response.user.handle,
              email: response.user.email,
              avatarUrl: response.user.avatarUrl,
              institution: response.user.institution || '',
              bio: response.user.bio || '',
              nitorScore: response.user.nitorScore || 0,
              verified: response.user.verified || false,
            },
            needsOnboarding: false,
          });

          get().addToast('Welcome back!', 'success');
        } catch (error: any) {
          get().addToast(error.response?.data?.message || 'Login failed', 'error');
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear everything
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({
            isAuthenticated: false,
            user: null,
            needsOnboarding: false,
            accessToken: null,
            refreshToken: null,
          });
          get().addToast('Logged out successfully', 'success');
        }
      },

      loadCurrentUser: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
          // Get user from stored data first
          const state = get();
          if (state.user) {
            // Refresh user data from API
            const profile = await apiClient.getProfile(state.user.id);
            set({
              user: {
                id: profile.id,
                name: profile.fullName,
                handle: profile.handle,
                email: profile.email,
                avatarUrl: profile.avatarUrl,
                institution: profile.institution || '',
                bio: profile.bio || '',
                nitorScore: profile.nitorScore || 0,
                verified: profile.verified || false,
              },
            });
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          // Token might be invalid
          set({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      },

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      setNeedsOnboarding: (needs) => set({ needsOnboarding: needs }),

      setViewMode: (mode) => set({ viewMode: mode }),

      openComposer: () => set({ isComposerOpen: true }),
      closeComposer: () => set({ isComposerOpen: false }),

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },

      addToast: (message, type) => {
        const id = Date.now().toString();
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));

        // Auto remove after 4 seconds
        setTimeout(() => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 4000);
      },

      removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'nitor-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        needsOnboarding: state.needsOnboarding,
        theme: state.theme,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on app load
        if (state) {
          applyTheme(state.theme);

          // Restore tokens to localStorage
          if (state.accessToken) {
            localStorage.setItem('accessToken', state.accessToken);
          }
          if (state.refreshToken) {
            localStorage.setItem('refreshToken', state.refreshToken);
          }
        }
      },
    }
  )
);
