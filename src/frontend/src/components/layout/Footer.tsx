import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'movie-sphere';

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            Built with <Heart className="h-4 w-4 fill-amber-500 text-amber-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-amber-500"
            >
              caffeine.ai
            </a>
          </p>
          <p>© {currentYear} Movie Sphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
