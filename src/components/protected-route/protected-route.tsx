import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const isAuthenticated = !!user;

  // Если маршрут только для неавторизованных, а пользователь авторизован
  if (onlyUnAuth && isAuthenticated) {
    // Сохраняем путь, с которого пришли, или идем на главную
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Если маршрут для авторизованных, а пользователь не авторизован
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
