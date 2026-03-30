// src/services/slices/feedSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  console.log('Fetching feeds...');
  const response = await getFeedsApi();
  console.log('Feeds API response:', response);
  return response;
});

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('Feed loading...');
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        console.log('Feed loaded:', {
          ordersCount: state.orders.length,
          total: state.total,
          totalToday: state.totalToday
        });
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
        console.error('Feed error:', state.error);
      });
  }
});

export default feedSlice.reducer;
