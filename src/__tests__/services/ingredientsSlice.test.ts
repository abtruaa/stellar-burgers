import ingredientsReducer, {
  fetchIngredients,
  initialState
} from '../../services/slices/ingredientsSlice';

describe('ingredients slice', () => {
  test('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('должен устанавливать isLoading в true при pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  test('должен записывать данные при fulfilled', () => {
    const mockIngredients = [{ _id: '1', name: 'Test' }];
    const action = { type: fetchIngredients.fulfilled.type, payload: mockIngredients };
    const state = ingredientsReducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('должен записывать ошибку при rejected', () => {
    const action = { type: fetchIngredients.rejected.type, error: { message: 'Ошибка' } };
    const state = ingredientsReducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});