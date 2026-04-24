// src/__tests__/services/rootReducer.test.ts
import { rootReducer } from '../../services/store';
import { initialState as ingredientsInitialState } from '../../services/slices/ingredientsSlice';
import { initialState as constructorInitialState } from '../../services/slices/constructorSlice';
import { initialState as userInitialState } from '../../services/slices/userSlice';
import { initialState as feedInitialState } from '../../services/slices/feedSlice';

describe('rootReducer', () => {
  test('должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    // Проверяем, что начальное состояние соответствует ожидаемому
    expect(initialState.ingredients).toEqual(ingredientsInitialState);
    expect(initialState.burgerConstructor).toEqual(constructorInitialState);
    expect(initialState.user).toEqual(userInitialState);
    expect(initialState.feed).toEqual(feedInitialState);
  });
});