// Root Redux store setup for Miccs POS mobile app
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './state/authSlice.js';
import productsReducer from './state/productsSlice.js';
import cartReducer from './state/cartSlice.js';
import syncReducer from './state/syncSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    sync: syncReducer,
  },
});
