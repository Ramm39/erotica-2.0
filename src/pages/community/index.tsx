import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CommunityCard } from '@/components/community/CommunityCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function CommunitiesPage() {
  const { data, isLoading } = useQuery('communities', () => api.getCommunities());

  const communities = data?.data || [];

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold text-text mb-8">Communities</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : communities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community: any) => (
              <Link key={community.id} href={`/community/${community.slug}`}>
                <CommunityCard community={community} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-textSecondary">No communities yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

