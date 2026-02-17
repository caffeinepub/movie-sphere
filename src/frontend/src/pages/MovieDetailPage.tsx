import { useParams, Link } from '@tanstack/react-router';
import { useGetMovie } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Film } from 'lucide-react';

export default function MovieDetailPage() {
  const { movieId } = useParams({ from: '/movie/$movieId' });
  const { data: movie, isLoading } = useGetMovie(movieId);

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-6 h-10 w-32" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="mt-6 h-10 w-3/4" />
            <Skeleton className="mt-4 h-24 w-full" />
          </div>
          <div>
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
        <Film className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-bold">Movie not found</h2>
        <p className="mb-6 text-muted-foreground">The movie you're looking for doesn't exist</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Link>
        </Button>
      </div>
    );
  }

  // Get video source - prefer uploaded video blob, fallback to URL
  const videoSource = movie.videoBlob ? movie.videoBlob.getDirectURL() : null;

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="overflow-hidden rounded-lg bg-black">
            {videoSource ? (
              <video
                controls
                className="aspect-video w-full"
                poster={movie.posterImageUrl || undefined}
              >
                <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-muted">
                <div className="text-center">
                  <Film className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No video available</p>
                </div>
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div className="mt-6">
            <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{movie.title}</h1>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground">{movie.description}</p>
            </div>
          </div>
        </div>

        {/* Poster Sidebar */}
        <div>
          <div className="sticky top-24">
            <div className="overflow-hidden rounded-lg bg-muted">
              {movie.posterImageUrl ? (
                <img
                  src={movie.posterImageUrl}
                  alt={movie.title}
                  className="aspect-[2/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center">
                  <Film className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
