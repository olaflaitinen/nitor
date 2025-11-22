
import React from 'react';
import { Post } from '../types';
import { FeedCard } from './FeedCard';
import { Skeleton } from './ui/Skeleton';

interface FeedProps {
  posts: Post[];
  onPostClick?: (post: Post) => void;
  isLoading?: boolean;
}

export const FeedSkeleton: React.FC = () => {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 md:p-6 bg-white dark:bg-slate-900/40">
          <div className="flex gap-4">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 w-1/2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <div className="flex gap-6 pt-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Feed: React.FC<FeedProps> = ({ posts, onPostClick, isLoading }) => {
  if (isLoading) {
    return <FeedSkeleton />;
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800">
      {posts.map((post) => (
        <FeedCard 
          key={post.id} 
          post={post} 
          onClick={() => onPostClick?.(post)}
        />
      ))}
      {posts.length > 0 && (
        <div className="p-12 text-center text-slate-400 text-sm">
            <p>End of stream. Go conduct more research.</p>
        </div>
      )}
    </div>
  );
};
