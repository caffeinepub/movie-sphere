import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SiteLayout from './components/layout/SiteLayout';
import CatalogPage from './pages/CatalogPage';
import MovieDetailPage from './pages/MovieDetailPage';
import AdminMoviesPage from './pages/AdminMoviesPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import AdminRouteGuard from './components/auth/AdminRouteGuard';
import ProfileSetupModal from './components/auth/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: SiteLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CatalogPage,
});

const movieDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movie/$movieId',
  component: MovieDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <AdminMoviesPage />
    </AdminRouteGuard>
  ),
});

const accessDeniedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access-denied',
  component: AccessDeniedPage,
});

const routeTree = rootRoute.addChildren([indexRoute, movieDetailRoute, adminRoute, accessDeniedRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <ProfileSetupModal />
      <Toaster />
    </ThemeProvider>
  );
}
