import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ViewMode, Post } from '../types';
import { CURRENT_USER } from '../constants';

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

  // UI State
  viewMode: ViewMode;
  isComposerOpen: boolean;
  toasts: Toast[];
  theme: 'light' | 'dark' | 'system';

  // Actions
  login: (isNewUser?: boolean) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setNeedsOnboarding: (needs: boolean) => void;

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
    (set) => ({
      user: null,
      isAuthenticated: false,
      needsOnboarding: false,
      viewMode: 'feed',
      isComposerOpen: false,
      toasts: [],
      theme: 'system',

      login: (isNewUser = false) => set({
          isAuthenticated: true,
          user: isNewUser ? { ...CURRENT_USER, name: 'New Scholar', handle: '@scholar', institution: 'Unverified' } : CURRENT_USER,
          needsOnboarding: isNewUser
      }),

      logout: () => set({ isAuthenticated: false, user: null, needsOnboarding: false }),

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

        // Auto remove after 3 seconds
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
        theme: state.theme
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on app load
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);