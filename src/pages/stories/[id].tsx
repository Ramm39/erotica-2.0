import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StoryReader } from '@/components/story/StoryReader';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Bookmark, Share2, MessageCircle, Flag, Clock, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Comment } from '@/components/story/Comment';

export default function StoryDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: storyData, isLoading } = useQuery(
    ['story', id],
    () => api.getStory(id as string),
    { enabled: !!id }
  );

  const { data: commentsData } = useQuery(
    ['comments', id],
    () => api.getComments(id as string),
    { enabled: !!id }
  );

  const likeMutation = useMutation(() => api.likeStory(id as string), {
    onSuccess: () => {
      queryClient.invalidateQueries(['story', id]);
      toast.success('Story liked!');
    },
  });

  const bookmarkMutation = useMutation(() => api.bookmarkStory(id as string), {
    onSuccess: () => {
      queryClient.invalidateQueries(['story', id]);
      toast.success('Story bookmarked!');
    },
  });

  const commentMutation = useMutation(
    () => api.createComment(id as string, commentText),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', id]);
        setCommentText('');
        setShowCommentModal(false);
        toast.success('Comment posted!');
      },
    }
  );

  const reportMutation = useMutation(
    (reason: string) => api.reportContent('story', id as string, reason),
    {
      onSuccess: () => {
        setShowReportModal(false);
        toast.success('Report submitted');
      },
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const story = storyData?.data || storyData;

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Story not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Story Header */}
        <div className="mb-8">
          <nav className="text-sm text-textSecondary mb-4">
            <Link href="/stories" className="hover:text-text">
              Stories
            </Link>
            <span className="mx-2">/</span>
            <span>{story.title}</span>
          </nav>
          <h1 className="text-4xl font-display font-bold text-text mb-4">{story.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <Avatar src={story.author?.avatar} alt={story.author?.displayName || 'Author'} />
            <div>
              <p className="text-text font-medium">{story.author?.displayName}</p>
              <p className="text-sm text-textSecondary">
                {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {story.tags.map((tag: string) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
          <div className="flex items-center gap-6 text-textSecondary text-sm">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{story.stats?.views || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{story.readTime} min read</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="sticky top-16 z-30 bg-card border border-bgSecondary rounded-lg p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please sign in to like');
                  return;
                }
                likeMutation.mutate();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-bgSecondary transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>{story.stats?.likes || 0}</span>
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please sign in to bookmark');
                  return;
                }
                bookmarkMutation.mutate();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-bgSecondary transition-colors"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowCommentModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-bgSecondary transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{story.stats?.comments || 0}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-bgSecondary transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-bgSecondary transition-colors text-textSecondary"
          >
            <Flag className="w-5 h-5" />
            <span>Report</span>
          </button>
        </div>

        {/* Story Content */}
        <StoryReader story={story} />

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-display font-semibold text-text mb-6">
            Comments ({story.stats?.comments || 0})
          </h2>
          {isAuthenticated ? (
            <Card className="mb-6">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => commentMutation.mutate()}
                  disabled={!commentText.trim() || commentMutation.isLoading}
                >
                  Post Comment
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="mb-6 text-center">
              <p className="text-textSecondary mb-4">Sign in to comment</p>
              <Button onClick={() => router.push('/auth/login')}>Sign In</Button>
            </Card>
          )}
          <div className="space-y-4">
            {commentsData?.data?.map((comment: any) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </main>

      {/* Comment Modal */}
      <Modal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        title="Add Comment"
      >
        <Textarea
          placeholder="Write your comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={5}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => setShowCommentModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => commentMutation.mutate()}
            disabled={!commentText.trim() || commentMutation.isLoading}
          >
            Post
          </Button>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Content"
      >
        <div className="space-y-4">
          <p className="text-textSecondary">Why are you reporting this content?</p>
          {['Inappropriate', 'Spam', 'Copyright', 'Other'].map((reason) => (
            <Button
              key={reason}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                reportMutation.mutate(reason);
              }}
            >
              {reason}
            </Button>
          ))}
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

