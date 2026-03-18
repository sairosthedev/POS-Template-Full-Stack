import { createSlice } from '@reduxjs/toolkit';

function calcTotals(items) {
  let total = 0;
  for (const i of items) total += Number(i.price) * Number(i.quantity);
  return { total };
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    paymentMethod: 'cash',
  },
  reducers: {
    addToCart(state, action) {
      const p = action.payload;
      const existing = state.items.find((i) => i.productId === p.productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...p, quantity: 1 });
      }
      state.total = calcTotals(state.items).total;
    },
    removeFromCart(state, action) {
      const productId = action.payload;
      state.items = state.items.filter((i) => i.productId !== productId);
      state.total = calcTotals(state.items).total;
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = String(action.payload || 'cash').toLowerCase();
    },
    setQuantity(state, action) {
      const { productId, quantity } = action.payload || {};
      const existing = state.items.find((i) => i.productId === productId);
      if (!existing) return;
      existing.quantity = Math.max(1, Number(quantity || 1));
      state.total = calcTotals(state.items).total;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setQuantity, setPaymentMethod } =
  cartSlice.actions;
export default cartSlice.reducer;

