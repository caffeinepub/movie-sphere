import { Link, useNavigate } from '@tanstack/react-router';
import { Film } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import { useAuthorization } from '@/hooks/useAuthorization';

export default function Header() {
  const navigate = useNavigate();
  const { isAdmin } = useAuthorization();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img
              src="/assets/generated/movie-sphere-logo.dim_512x512.png"
              alt="Movie Sphere"
              className="h-10 w-10 rounded-lg"
            />
            <span className="text-xl font-bold tracking-tight">Movie Sphere</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: 'text-foreground' }}
            >
              Catalog
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: 'text-foreground' }}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        <LoginButton />
      </div>
    </header>
  );
}
