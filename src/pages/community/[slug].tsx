import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Users, Pin } from 'lucide-react';

export default function CommunityDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showPostModal, setShowPostModal] = useState(false);

  const { data: communityData } = useQuery(
    ['community', slug],
    () => api.getCommunity(slug as string),
    { enabled: !!slug }
  );

  const joinMutation = useMutation(
    () => api.joinCommunity(slug as string),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['community', slug]);
        toast.success('Joined community!');
      },
    }
  );

  const community = communityData?.data || communityData;

  if (!community) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Community not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Community Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            <Avatar src={community.avatar} alt={community.name} size="xl" />
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold text-text mb-2">{community.name}</h1>
              <p className="text-textSecondary mb-4">{community.description}</p>
              <div className="flex items-center gap-6 text-sm text-textSecondary">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{community.memberCount} members</span>
                </div>
              </div>
              {isAuthenticated && (
                <div className="mt-4">
                  {community.isJoined ? (
                    <Button variant="ghost" disabled>
                      Joined
                    </Button>
                  ) : (
                    <Button
                      onClick={() => joinMutation.mutate()}
                      isLoading={joinMutation.isLoading}
                    >
                      Join Community
                    </Button>
                  )}
                  {community.isJoined && (
                    <Button className="ml-2" onClick={() => setShowPostModal(true)}>
                      Create Post
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {community.posts?.map((post: any) => (
            <Card key={post.id}>
              {post.isPinned && (
                <div className="flex items-center gap-2 mb-2 text-primary text-sm">
                  <Pin className="w-4 h-4" />
                  <span>Pinned</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <Avatar src={post.author?.avatar} alt={post.author?.displayName || 'User'} size="sm" />
                <div>
                  <p className="font-medium text-text">{post.author?.displayName}</p>
                  <p className="text-xs text-textSecondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-textSecondary whitespace-pre-wrap mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-textSecondary">
                <button className="hover:text-primary">Like ({post.reactions?.like || 0})</button>
                <button className="hover:text-primary">Comment ({post.comments || 0})</button>
              </div>
            </Card>
          ))}
          {(!community.posts || community.posts.length === 0) && (
            <div className="text-center py-12">
              <p className="text-textSecondary">No posts yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

