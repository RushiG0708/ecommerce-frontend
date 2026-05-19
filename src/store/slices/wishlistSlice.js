import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios.js";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/wishlist");
      return data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/wishlist", { productId });
      return data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/wishlist/${productId}`);
      return data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const moveToCart = createAsyncThunk(
  "wishlist/moveToCart",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.post(`/wishlist/${productId}/move-to-cart`);
      const { data } = await axios.get("/wishlist");
      return data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { wishlist: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    const fulfilled = (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
    };
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, fulfilled)
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, fulfilled)
      .addCase(removeFromWishlist.fulfilled, fulfilled)
      .addCase(moveToCart.fulfilled, fulfilled);
  },
});

export default wishlistSlice.reducer;
