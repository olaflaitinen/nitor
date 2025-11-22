
export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  institution: string;
  nitorScore: number; // Academic impact score
  verified: boolean;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  publicationsCount?: number;
  role?: string; // e.g., "Associate Professor of Physics"
  onboardingComplete?: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string; // Markdown/LaTeX supported
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: User;
  content: string; // Markdown supported
  timestamp: string;
  likes: number;
  reposts: number;
  comments: number;
  isArticle?: boolean; // If true, styled differently
  title?: string;
  abstract?: string;
  keywords?: string[];
  pinned?: boolean;
  commentsList?: Comment[]; // For MVP interactions
}

export interface Notification {
  id: string;
  type: 'citation' | 'follow' | 'reply' | 'endorse';
  actor: User;
  targetId?: string;
  targetPreview?: string;
  timestamp: string;
  read: boolean;
}

export type ViewMode = 'feed' | 'explore' | 'notifications' | 'profile' | 'composer' | 'article' | 'about' | 'privacy' | 'terms' | 'pricing' | 'settings';

export type ReportReason = 'plagiarism' | 'fabricated_data' | 'hate_speech' | 'copyright' | 'spam';

// --- CV / Resume Types ---

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string; // e.g. PhD, MSc
  fieldOfStudy: string;
  grade?: string;
  startDate: string;
  endDate?: string;
}

export interface Project {
  id: string;
  title: string;
  link?: string;
  technologies: string[];
  description: string;
}

export interface ExternalPublication {
  id: string;
  title: string;
  journal: string;
  date: string;
  doi?: string;
  link?: string;
}
