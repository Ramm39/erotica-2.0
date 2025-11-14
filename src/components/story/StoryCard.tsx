import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Bookmark, Clock, Eye } from 'lucide-react';
import { Story } from '@/types';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { Avatar } from '@/components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';

interface StoryCardProps {
  story: Story;
  showProgress?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, showProgress = false }) => {
  return (
    <Link href={`/stories/${story.id}`}>
      <Card className="hover:bg-bgSecondary transition-colors cursor-pointer h-full flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl font-display font-semibold text-text mb-2 line-clamp-2">
            {story.title}
          </h3>
          <p className="text-textSecondary text-sm mb-4 line-clamp-3">
            {story.excerpt}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {story.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} label={tag} size="sm" />
            ))}
            {story.tags.length > 3 && (
              <Tag label={`+${story.tags.length - 3}`} size="sm" variant="secondary" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-bgSecondary">
          <div className="flex items-center gap-2">
            <Avatar
              src={story.author?.avatar}
              alt={story.author?.displayName || 'Author'}
              size="sm"
            />
            <div>
              <p className="text-sm text-textSecondary">{story.author?.displayName}</p>
              <p className="text-xs text-textMuted">
                {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-textMuted text-sm">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{story.stats?.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{story.stats?.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{story.stats?.comments || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{story.readTime}min</span>
            </div>
          </div>
        </div>
        {showProgress && story.progress && (
          <div className="mt-2">
            <div className="h-1 bg-bgSecondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${story.progress.percentage}%` }}
              />
            </div>
            <p className="text-xs text-textMuted mt-1">
              {Math.round(story.progress.percentage)}% read
            </p>
          </div>
        )}
      </Card>
    </Link>
  );
};

