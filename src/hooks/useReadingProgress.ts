import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export function useReadingProgress(storyId: string) {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<{ position: number; percentage: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated && storyId) {
      loadProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId, isAuthenticated]);

  const loadProgress = async () => {
    try {
      const response = await api.getProgress(storyId);
      if (response.data || response) {
        const data = response.data || response;
        setProgress({
          position: data.position || 0,
          percentage: data.percentage || 0,
        });
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const saveProgress = useCallback(
    async (position: number, percentage: number) => {
      if (!isAuthenticated) {
        // Save to localStorage for guests
        localStorage.setItem(`reading_progress_${storyId}`, JSON.stringify({ position, percentage }));
        return;
      }

      if (isSaving) return;

      setIsSaving(true);
      try {
        await api.saveProgress(storyId, position, percentage);
        setProgress({ position, percentage });
      } catch (error) {
        console.error('Failed to save progress:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [storyId, isAuthenticated, isSaving]
  );

  // Load from localStorage for guests
  useEffect(() => {
    if (!isAuthenticated && storyId) {
      const saved = localStorage.getItem(`reading_progress_${storyId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProgress(parsed);
        } catch (error) {
          console.error('Failed to parse saved progress:', error);
        }
      }
    }
  }, [storyId, isAuthenticated]);

  return { progress, saveProgress, loadProgress };
}

