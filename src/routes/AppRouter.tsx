import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard } from '@/guards/Auth.guard';
import { appRoutes } from '@/routes';
import { DashboardPage } from '@/pages/inspections/DashboardPage';
import { ControlledFormPage, UncontrolledFormPage, ReactHookFormPage } from '@/pages/forms';
import {
  ConceptsHomePage,
  UseStatePage,
  UseEffectPage,
  UseRefPage,
  UseMemoCallbackPage,
  StableReferencesPage,
  UseReducerPage,
  ContextApiPage,
  CustomHooksPage,
  ReduxPage,
  StyledComponentsPage,
  HooksPatternPage,
  CompoundPatternPage,
  ContainerPresentationalPage,
  RenderPropsPage,
  AIUIPatternPage,
  UseTransitionPage,
} from '@/pages/concepts';

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
      // Home
      {
        path: appRoutes.HOME,
        element: <ConceptsHomePage />,
      },
      // Dashboard
      {
        path: appRoutes.DASHBOARD,
        element: <DashboardPage />,
      },
      // Concepts
      {
        path: appRoutes.CONCEPTS_USE_STATE,
        element: <UseStatePage />,
      },
      {
        path: appRoutes.CONCEPTS_USE_EFFECT,
        element: <UseEffectPage />,
      },
      {
        path: appRoutes.CONCEPTS_USE_REF,
        element: <UseRefPage />,
      },
      {
        path: appRoutes.CONCEPTS_USE_MEMO_CALLBACK,
        element: <UseMemoCallbackPage />,
      },
      {
        path: appRoutes.CONCEPTS_STABLE_REFERENCES,
        element: <StableReferencesPage />,
      },
      {
        path: appRoutes.CONCEPTS_USE_REDUCER,
        element: <UseReducerPage />,
      },
      {
        path: appRoutes.CONCEPTS_USE_TRANSITION,
        element: <UseTransitionPage />,
      },
      {
        path: appRoutes.CONCEPTS_CONTEXT_API,
        element: <ContextApiPage />,
      },
      {
        path: appRoutes.CONCEPTS_CUSTOM_HOOKS,
        element: <CustomHooksPage />,
      },
      {
        path: appRoutes.CONCEPTS_REDUX,
        element: <ReduxPage />,
      },
      {
        path: appRoutes.CONCEPTS_STYLED_COMPONENTS,
        element: <StyledComponentsPage />,
      },
      // Design Patterns
      {
        path: appRoutes.PATTERNS_HOOKS,
        element: <HooksPatternPage />,
      },
      {
        path: appRoutes.PATTERNS_COMPOUND,
        element: <CompoundPatternPage />,
      },
      {
        path: appRoutes.PATTERNS_CONTAINER_PRESENTATIONAL,
        element: <ContainerPresentationalPage />,
      },
      {
        path: appRoutes.PATTERNS_RENDER_PROPS,
        element: <RenderPropsPage />,
      },
      {
        path: appRoutes.PATTERNS_AI_UI,
        element: <AIUIPatternPage />,
      },
      // Forms
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
    element: <Navigate to={appRoutes.HOME} replace />,
  },
]);
