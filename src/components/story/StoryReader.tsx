'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Story } from '@/types';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { cn } from '@/utils/cn';

interface StoryReaderProps {
  story: Story;
}

export const StoryReader: React.FC<StoryReaderProps> = ({ story }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { progress, saveProgress } = useReadingProgress(story.id);
  const [readingMode, setReadingMode] = useState<'default' | 'large' | 'comfortable'>('default');
  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    if (!contentRef.current) return;

    const handleScroll = () => {
      const element = contentRef.current;
      if (!element) return;

      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      // Save progress every 5% or every 10 seconds
      if (percentage % 5 < 1 || Date.now() % 10000 < 100) {
        saveProgress(scrollTop, percentage);
      }
    };

    const element = contentRef.current;
    element.addEventListener('scroll', handleScroll, { passive: true });

    // Restore scroll position
    if (progress) {
      element.scrollTop = progress.position;
    }

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [story.id, progress, saveProgress]);

  const readingModeClasses = {
    default: 'text-lg',
    large: 'text-xl',
    comfortable: 'text-lg leading-relaxed',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const newSize = fontSize === 16 ? 18 : fontSize === 18 ? 20 : 16;
              setFontSize(newSize);
            }}
            className="px-3 py-1 bg-card rounded-lg hover:bg-bgSecondary transition-colors text-sm"
            aria-label="Adjust font size"
          >
            A{fontSize === 18 ? 'A' : fontSize === 20 ? 'AA' : 'A'}
          </button>
          <select
            value={readingMode}
            onChange={(e) => setReadingMode(e.target.value as any)}
            className="px-3 py-1 bg-card rounded-lg hover:bg-bgSecondary transition-colors text-sm border border-bgSecondary"
          >
            <option value="default">Default</option>
            <option value="large">Large</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </div>
        {progress && progress.percentage > 0 && (
          <div className="text-sm text-textSecondary">
            {Math.round(progress.percentage)}% read
          </div>
        )}
      </div>
      <div
        ref={contentRef}
        className={cn(
          'reading-mode prose prose-invert max-w-none',
          readingModeClasses[readingMode],
          'prose-headings:text-text prose-p:text-textSecondary prose-strong:text-text'
        )}
        style={{ fontSize: `${fontSize}px` }}
      >
        <div
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />
      </div>
    </div>
  );
};

