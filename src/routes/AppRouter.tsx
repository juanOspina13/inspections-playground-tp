import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard } from '@/guards/Auth.guard';
import { appRoutes } from '@/routes';
import { DashboardPage } from '@/pages/inspections/DashboardPage';

export const router = createBrowserRouter([
  {
    path: appRoutes.LOGIN,
    lazy: async () => {
      const { LoginPage } = await import('@/pages/auth/LoginPage');
      return { Component: LoginPage };
    },
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: appRoutes.DASHBOARD,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={appRoutes.DASHBOARD} replace />,
  },
]);
