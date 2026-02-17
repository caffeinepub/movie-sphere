import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { useAddMovie, useUpdateMovie } from '@/hooks/useMovieMutations';
import { useAuthorization } from '@/hooks/useAuthorization';
import type { Movie } from '@/backend';

interface MovieEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  movieId?: string;
  initialData?: Movie;
}

export default function MovieEditorDialog({
  open,
  onOpenChange,
  mode,
  movieId,
  initialData,
}: MovieEditorDialogProps) {
  const [formData, setFormData] = useState<Omit<Movie, 'videoBlob'>>({
    title: '',
    description: '',
    posterImageUrl: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { isAdmin } = useAuthorization();
  const { mutate: addMovie, isPending: isAdding } = useAddMovie();
  const { mutate: updateMovie, isPending: isUpdating } = useUpdateMovie();

  const isPending = isAdding || isUpdating;

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        posterImageUrl: initialData.posterImageUrl,
      });
      setVideoFile(null);
      setUploadProgress(0);
    } else if (open && mode === 'create') {
      setFormData({
        title: '',
        description: '',
        posterImageUrl: '',
      });
      setVideoFile(null);
      setUploadProgress(0);
    }
  }, [open, initialData, mode]);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    if (mode === 'create') {
      const id = Date.now().toString();
      addMovie(
        { id, movie: formData, videoFile, onProgress: setUploadProgress },
        {
          onSuccess: () => {
            onOpenChange(false);
            setUploadProgress(0);
          },
        }
      );
    } else if (mode === 'edit' && movieId) {
      updateMovie(
        { id: movieId, movie: formData, videoFile, onProgress: setUploadProgress },
        {
          onSuccess: () => {
            onOpenChange(false);
            setUploadProgress(0);
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Movie' : 'Edit Movie'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Fill in the details to add a new movie to your collection'
              : 'Update the movie information'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter movie title"
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter movie description"
              disabled={isPending}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="posterImageUrl">Poster Image URL</Label>
            <Input
              id="posterImageUrl"
              value={formData.posterImageUrl}
              onChange={(e) => setFormData({ ...formData, posterImageUrl: e.target.value })}
              placeholder="https://example.com/poster.jpg"
              disabled={isPending}
              type="url"
            />
          </div>

          {isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="videoFile">
                Upload Movie Video File
                {videoFile && <span className="ml-2 text-sm text-muted-foreground">(Admin only)</span>}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  disabled={isPending}
                  className="cursor-pointer"
                />
                {videoFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{videoFile.name}</span>
                  </div>
                )}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Uploading video...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !formData.title.trim() || !formData.description.trim()}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadProgress > 0 && uploadProgress < 100
                    ? `Uploading ${uploadProgress}%...`
                    : mode === 'create'
                      ? 'Adding...'
                      : 'Updating...'}
                </>
              ) : mode === 'create' ? (
                'Add Movie'
              ) : (
                'Update Movie'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
