import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { MathErrorBoundary } from './MathErrorBoundary';

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className }) => {
  return (
    <MathErrorBoundary>
      <div 
        className={className} 
        aria-label="Mathematical content" 
        role="article"
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
              p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </MathErrorBoundary>
  );
};

export default MathRenderer;