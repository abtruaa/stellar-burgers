// src/pages/profile-orders/profile-orders.tsx
import { FC, useEffect } from 'react';
import { OrdersList } from '@components';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/profileOrderSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(
    (state) => state.profileOrders
  );
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && orders.length === 0 && !isLoading) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, user, orders.length, isLoading]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!orders || orders.length === 0) {
    return <div>У вас пока нет заказов</div>;
  }

  return <OrdersList orders={orders} />;
};
