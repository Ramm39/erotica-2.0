import React from 'react';
import { Community } from '@/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Users } from 'lucide-react';

interface CommunityCardProps {
  community: Community;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  return (
    <Card className="hover:bg-bgSecondary transition-colors cursor-pointer h-full">
      <div className="flex items-center gap-4 mb-4">
        <Avatar src={community.avatar} alt={community.name} size="lg" />
        <div>
          <h3 className="text-xl font-display font-semibold text-text">{community.name}</h3>
          <div className="flex items-center gap-2 text-sm text-textSecondary">
            <Users className="w-4 h-4" />
            <span>{community.memberCount} members</span>
          </div>
        </div>
      </div>
      <p className="text-textSecondary text-sm line-clamp-2">{community.description}</p>
    </Card>
  );
};

