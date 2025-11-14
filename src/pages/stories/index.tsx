import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StoryCard } from '@/components/story/StoryCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Skeleton } from '@/components/ui/Skeleton';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Search, Grid, List } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect } from 'react';

export default function StoriesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState((router.query.search as string) || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    router.query.tags ? (router.query.tags as string).split(',') : []
  );
  const [category, setCategory] = useState((router.query.category as string) || '');
  const [sort, setSort] = useState((router.query.sort as string) || 'popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading, isFetching } = useQuery(
    ['stories', debouncedSearch, selectedTags, category, sort],
    () =>
      api.getStories({
        tags: selectedTags,
        category: category || undefined,
        sort,
        page: 1,
      }),
    {
      keepPreviousData: true,
    }
  );

  const { data: tagsData } = useQuery(
    ['tags', tagInput],
    () => api.getTags(tagInput),
    {
      enabled: tagInput.length > 0,
    }
  );

  useEffect(() => {
    if (tagsData?.data) {
      setTagSuggestions(tagsData.data.map((t: any) => t.name));
    }
  }, [tagsData]);

  // For now, using simple pagination instead of infinite scroll
  const loadMoreRef = useInfiniteScroll(() => {}, false, isFetching || false);

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const stories = data?.data || [];

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold text-text mb-8">Stories</h1>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textMuted" />
              <Input
                type="search"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 bg-card border border-bgSecondary rounded-lg text-text"
            >
              <option value="popular">Popular</option>
              <option value="recent">Recent</option>
              <option value="most_commented">Most Commented</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'bg-card text-textSecondary'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'bg-card text-textSecondary'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tag Input */}
          <div className="relative">
            <Input
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  handleAddTag(tagInput.trim());
                }
              }}
            />
            {tagSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-card border border-bgSecondary rounded-lg shadow-lg">
                {tagSuggestions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className="w-full text-left px-4 py-2 hover:bg-bgSecondary transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Tag key={tag} label={tag} onRemove={() => handleRemoveTag(tag)} />
              ))}
              {selectedTags.length > 5 && (
                <p className="text-sm text-textMuted">
                  {selectedTags.length} tags selected — refine to get results
                </p>
              )}
            </div>
          )}

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {['All', 'Romance', 'Forbidden', 'Fantasy', 'Contemporary', 'Historical'].map((cat) => (
              <Button
                key={cat}
                variant={category === cat.toLowerCase() || (!category && cat === 'All') ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCategory(cat === 'All' ? '' : cat.toLowerCase())}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Stories Grid/List */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : stories.length > 0 ? (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {stories.map((story: any) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-textSecondary mb-4">No stories found. Try adjusting your filters.</p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedTags([]);
              setCategory('');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}


