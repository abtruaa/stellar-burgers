import constructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  initialState,
  moveIngredient
} from '../../services/slices/constructorSlice';

const mockBun = {
  _id: '1',
  name: 'Булка',
  type: 'bun' as const,
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: '',
  image_mobile: '',
  image_large: ''
};

const mockIngredient = {
  _id: '2',
  name: 'Котлета',
  type: 'main' as const,
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('constructor slice', () => {
  test('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('должен добавлять булку', () => {
    const state = constructorReducer(initialState, addIngredient(mockBun));
    expect(state.bun?._id).toBe(mockBun._id);
    expect(state.bun?.name).toBe(mockBun.name);
    expect(state.bun?.type).toBe(mockBun.type);
    expect(state.bun?.price).toBe(mockBun.price);
    expect(state.bun?.id).toBeDefined();
  });

  test('должен добавлять начинку', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(mockIngredient._id);
    expect(state.ingredients[0].name).toBe(mockIngredient.name);
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('должен удалять ингредиент по id', () => {
    let state = constructorReducer(initialState, addIngredient(mockIngredient));
    expect(state.ingredients).toHaveLength(1);

    const ingredientId = state.ingredients[0].id;
    state = constructorReducer(state, removeIngredient(ingredientId));
    expect(state.ingredients).toHaveLength(0);
  });

  test('должен очищать конструктор', () => {
    let state = constructorReducer(initialState, addIngredient(mockBun));
    state = constructorReducer(state, addIngredient(mockIngredient));

    expect(state.bun).not.toBeNull();
    expect(state.ingredients).toHaveLength(1);

    state = constructorReducer(state, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
  test('должен изменять порядок ингредиентов (moveIngredient)', () => {
    let state = constructorReducer(initialState, addIngredient(mockIngredient));
    state = constructorReducer(
      state,
      addIngredient({ ...mockIngredient, _id: '3', name: 'Соус' })
    );
    state = constructorReducer(
      state,
      addIngredient({ ...mockIngredient, _id: '4', name: 'Другая начинка' })
    );

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0].name).toBe('Котлета');
    expect(state.ingredients[1].name).toBe('Соус');
    expect(state.ingredients[2].name).toBe('Другая начинка');

    state = constructorReducer(state, moveIngredient({ from: 2, to: 0 }));

    expect(state.ingredients[0].name).toBe('Другая начинка');
    expect(state.ingredients[1].name).toBe('Котлета');
    expect(state.ingredients[2].name).toBe('Соус');
  });
});
