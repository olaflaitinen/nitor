import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Sparkles, Image, X } from 'lucide-react';
import { User, Post } from '../types';
import { refineText, generateAbstract } from '../services/geminiService';

interface EditorProps {
  currentUser: User;
  onPublish: (post: Post) => void;
  onCancel: () => void;
}

export const Editor: React.FC<EditorProps> = ({ currentUser, onPublish, onCancel }) => {
  const [content, setContent] = useState('');
  const [isArticle, setIsArticle] = useState(false);
  const [title, setTitle] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handlePublish = () => {
    if (!content.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser,
      content,
      timestamp: 'Just now',
      likes: 0,
      reposts: 0,
      comments: 0,
      isArticle,
      title: isArticle ? title : undefined,
    };
    onPublish(newPost);
  };

  const handleAIImprove = async () => {
    setIsThinking(true);
    const refined = await refineText(content);
    setContent(refined);
    setIsThinking(false);
  };

  const handleAIGenerate = async () => {
     if(!title) return;
     setIsThinking(true);
     const abstract = await generateAbstract(title, content || "Focus on academic significance.");
     setContent(abstract);
     setIsThinking(false);
  };

  return (
    <div className="p-4 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Editor Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
           <div className="flex items-center gap-3">
             <button onClick={onCancel} className="p-1 hover:bg-slate-100 rounded-full">
               <X className="w-5 h-5 text-slate-500" />
             </button>
             <h2 className="font-semibold text-slate-800">Create Publication</h2>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-xs font-medium text-slate-500">Type:</span>
             <div className="flex bg-slate-100 p-1 rounded-lg">
               <button 
                 onClick={() => setIsArticle(false)}
                 className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${!isArticle ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Update
               </button>
               <button 
                 onClick={() => setIsArticle(true)}
                 className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${isArticle ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Article
               </button>
             </div>
           </div>
        </div>

        <div className="p-6">
          {isArticle && (
            <div className="mb-6">
              <input 
                type="text" 
                placeholder="Title of your research..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-serif font-bold text-slate-900 placeholder:text-slate-300 border-none focus:ring-0 px-0 bg-transparent"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
            {/* Input Area */}
            <div className="flex flex-col h-full relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={isArticle ? "Write your abstract or findings (Markdown & LaTeX supported)..." : "What's happening in your field?"}
                className="flex-1 w-full resize-none border-none focus:ring-0 p-0 text-lg text-slate-800 placeholder:text-slate-400 font-mono bg-transparent leading-relaxed"
              />
              <div className="absolute bottom-0 right-0 flex gap-2">
                 {isArticle && (
                     <button 
                        onClick={handleAIGenerate}
                        disabled={isThinking || !title}
                        className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-indigo-100 disabled:opacity-50"
                     >
                        <Sparkles className="w-3 h-3" />
                        {isThinking ? 'Generating...' : 'Draft Abstract'}
                     </button>
                 )}
                 <button 
                    onClick={handleAIImprove}
                    disabled={isThinking || !content}
                    className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded flex items-center gap-1 hover:bg-slate-200 disabled:opacity-50"
                 >
                    <Sparkles className="w-3 h-3" />
                    {isThinking ? 'Refining...' : 'Refine'}
                 </button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="hidden md:block h-full overflow-y-auto bg-slate-50 rounded-xl p-4 border border-slate-100 prose prose-sm max-w-none">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2 sticky top-0 bg-slate-50 pb-2 border-b border-slate-100">Preview</p>
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {content}
                </ReactMarkdown>
              ) : (
                <div className="text-slate-400 italic flex items-center justify-center h-40">
                  <span className="text-sm">Preview will appear here. Try typing $$E=mc^2$$</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
           <div className="flex gap-2 text-indigo-600">
             <button className="p-2 hover:bg-indigo-50 rounded-full transition-colors">
               <Image className="w-5 h-5" />
             </button>
             <div className="h-9 w-px bg-slate-300 mx-2"></div>
             <span className="text-xs flex items-center text-slate-500">
                Supports <code className="mx-1 px-1 bg-slate-200 rounded text-slate-700 font-mono">$$LaTeX$$</code>
             </span>
           </div>

           <button 
             onClick={handlePublish}
             disabled={!content}
             className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
           >
             Publish
           </button>
        </div>

      </div>
    </div>
  );
};