import { FC, useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const { ingredients } = useSelector((state) => state.ingredients);
  const { orders: feedOrders } = useSelector((state) => state.feed);
  const { orders: profileOrders } = useSelector((state) => state.profileOrders);
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allOrders = [...feedOrders, ...profileOrders];
    const foundOrder = allOrders.find(
      (order) => order.number === Number(number)
    );

    if (foundOrder) {
      setOrderData(foundOrder);
      setIsLoading(false);
    } else {
      dispatch(fetchOrderByNumber(Number(number)))
        .unwrap()
        .then((order) => {
          setOrderData(order);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch order:', err);
          setIsLoading(false);
        });
    }
  }, [dispatch, number, feedOrders, profileOrders]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: any, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: any) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
