import { useState } from 'react';
import { useGetAllMovies } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Film } from 'lucide-react';
import MovieEditorDialog from '@/components/admin/MovieEditorDialog';
import MovieListItem from '@/components/admin/MovieListItem';

export default function AdminMoviesPage() {
  const { data: movies, isLoading } = useGetAllMovies();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Movie Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage your movie collection</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Movie
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : !movies || movies.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[40vh] flex-col items-center justify-center p-12 text-center">
            <Film className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No movies yet</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Get started by adding your first movie to the collection
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Movie
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {movies.map(([id, movie]) => (
            <MovieListItem key={id} id={id} movie={movie} />
          ))}
        </div>
      )}

      <MovieEditorDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />
    </div>
  );
}
