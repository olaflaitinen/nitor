
import React from 'react';
import { Notification } from '../types';
import { Heart, Repeat2, MessageSquare, UserPlus, BookOpen } from 'lucide-react';

interface NotificationsViewProps {
  notifications: Notification[];
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ notifications }) => {
  
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
          case 'citation': return <span>cited your work in <span className="font-serif italic font-bold text-slate-800">{n.targetPreview}</span></span>;
          case 'endorse': return <span>endorsed your publication <span className="font-bold text-slate-700">{n.targetPreview}</span></span>;
          case 'reply': return <span>replied: <span className="text-slate-600">"{n.targetPreview}"</span></span>;
          case 'follow': return <span>followed you</span>;
          default: return 'interacted with you';
      }
  };

  return (
    <div className="min-h-screen bg-white animate-in fade-in">
        <div className="p-4 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur z-10">
            <h2 className="font-bold text-xl text-slate-900">Notifications</h2>
        </div>
        <div className="divide-y divide-slate-100">
            {notifications.map(n => (
                <div key={n.id} className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                    <div className="mt-1 shrink-0">
                        {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <img src={n.actor.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                            <span className="font-bold text-slate-900">{n.actor.name}</span>
                            <span className="text-slate-400 text-sm">· {n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {getMessage(n)}
                        </p>
                    </div>
                    {!n.read && <div className="w-2 h-2 bg-indigo-500 rounded-full self-center"></div>}
                </div>
            ))}
            
            {notifications.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                    <p>No new notifications.</p>
                </div>
            )}
        </div>
    </div>
  );
};
