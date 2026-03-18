import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { getProducts as getProductsFromDb, upsertProducts } from '../services/db';

export const refreshProducts = createAsyncThunk(
  'products/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/products');
      const products = Array.isArray(res.data) ? res.data : res.data?.data || [];
      await upsertProducts(products);
      const local = await getProductsFromDb({ limit: 200 });
      return { remoteCount: products.length, products: local };
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to load products';
      // fallback to local
      try {
        const local = await getProductsFromDb({ limit: 200 });
        return { remoteCount: 0, products: local, warning: msg };
      } catch {
        return rejectWithValue(msg);
      }
    }
  },
);

export const loadLocalProducts = createAsyncThunk('products/loadLocal', async () => {
  const products = await getProductsFromDb({ limit: 200 });
  return { products };
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    warning: null,
    lastRemoteCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadLocalProducts.fulfilled, (state, action) => {
        state.items = action.payload.products || [];
      })
      .addCase(refreshProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.warning = null;
      })
      .addCase(refreshProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products || [];
        state.lastRemoteCount = action.payload.remoteCount || 0;
        state.warning = action.payload.warning || null;
      })
      .addCase(refreshProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error?.message || 'Failed to load products';
      });
  },
});

export default productsSlice.reducer;

