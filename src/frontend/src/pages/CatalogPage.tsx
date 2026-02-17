import { Link } from '@tanstack/react-router';
import { useGetAllMovies } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Film, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CatalogPage() {
  const { data: movies, isLoading } = useGetAllMovies();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/generated/movie-sphere-hero-bg.dim_1920x1080.png)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Welcome to Movie Sphere
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Discover and watch amazing movies from our curated collection
            </p>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="container py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Browse Movies</h2>
          <p className="text-muted-foreground">Explore our collection of films</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[2/3] w-full" />
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : !movies || movies.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <Film className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No movies yet</h3>
            <p className="text-sm text-muted-foreground">Check back soon for new additions to our catalog</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.map(([id, movie]) => (
              <Link key={id} to="/movie/$movieId" params={{ movieId: id }}>
                <Card className="group overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                    {movie.posterImageUrl ? (
                      <img
                        src={movie.posterImageUrl}
                        alt={movie.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Film className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="lg" className="gap-2">
                        <Play className="h-5 w-5" />
                        Watch Now
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{movie.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{movie.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
