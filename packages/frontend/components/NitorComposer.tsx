
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Sparkles, X, Eye, Edit3, FileText, Zap, Loader2, Image } from 'lucide-react';
import { User, Post } from '../types';
import { refineText, generateAbstract } from '../services/geminiService';
import { useNitorStore } from '../store/useNitorStore';

interface NitorComposerProps {
  currentUser: User;
  onPublish: (post: Post) => void;
  onCancel: () => void;
}

type ComposerTab = 'update' | 'article';
type AIAction = 'refine' | 'abstract';

export const NitorComposer: React.FC<NitorComposerProps> = ({ currentUser, onPublish, onCancel }) => {
  const { addToast } = useNitorStore();
  const [activeTab, setActiveTab] = useState<ComposerTab>('update');
  const [previewMode, setPreviewMode] = useState(false);
  
  // Form State
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  
  // Processing State
  const [processingAction, setProcessingAction] = useState<AIAction | null>(null);
  const isThinking = processingAction !== null;

  // Metrics
  const charCount = content.length;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

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
      isArticle: activeTab === 'article',
      title: activeTab === 'article' ? title : undefined,
      abstract: activeTab === 'article' ? abstract : undefined,
      keywords: activeTab === 'article' ? keywords.split(',').map(k => k.trim()) : undefined,
    };
    onPublish(newPost);
  };

  const handleAIAction = async (action: AIAction) => {
    setProcessingAction(action);
    try {
      if (action === 'refine') {
        const refined = await refineText(content);
        setContent(refined);
        addToast('Text refined with Gemini AI', 'success');
      } else if (action === 'abstract') {
        // Generate Abstract for article
        if (title && content) {
          const genAbstract = await generateAbstract(title, content);
          setAbstract(genAbstract);
          addToast('Abstract generated successfully', 'success');
        }
      }
    } catch (error) {
      addToast('AI processing failed. Please try again.', 'error');
    } finally {
      setProcessingAction(null);
    }
  };

  // Modal backdrop logic handled by parent, but inner container needs to be responsive
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 md:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[100dvh] md:h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header & Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shrink-0">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" aria-label="Close Editor">
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
            
            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setActiveTab('update')}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'update' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Zap className="w-4 h-4" />
                Quick Update
              </button>
              <button
                onClick={() => setActiveTab('article')}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'article' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Research Article
              </button>
            </div>

            <div className="w-9" /> {/* Spacer */}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Input Column */}
          <div className={`
            flex-1 flex flex-col overflow-y-auto bg-white dark:bg-slate-900
            ${previewMode ? 'hidden md:flex' : 'flex'}
          `}>
            <div className="p-6 md:p-8 max-w-3xl mx-auto w-full space-y-6">
              
              {activeTab === 'article' && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <input
                    type="text"
                    placeholder="Title of Research"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 border-none focus:ring-0 p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Keywords (comma separated)"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full text-sm text-slate-600 dark:text-slate-400 placeholder:text-slate-400 dark:placeholder:text-slate-600 border-b border-transparent focus:border-slate-200 dark:focus:border-slate-700 focus:ring-0 p-0 pb-2 bg-transparent transition-colors"
                  />
                   <textarea
                    placeholder="Abstract..."
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    className="w-full h-24 resize-none text-slate-600 dark:text-slate-300 italic placeholder:text-slate-300 dark:placeholder:text-slate-600 border-l-2 border-slate-200 dark:border-slate-700 pl-4 focus:ring-0 focus:border-indigo-300 text-sm bg-transparent"
                  />
                </div>
              )}

              <div className="min-h-[200px] relative group flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={activeTab === 'article' ? "Write your methodology and findings..." : "Share a thought, equation, or finding..."}
                  className="w-full h-full resize-none border-none focus:ring-0 p-0 text-lg leading-relaxed text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 font-mono bg-transparent"
                  style={{ minHeight: '300px' }}
                />
                
                {/* Processing Indicator Tooltip */}
                {isThinking && (
                  <div className="absolute bottom-16 right-4 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl z-30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 border border-slate-800">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                      <span>
                        {processingAction === 'abstract' ? 'Generating abstract with Gemini...' : 'Refining text with Gemini...'}
                      </span>
                  </div>
                )}

                {/* Floating AI Buttons */}
                <div className="absolute bottom-2 right-2 flex gap-2">
                  {activeTab === 'article' && (
                    <button 
                      onClick={() => handleAIAction('abstract')}
                      disabled={isThinking || !content || !title}
                      className="bg-indigo-50 dark:bg-indigo-900/30 backdrop-blur border border-indigo-100 dark:border-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 disabled:opacity-70 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      {processingAction === 'abstract' ? 'Generating...' : 'Generate Abstract'}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleAIAction('refine')}
                    disabled={isThinking || !content}
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 disabled:opacity-70 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    {processingAction === 'refine' ? 'Refining...' : 'Refine Text'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Column (Split View) */}
          <div className={`
            flex-1 bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 overflow-y-auto
            ${previewMode ? 'flex' : 'hidden md:flex'}
          `}>
            <div className="p-8 md:p-10 w-full max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-lg prose-headings:font-serif prose-headings:font-bold">
              <div className="mb-6 pb-2 border-b border-slate-200/60 dark:border-slate-800/60 flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Live Preview</span>
                 <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">LaTeX Enabled</span>
              </div>

              {activeTab === 'article' && title && (
                <h1 className="mb-4">{title}</h1>
              )}
              
              {activeTab === 'article' && abstract && (
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm mb-8 not-prose">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Abstract</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">{abstract}</p>
                 </div>
              )}

              {content ? (
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {content}
                </ReactMarkdown>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                  <p className="mb-2">Nothing to preview yet.</p>
                  <p className="text-sm font-mono">{'Try typing $$ x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a} $$'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className="md:hidden flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-medium"
          >
            {previewMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          
          <div className="hidden md:flex items-center gap-3">
             <div className="flex gap-2 text-indigo-600 dark:text-indigo-400">
                <button className="p-2 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <Image className="w-5 h-5" />
                </button>
             </div>
             <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
             <span className="text-xs flex items-center text-slate-500 dark:text-slate-400">
                Supports <code className="mx-1 px-1.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 font-mono font-bold">$$LaTeX$$</code>
             </span>
             <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
             <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                {wordCount} words · {charCount} chars
             </span>
          </div>

          <button 
            onClick={handlePublish}
            disabled={!content}
            className="ml-auto bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white text-sm font-bold px-8 py-2.5 rounded-full shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
            Publish to Nitor
          </button>
        </div>

      </div>
    </div>
  );
};