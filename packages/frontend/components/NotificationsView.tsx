
import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { Heart, Repeat2, MessageSquare, UserPlus, BookOpen } from 'lucide-react';
import { apiClient } from '../src/api/client';
import { Skeleton } from './ui/Skeleton';

interface NotificationsViewProps {}

export const NotificationsView: React.FC<NotificationsViewProps> = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.getNotifications(0, 50);

        // Map backend response to frontend Notification format
        const mappedNotifications: Notification[] = response.content.map((item: any) => ({
          id: item.id,
          type: item.type.toLowerCase(),
          actor: {
            id: item.actor.id,
            name: item.actor.fullName,
            handle: item.actor.handle,
            avatarUrl: item.actor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.actor.fullName)}&background=random`,
            institution: item.actor.institution || '',
            nitorScore: item.actor.nitorScore || 0,
            verified: item.actor.verified || false,
          },
          targetPreview: item.targetPreview || '',
          timestamp: new Date(item.createdAt).toLocaleDateString(),
          read: item.read || false,
        }));

        setNotifications(mappedNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);
  
  const getIcon = (type: string) => {
    switch(type) {
        case 'citation': return <BookOpen className="w-5 h-5 text-indigo-600 fill-indigo-50" />;
        case 'endorse': return <Heart className="w-5 h-5 text-pink-600 fill-pink-50" />;
        case 'reply': return <MessageSquare className="w-5 h-5 text-blue-500 fill-blue-50" />;
        case 'follow': return <UserPlus className="w-5 h-5 text-green-600 fill-green-50" />;
        default: return <div className="w-5 h-5 bg-slate-200 rounded-full" />;
    }
  };

  const getMessage = (n: Notification) => {
      switch(n.type) {
          case 'citation': return <span>cited your work in <span className="font-serif italic font-bold text-slate-800 dark:text-slate-200">{n.targetPreview}</span></span>;
          case 'endorse': return <span>endorsed your publication <span className="font-bold text-slate-700 dark:text-slate-300">{n.targetPreview}</span></span>;
          case 'reply': return <span>replied: <span className="text-slate-600 dark:text-slate-400">"{n.targetPreview}"</span></span>;
          case 'follow': return <span>followed you</span>;
          default: return 'interacted with you';
      }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 animate-in fade-in">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur z-10">
          <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Notifications</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex gap-4">
              <Skeleton className="w-5 h-5 rounded shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 animate-in fade-in">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur z-10">
            <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Notifications</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map(n => (
                <div key={n.id} className={`p-4 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-950/30' : ''}`}>
                    <div className="mt-1 shrink-0">
                        {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <img src={n.actor.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover" />
                            <span className="font-bold text-slate-900 dark:text-slate-100">{n.actor.name}</span>
                            <span className="text-slate-400 dark:text-slate-500 text-sm">· {n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {getMessage(n)}
                        </p>
                    </div>
                    {!n.read && <div className="w-2 h-2 bg-indigo-500 rounded-full self-center"></div>}
                </div>
            ))}

            {notifications.length === 0 && (
                <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                    <p>No new notifications.</p>
                </div>
            )}
        </div>
    </div>
  );
};
