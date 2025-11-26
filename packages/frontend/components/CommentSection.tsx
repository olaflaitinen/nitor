import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { MessageSquare, ThumbsUp, CornerDownRight, Send } from 'lucide-react';
import { Comment, User } from '../types';
import { apiClient } from '../src/api/client';
import { Skeleton } from './ui/Skeleton';

interface CommentSectionProps {
  postId: string;
  currentUser: User;
}

const CommentItem: React.FC<{ comment: Comment; depth: number; onReply: (id: string, author: string) => void }> = ({ comment, depth, onReply }) => {
  // Limit nesting depth visual indentation to avoid squeezing
  const indentClass = depth > 0 ? 'ml-4 md:ml-8 border-l-2 border-slate-100 dark:border-slate-800 pl-4' : '';

  return (
    <div className={`mt-4 ${indentClass} animate-in fade-in slide-in-from-top-1 duration-300`}>
        <div className="flex gap-3">
            <img src={comment.author.avatarUrl} alt={comment.author.name} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" />
            <div className="flex-1">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{comment.author.name}</span>
                        <span className="text-xs text-slate-400">{comment.timestamp}</span>
                    </div>
                    <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {comment.content}
                        </ReactMarkdown>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-1 ml-2">
                    <button className="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> {comment.likes}
                    </button>
                    <button 
                        onClick={() => onReply(comment.id, comment.author.name)}
                        className="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                    >
                        <MessageSquare className="w-3 h-3" /> Reply
                    </button>
                </div>
            </div>
        </div>
        {/* Recursive Rendering for Replies */}
        {comment.replies && comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
        ))}
    </div>
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{id: string, name: string} | null>(null);

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await apiClient.getComments(postId, 0, 100);

        // Map backend response to frontend Comment format
        const mappedComments: Comment[] = response.content.map((item: any) => ({
          id: item.id,
          author: {
            id: item.author.id,
            name: item.author.fullName,
            handle: item.author.handle,
            avatarUrl: item.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.author.fullName)}&background=random`,
            institution: item.author.institution || '',
            nitorScore: item.author.nitorScore || 0,
            verified: item.author.verified || false,
          },
          content: item.body,
          timestamp: new Date(item.createdAt).toLocaleDateString(),
          likes: item.likesCount || 0,
          replies: [], // TODO: Handle nested comments from backend
        }));

        setComments(mappedComments);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async () => {
      if(!newComment.trim()) return;

      setIsSubmitting(true);
      try {
        const createdComment = await apiClient.createComment(
          postId,
          newComment,
          replyTo?.id
        );

        // Map the created comment to frontend format
        const mappedComment: Comment = {
          id: createdComment.id,
          author: {
            id: currentUser.id,
            name: currentUser.name,
            handle: currentUser.handle,
            avatarUrl: currentUser.avatarUrl,
            institution: currentUser.institution || '',
            nitorScore: currentUser.nitorScore || 0,
            verified: currentUser.verified || false,
          },
          content: createdComment.body,
          timestamp: 'Just now',
          likes: 0,
          replies: [],
        };

        // Add the new comment to the list
        setComments((prev) => [mappedComment, ...prev]);
        setNewComment('');
        setReplyTo(null);
      } catch (error: any) {
        console.error('Failed to post comment:', error);
        alert(error.response?.data?.message || 'Failed to post comment');
      } finally {
        setIsSubmitting(false);
      }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
            Discussion <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full text-xs">{comments.length}</span>
        </h3>

        {/* Mini Editor */}
        <div className="flex gap-3 mb-8">
            <img src={currentUser.avatarUrl} alt="Me" className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 mt-1" />
            <div className="flex-1 relative group">
                {replyTo && (
                    <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 mb-2 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded w-fit">
                        <CornerDownRight className="w-3 h-3" />
                        Replying to {replyTo.name}
                        <button onClick={() => setReplyTo(null)} className="hover:text-indigo-800 dark:hover:text-indigo-300 ml-1 font-bold">×</button>
                    </div>
                )}
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add to the scientific debate (LaTeX supported)..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm min-h-[80px] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-y font-mono placeholder:font-sans text-slate-900 dark:text-slate-100"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!newComment.trim() || isSubmitting}
                        className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 text-right">Supports Markdown & <span className="font-mono">$$LaTeX$$</span></p>
            </div>
        </div>

        {/* Threaded List */}
        {isLoading ? (
          <div className="space-y-4 pb-20">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-2 pb-20">
            {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} depth={0} onReply={(id, name) => setReplyTo({id, name})} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            <p>No comments yet. Start the discussion!</p>
          </div>
        )}
    </div>
  );
};