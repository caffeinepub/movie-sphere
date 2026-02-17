import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import { ExternalBlob, type Movie } from '@/backend';

interface AddMovieParams {
  id: string;
  movie: Omit<Movie, 'videoBlob'>;
  videoFile?: File | null;
  onProgress?: (percentage: number) => void;
}

interface UpdateMovieParams {
  id: string;
  movie: Omit<Movie, 'videoBlob'>;
  videoFile?: File | null;
  onProgress?: (percentage: number) => void;
}

export function useAddMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, movie, videoFile, onProgress }: AddMovieParams) => {
      if (!actor) throw new Error('Actor not available');
      
      // First, add the movie without video
      const movieData: Movie = {
        ...movie,
        videoBlob: undefined,
      };
      
      await actor.addMovie(id, movieData);
      
      // Then, if a video file is provided, upload it
      if (videoFile) {
        const arrayBuffer = await videoFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        
        let externalBlob = ExternalBlob.fromBytes(bytes);
        
        // Add progress tracking if callback provided
        if (onProgress) {
          externalBlob = externalBlob.withUploadProgress(onProgress);
        }
        
        await actor.uploadMovieVideo(id, externalBlob);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Movie added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add movie');
    },
  });
}

export function useUpdateMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, movie, videoFile, onProgress }: UpdateMovieParams) => {
      if (!actor) throw new Error('Actor not available');
      
      // First, update the movie metadata
      const movieData: Movie = {
        ...movie,
        videoBlob: undefined,
      };
      
      await actor.updateMovie(id, movieData);
      
      // Then, if a new video file is provided, upload it
      if (videoFile) {
        const arrayBuffer = await videoFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        
        let externalBlob = ExternalBlob.fromBytes(bytes);
        
        // Add progress tracking if callback provided
        if (onProgress) {
          externalBlob = externalBlob.withUploadProgress(onProgress);
        }
        
        await actor.uploadMovieVideo(id, externalBlob);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Movie updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update movie');
    },
  });
}

export function useDeleteMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMovie(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Movie deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete movie');
    },
  });
}
