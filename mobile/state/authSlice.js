import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, setAuthToken } from '../services/api';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'miccs.token';
const USER_KEY = 'miccs.user';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password } = {}, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      return res.data;
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Login failed';
      return rejectWithValue(msg);
    }
  },
);

export const pinLogin = createAsyncThunk(
  'auth/pinLogin',
  async ({ email, pin } = {}, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/pin-login', { email, pin });
      return res.data;
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'PIN login failed';
      return rejectWithValue(msg);
    }
  },
);

export const hydrateAuth = createAsyncThunk('auth/hydrate', async () => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const userRaw = await SecureStore.getItemAsync(USER_KEY);
  const user = userRaw ? JSON.parse(userRaw) : null;
  return { token: token || null, user };
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    status: 'idle',
    error: null,
    hydrated: false,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.hydrated = true;
      setAuthToken(null);
      SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
      SecureStore.deleteItemAsync(USER_KEY).catch(() => {});
    },
    setToken(state, action) {
      state.token = action.payload || null;
      setAuthToken(state.token);
      state.hydrated = true;
      if (state.token) SecureStore.setItemAsync(TOKEN_KEY, String(state.token)).catch(() => {});
    },
    setUser(state, action) {
      state.user = action.payload || null;
      state.hydrated = true;
      if (state.user) SecureStore.setItemAsync(USER_KEY, JSON.stringify(state.user)).catch(() => {});
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.token = action.payload?.token || null;
        state.user = action.payload?.user || null;
        state.hydrated = true;
        setAuthToken(state.token);
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const data = action.payload?.data || action.payload || {};
        const token = data?.token || data?.accessToken || action.payload?.token || action.payload?.accessToken || null;
        state.token = token;
        state.user = data?.user || action.payload?.user || null;
        state.hydrated = true;
        setAuthToken(token);
        if (token) SecureStore.setItemAsync(TOKEN_KEY, String(token)).catch(() => {});
        if (state.user) SecureStore.setItemAsync(USER_KEY, JSON.stringify(state.user)).catch(() => {});
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error?.message || 'Login failed';
        state.hydrated = true;
      });

    builder
      .addCase(pinLogin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(pinLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const data = action.payload?.data || action.payload || {};
        const token = data?.token || data?.accessToken || action.payload?.token || action.payload?.accessToken || null;
        state.token = token;
        state.user = data?.user || action.payload?.user || null;
        state.hydrated = true;
        setAuthToken(token);
        if (token) SecureStore.setItemAsync(TOKEN_KEY, String(token)).catch(() => {});
        if (state.user) SecureStore.setItemAsync(USER_KEY, JSON.stringify(state.user)).catch(() => {});
      })
      .addCase(pinLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error?.message || 'PIN login failed';
        state.hydrated = true;
      });
  },
});

export const { logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;

