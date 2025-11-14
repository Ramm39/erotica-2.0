import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ConfessionCard } from '@/components/confession/ConfessionCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ConfessionsPage() {
  const { isAuthenticated } = useAuth();
  const [sort, setSort] = useState<'popular' | 'recent'>('popular');

  const { data, isLoading, isFetching } = useQuery(
    ['confessions', sort],
    () => api.getConfessions({ sort, page: 1 }),
    {
      keepPreviousData: true,
    }
  );

  // For now, using simple pagination instead of infinite scroll
  const loadMoreRef = useInfiniteScroll(() => {}, false, isFetching || false);

  const confessions = data?.data || [];

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-text">Confessions</h1>
          {isAuthenticated && (
            <Link href="/confessions/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Share Confession
              </Button>
            </Link>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={sort === 'popular' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSort('popular')}
          >
            Popular
          </Button>
          <Button
            variant={sort === 'recent' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSort('recent')}
          >
            Recent
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : confessions.length > 0 ? (
          <>
            <div className="space-y-4">
              {confessions.map((confession: any) => (
                <ConfessionCard key={confession.id} confession={confession} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-textSecondary mb-4">No confessions yet.</p>
            {isAuthenticated && (
              <Link href="/confessions/create">
                <Button>Be the first to share</Button>
              </Link>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

