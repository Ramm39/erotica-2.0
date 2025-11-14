import React from 'react';
import { Comment as CommentType } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentProps {
  comment: CommentType;
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <Card>
      <div className="flex gap-4">
        <Avatar src={comment.author?.avatar} alt={comment.author?.displayName || 'User'} size="sm" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-text">{comment.author?.displayName}</span>
            <span className="text-xs text-textMuted">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-textSecondary whitespace-pre-wrap mb-2">{comment.content}</p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-textSecondary hover:text-primary transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{comment.likes || 0}</span>
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <button className="text-sm text-textSecondary hover:text-text">
                {comment.replies.length} replies
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

