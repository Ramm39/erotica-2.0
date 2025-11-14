import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TagProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md';
}

export const Tag: React.FC<TagProps> = ({
  label,
  onRemove,
  variant = 'default',
  size = 'md',
}) => {
  const variants = {
    default: 'bg-bgSecondary text-textSecondary',
    primary: 'bg-primary/20 text-primary border border-primary/30',
    secondary: 'bg-card text-text border border-bgSecondary',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        variants[variant],
        sizes[size]
      )}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-black/20 p-0.5 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

