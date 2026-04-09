import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { loginUserApi, registerUserApi, updateUserApi, getUserApi } from '@api';
import { setCookie } from '../../utils/cookie';

// Получение пользователя по токену
export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return null;
    }
    const response = await getUserApi();
    return response.user;
  } catch (error: any) {
    // Если ошибка авторизации, очищаем токены
    if (error.message === 'You should be authorised' || error.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    return null;
  }
});

// Логин
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await loginUserApi({ email, password });

    // Сохраняем токены
    localStorage.setItem('refreshToken', response.refreshToken);
    // Сохраняем accessToken в cookies (как ожидает API)
    setCookie('accessToken', response.accessToken);

    return response.user;
  }
);

// Регистрация
export const register = createAsyncThunk(
  'user/register',
  async ({
    name,
    email,
    password
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await registerUserApi({ name, email, password });

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  }
);

// Обновление пользователя
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: { name?: string; email?: string; password?: string }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

// Выход
export const logout = createAsyncThunk('user/logout', async () => {
  localStorage.removeItem('refreshToken');
  setCookie('accessToken', '', { expires: -1 }); // Удаляем cookie
  return null;
});

interface UserState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch user
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export default userSlice.reducer;
