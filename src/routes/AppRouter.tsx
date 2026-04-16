import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard } from '@/guards/Auth.guard';
import { appRoutes } from '@/routes';
import { DashboardPage } from '@/pages/inspections/DashboardPage';
import { ControlledFormPage, UncontrolledFormPage, ReactHookFormPage } from '@/pages/forms';

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
      {
        path: appRoutes.FORMS_CONTROLLED,
        element: <ControlledFormPage />,
      },
      {
        path: appRoutes.FORMS_UNCONTROLLED,
        element: <UncontrolledFormPage />,
      },
      {
        path: appRoutes.FORMS_HOOK_FORM,
        element: <ReactHookFormPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={appRoutes.DASHBOARD} replace />,
  },
]);
