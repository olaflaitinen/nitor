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
}

export const useNitorStore = create<NitorState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      needsOnboarding: false,
      viewMode: 'feed',
      isComposerOpen: false,
      toasts: [],

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
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user, needsOnboarding: state.needsOnboarding }), // Only persist auth data
    }
  )
);