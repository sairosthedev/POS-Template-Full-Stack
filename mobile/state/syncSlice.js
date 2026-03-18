import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { runSyncOnce } from '../services/sync';

export const syncNow = createAsyncThunk('sync/now', async (_, { rejectWithValue }) => {
  try {
    return await runSyncOnce();
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || 'Sync failed';
    return rejectWithValue(msg);
  }
});

const syncSlice = createSlice({
  name: 'sync',
  initialState: { status: 'idle', error: null, lastProcessed: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(syncNow.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(syncNow.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastProcessed = action.payload?.processed ?? 0;
      })
      .addCase(syncNow.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error?.message || 'Sync failed';
      });
  },
});

export default syncSlice.reducer;

