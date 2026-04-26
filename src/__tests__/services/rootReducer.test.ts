import { rootReducer } from '../../services/store';
import burgerConstructorReducer, { initialState as constructorInitialState } from '../../services/slices/constructorSlice';
import ingredientsReducer, { initialState as ingredientsInitialState } from '../../services/slices/ingredientsSlice';
import userReducer, { initialState as userInitialState } from '../../services/slices/userSlice';
import feedReducer, { initialState as feedInitialState } from '../../services/slices/feedSlice';
import orderReducer, { initialState as orderInitialState } from '../../services/slices/orderSlice';
import profileOrdersReducer, { initialState as profileOrdersInitialState } from '../../services/slices/profileOrderSlice';
import store from '../../services/store';

describe('rootReducer', () => {
  test('должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);
    
    expect(state).toEqual({
      burgerConstructor: constructorInitialState,
      ingredients: ingredientsInitialState,
      user: userInitialState,
      feed: feedInitialState,
      order: orderInitialState,
      profileOrders: profileOrdersInitialState
    });
  });

  test('должен возвращать то же состояние при неизвестном экшене', () => {
    const prevState = store.getState();
    const state = rootReducer(prevState, { type: 'UNKNOWN_ACTION' });
    expect(state).toBe(prevState);
  });
});