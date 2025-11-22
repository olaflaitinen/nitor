
import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { enhanceBio } from '../../services/geminiService';
import { useNitorStore } from '../../store/useNitorStore';

interface AITextEnhancerProps {
  value: string;
  onEnhance: (newValue: string) => void;
  context: 'bio' | 'experience' | 'project';
  className?: string;
}

export const AITextEnhancer: React.FC<AITextEnhancerProps> = ({ value, onEnhance, context, className }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { addToast } = useNitorStore();

  const handleEnhance = async () => {
    if (!value.trim()) {
        addToast("Please enter some text first.", "error");
        return;
    }
    
    setIsEnhancing(true);
    try {
        const enhancedText = await enhanceBio(value, context);
        onEnhance(enhancedText);
        addToast("Text enhanced with AI Scribe", "success");
    } catch (error) {
        addToast("Failed to enhance text", "error");
    } finally {
        setIsEnhancing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleEnhance}
      disabled={isEnhancing || !value}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors text-xs font-medium border border-indigo-200 dark:border-indigo-800 ${className}`}
    >
      {isEnhancing ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
      {isEnhancing ? 'Improving...' : 'Enhance with AI'}
    </button>
  );
};
