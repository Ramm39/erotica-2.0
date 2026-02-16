import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StoryCard } from '@/components/story/StoryCard';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Bookmark, Users, MessageSquare, Edit } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'stories' | 'bookmarks' | 'communities' | 'activity'>('stories');

  const { data: userData } = useQuery(
    ['user', username],
    () => api.getUser(username as string),
    { enabled: !!username }
  );

  console.log("userData?.data",userData?.data)

  const { data: storiesData } = useQuery( 
    ['user-stories', username],
    () => api.getStories({ authorId: username as string }),
    { enabled: !!username && activeTab === 'stories' }
  );

  const { data: bookmarksData } = useQuery(
    'bookmarks',
    () => api.getBookmarks(),
    { enabled: !!username && activeTab === 'bookmarks' && currentUser?.username === username }
  );

  const user = userData?.data || userData;
  console.log("user",user)
  const isOwnProfile = currentUser?.username === username;
  const stories = storiesData?.data || [];
  const bookmarks = bookmarksData?.data || [];

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>User not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            <Avatar src={user.avatar} alt={user.displayName} size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-display font-bold text-text">{user.displayName}</h1>
                {user.role === 'author' && (
                  <Badge variant="primary">Author</Badge>
                )}
                {user.role === 'admin' && (
                  <Badge variant="danger">Admin</Badge>
                )}
              </div>
              <p className="text-textSecondary mb-4">@{user.username}</p>
              {user.bio && (
                <p className="text-textSecondary mb-4">{user.bio}</p>
              )}
              <div className="flex items-center gap-6 text-sm text-textSecondary">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{stories.length} stories</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>0 followers</span>
                </div>
              </div>
              {isOwnProfile && (
                <div className="flex gap-2 mt-4">
                  <Link href={`/profile/${username}/author`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Author Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    Edit Profile
                  </Button>
                </div>
              )}
              {!isOwnProfile && user.role === 'author' && (
                <Button className="mt-4" size="sm">
                  Start Writing
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-bgSecondary mb-6">
          <div className="flex gap-4">
            {[
              { id: 'stories', label: 'Stories', icon: BookOpen },
              { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
              { id: 'communities', label: 'Communities', icon: Users },
              { id: 'activity', label: 'Activity', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-textSecondary hover:text-text'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'stories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story: any) => (
                <StoryCard key={story.id} story={story} />
              ))}
              {stories.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-textSecondary">No stories yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookmarks' && isOwnProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark: any) => (
                <StoryCard key={bookmark.story?.id} story={bookmark.story} />
              ))}
              {bookmarks.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-textSecondary">No bookmarks yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'communities' && (
            <div className="text-center py-12">
              <p className="text-textSecondary">Communities feature coming soon.</p>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="text-center py-12">
              <p className="text-textSecondary">Activity feed coming soon.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

