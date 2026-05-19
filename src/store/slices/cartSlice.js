import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios.js";

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/cart");
      return data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/cart", payload);
      return data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/cart/${productId}`, { quantity });
      return data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/cart/${productId}`);
      return data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete("/cart/clear");
      return { items: [], totalPrice: 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    const fulfilled = (state, action) => {
      state.loading = false;
      state.cart = action.payload;
    };
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, fulfilled)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, fulfilled)
      .addCase(updateCartItem.fulfilled, fulfilled)
      .addCase(removeFromCart.fulfilled, fulfilled)
      .addCase(clearCart.fulfilled, fulfilled);
  },
});

export default cartSlice.reducer;
