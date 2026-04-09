import {
  ConstructorPage,
  Feed,
  NotFound404,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppHeader, IngredientDetails, OrderInfo, Modal } from '@components';
import { Preloader } from '@ui';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

const App = () => {
  const dispatch = useDispatch();
  const {
    ingredients,
    isLoading: ingredientsLoading,
    error
  } = useSelector((state) => state.ingredients);

  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    if (!ingredients.length && !ingredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, ingredientsLoading]);

  if (ingredientsLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          Ошибка: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Публичные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Страница заказа из ленты (без модалки) */}
        <Route path='/feed/:number' element={<OrderInfo />} />

        {/* Маршруты для НЕ авторизованных пользователей */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищенные маршруты (только для авторизованных) */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* Маршрут 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => window.history.back()}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title='Детали заказа'
                  onClose={() => window.history.back()}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
