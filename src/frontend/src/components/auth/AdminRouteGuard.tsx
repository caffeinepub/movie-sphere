import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthorization } from '@/hooks/useAuthorization';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAdmin, isLoading } = useAuthorization();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate({ to: '/access-denied' });
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
