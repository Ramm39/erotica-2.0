import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Tag } from '@/components/ui/Tag';
import { Input } from '@/components/ui/Input';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks/useDebounce';

const confessionSchema = z.object({
  content: z.string().min(50, 'Confession must be at least 50 characters').max(2000, 'Confession must be less than 2000 characters'),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
});

type ConfessionForm = z.infer<typeof confessionSchema>;

export default function CreateConfessionPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
  } = useForm<ConfessionForm>({
    resolver: zodResolver(confessionSchema),
    defaultValues: {
      tags: [],
    },
  });

  const content = watch('content', '');

  const createMutation = useMutation(
    (data: ConfessionForm) => api.createConfession({ content: data.content, tags: selectedTags }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('confessions');
        router.push('/confessions');
        toast.success('Confession posted!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to post confession');
      },
    }
  );

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?returnUrl=/confessions/create');
    }
  }, [isAuthenticated, router]);

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const onSubmit = (data: ConfessionForm) => {
    createMutation.mutate({ ...data, tags: selectedTags });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-text mb-8">Share Your Confession</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Textarea
              label="Your Confession"
              placeholder="Share your thoughts anonymously..."
              rows={10}
              {...register('content')}
              error={errors.content?.message}
            />
            <p className="mt-2 text-sm text-textSecondary">
              {content.length}/2000 characters
            </p>
          </div>

          <div>
            <Input
              label="Add Tags (optional)"
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

          <div className="flex gap-4">
            <Button type="submit" isLoading={createMutation.isLoading}>
              Post Confession
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

