import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StoryCard } from '@/components/story/StoryCard';
import { ConfessionCard } from '@/components/confession/ConfessionCard';
import { Button } from '@/components/ui/Button';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  const { data: trendingStories } = useQuery('trending-stories', () =>
    api.getStories({ sort: 'popular', page: 1 }),
    { retry: false }
  );

  const { data: forYouStories } = useQuery(
    'for-you-stories',
    () => api.getForYouFeed(1),
    { enabled: isAuthenticated && !authLoading, retry: false }
  );

  const { data: trendingConfessions } = useQuery('trending-confessions', () =>
    api.getConfessions({ sort: 'popular', page: 1 }),
    { retry: false }
  );

  const { data: continueReading } = useQuery(
    'continue-reading',
    () => api.getBookmarks(),
    { enabled: isAuthenticated && !authLoading, retry: false }
  );

  const stories = isAuthenticated && forYouStories?.data ? forYouStories.data : trendingStories?.data || [];

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {/* Banner Carousel */}
        <section className="bg-gradient-to-r from-primaryDark to-primary py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                Discover Stories That Captivate
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Explore a world of stories, confessions, and community connections.
              </p>
              <div className="flex gap-4">
                <Link href="/stories">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Explore Stories
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link href="/auth/signup">
                    <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Continue Reading */}
          {isAuthenticated && continueReading?.data && continueReading.data.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-display font-semibold text-text flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Continue Reading
                </h2>
                <Link href="/profile/[username]" as={`/profile/${user?.username}`}>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {continueReading.data.slice(0, 3).map((story: any) => (
                  <StoryCard key={story.id} story={story} showProgress />
                ))}
              </div>
            </section>
          )}

          {/* For You / Trending Stories */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-semibold text-text flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                {isAuthenticated ? 'For You' : 'Trending Stories'}
              </h2>
              <Link href="/stories">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            {stories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.slice(0, 6).map((story: any) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-textSecondary mb-4">No stories yet. Be the first to share!</p>
                <Link href="/stories/create">
                  <Button>Start Writing</Button>
                </Link>
              </div>
            )}
          </section>

          {/* Trending Confessions */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-semibold text-text">
                Trending Confessions
              </h2>
              <Link href="/confessions">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            {trendingConfessions?.data && trendingConfessions.data.length > 0 ? (
              <div className="space-y-4">
                {trendingConfessions.data.slice(0, 5).map((confession: any) => (
                  <ConfessionCard key={confession.id} confession={confession} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-textSecondary mb-4">No confessions yet.</p>
                {isAuthenticated && (
                  <Link href="/confessions/create">
                    <Button>Share Your Confession</Button>
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-display font-semibold text-text mb-4">
              Explore Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['Romance', 'Forbidden', 'Fantasy', 'Contemporary', 'Historical', 'Erotic'].map(
                (category) => (
                  <Link
                    key={category}
                    href={`/stories?category=${category.toLowerCase()}`}
                    className="p-4 bg-card rounded-lg hover:bg-bgSecondary transition-colors text-center"
                  >
                    <span className="text-text font-medium">{category}</span>
                  </Link>
                )
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

