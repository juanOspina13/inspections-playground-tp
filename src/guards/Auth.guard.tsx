import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { appRoutes } from '@/routes';

export const AuthGuard = () => {
  const loggedIn = useAppSelector((state) => state.user.isLoggedIn);
  return loggedIn ? <Outlet /> : <Navigate to={appRoutes.LOGIN} />;
};
