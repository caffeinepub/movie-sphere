import { Link } from '@tanstack/react-router';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccessDeniedPage() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
      <div className="flex max-w-md flex-col items-center text-center">
        <ShieldAlert className="mb-6 h-20 w-20 text-destructive" />
        <h1 className="mb-3 text-3xl font-bold">Access Denied</h1>
        <p className="mb-8 text-muted-foreground">
          You don't have permission to access this page. Only administrators can manage movies.
        </p>
        <Button asChild>
          <Link to="/">Return to Catalog</Link>
        </Button>
      </div>
    </div>
  );
}
