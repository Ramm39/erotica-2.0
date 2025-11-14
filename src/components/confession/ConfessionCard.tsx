import React from 'react';
import { Heart, Flame, Zap, HeartHandshake } from 'lucide-react';
import { Confession } from '@/types';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

interface ConfessionCardProps {
  confession: Confession;
}

const reactionIcons = {
  relatable: Heart,
  hot: Flame,
  wild: Zap,
  supportive: HeartHandshake,
};

const reactionColors = {
  relatable: 'text-pink-500',
  hot: 'text-orange-500',
  wild: 'text-purple-500',
  supportive: 'text-blue-500',
};

export const ConfessionCard: React.FC<ConfessionCardProps> = ({ confession }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const reactMutation = useMutation(
    (reaction: string) => api.reactToConfession(confession.id, reaction),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('confessions');
        toast.success('Reaction added!');
      },
      onError: () => {
        toast.error('Failed to add reaction');
      },
    }
  );

  const handleReaction = (reaction: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to react');
      return;
    }
    reactMutation.mutate(reaction);
  };

  return (
    <Card>
      <p className="text-text mb-4 whitespace-pre-wrap">{confession.content}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {confession.tags.map((tag) => (
          <Tag key={tag} label={tag} size="sm" />
        ))}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-bgSecondary">
        <div className="flex items-center gap-4">
          {Object.entries(confession.reactions).map(([key, count]) => {
            const Icon = reactionIcons[key as keyof typeof reactionIcons];
            const isActive = confession.userReaction === key;
            return (
              <button
                key={key}
                onClick={() => handleReaction(key)}
                className={cn(
                  'flex items-center gap-1 px-3 py-1 rounded-lg transition-colors',
                  isActive
                    ? reactionColors[key as keyof typeof reactionColors] + ' bg-primary/10'
                    : 'text-textSecondary hover:bg-bgSecondary'
                )}
                disabled={reactMutation.isLoading}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{count}</span>
              </button>
            );
          })}
        </div>
        <span className="text-xs text-textMuted">
          {formatDistanceToNow(new Date(confession.createdAt), { addSuffix: true })}
        </span>
      </div>
    </Card>
  );
};

