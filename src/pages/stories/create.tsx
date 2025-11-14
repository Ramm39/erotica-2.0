import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Tag } from '@/components/ui/Tag';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks/useDebounce';

const storySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(100, 'Story must be at least 100 characters'),
  category: z.string().min(1, 'Please select a category'),
  language: z.string().default('en'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
});

type StoryForm = z.infer<typeof storySchema>;

export default function CreateStoryPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDraft, setIsDraft] = useState(false);
  const debouncedTagInput = useDebounce(tagInput, 300);

  const { data: tagSuggestions } = useQuery(
    ['tags', debouncedTagInput],
    () => api.getTags(debouncedTagInput),
    { enabled: debouncedTagInput.length > 0 }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<StoryForm>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      language: 'en',
      tags: [],
    },
  });

  const content = watch('content', '');

  const createMutation = useMutation(
    (data: StoryForm) =>
      api.createStory({
        title: data.title,
        category: data.category,
        tags: selectedTags,
        language: data.language,
        content: data.content,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('stories');
        router.push('/stories');
        toast.success('Story submitted for review!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create story');
      },
    }
  );

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'author') {
      router.push('/auth/login?returnUrl=/stories/create');
    }
  }, [isAuthenticated, user, router]);

  // Auto-save draft
  useEffect(() => {
    const autoSave = setInterval(() => {
      const formData = watch();
      if (formData.title || formData.content) {
        localStorage.setItem('story_draft', JSON.stringify({ ...formData, tags: selectedTags }));
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(autoSave);
  }, [watch, selectedTags]);

  // Load draft
  useEffect(() => {
    const draft = localStorage.getItem('story_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        // Restore form data
        setSelectedTags(parsed.tags || []);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 10) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const onSubmit = (data: StoryForm) => {
    createMutation.mutate({ ...data, tags: selectedTags });
    localStorage.removeItem('story_draft');
  };

  if (!isAuthenticated || user?.role !== 'author') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-display font-bold text-text mb-8">Create Story</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Title"
            placeholder="Enter story title..."
            {...register('title')}
            error={errors.title?.message}
          />

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">
              Category
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-2 bg-card border border-bgSecondary rounded-lg text-text"
            >
              <option value="">Select category</option>
              <option value="romance">Romance</option>
              <option value="forbidden">Forbidden</option>
              <option value="fantasy">Fantasy</option>
              <option value="contemporary">Contemporary</option>
              <option value="historical">Historical</option>
              <option value="erotic">Erotic</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-danger">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">
              Language
            </label>
            <select
              {...register('language')}
              className="w-full px-4 py-2 bg-card border border-bgSecondary rounded-lg text-text"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <Input
              label="Add Tags"
              placeholder="Type and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  handleAddTag(tagInput.trim());
                }
              }}
            />
            {tagSuggestions?.data && tagSuggestions.data.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tagSuggestions.data.slice(0, 5).map((tag: any) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleAddTag(tag.name)}
                    className="px-3 py-1 bg-card border border-bgSecondary rounded-lg text-sm text-textSecondary hover:bg-bgSecondary"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
            {selectedTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Tag key={tag} label={tag} onRemove={() => handleRemoveTag(tag)} />
                ))}
              </div>
            )}
            {errors.tags && (
              <p className="mt-2 text-sm text-danger">{errors.tags.message}</p>
            )}
          </div>

          <div>
            <Textarea
              label="Story Content"
              placeholder="Write your story here..."
              rows={20}
              {...register('content')}
              error={errors.content?.message}
            />
            <p className="mt-2 text-sm text-textSecondary">
              {content.length} characters (minimum 100)
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" isLoading={createMutation.isLoading}>
              Submit for Review
            </Button>
            <Button variant="ghost" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

