import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { fetchUserOrders } from '../../services/slices/profileOrderSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { user } = useSelector((state) => state.user);
  const { isLoading: orderRequest, order } = useSelector(
    (state) => state.order
  );

  const orderModalData: TOrder | null = order
    ? {
        _id: '',
        status: '',
        name: order.name,
        createdAt: '',
        updatedAt: '',
        number: order.number,
        ingredients: []
      }
    : null;

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(orderData))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
        // После успешного создания заказа обновляем историю
        dispatch(fetchUserOrders());
      })
      .catch((err) => {
        console.error('Order creation failed:', err);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
