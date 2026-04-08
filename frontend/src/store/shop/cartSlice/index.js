import api from "@/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    // cartItems: null,
    cartItems: { items: [] },
};







export const addToCart = createAsyncThunk(
    "/api/shop/cart/addToCart",
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await api.post("/api/shop/cart/add", {
                userId,
                productId,
                quantity,
            });

            // 🔥 THIS IS THE REAL FIX
            if (!response.data.success) {
                return rejectWithValue(response.data);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Error" });
        }
    }
);




export const fetchCartItems = createAsyncThunk("/api/shop/cart/fetchCartItems", async ({ userId }) => {
    if (!userId) {
        return { data: { items: [] } }; // ✅ SAFE RETURN
    }

    const response = await api.get(`/api/shop/cart/get/${userId}`);
    return response.data;
});

export const deleteCartItems = createAsyncThunk("/api/shop/cart/deleteCartItems", async ({ userId, productId }) => {
    const response = await api.delete(`/api/shop/cart/${userId}/${productId}`);
    return response.data;
});



export const updateCart = createAsyncThunk(
    "/api/shop/cart/updateCart",
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await api.put("/api/shop/cart/update-cart", {
                userId,
                productId,
                quantity,
            });

            if (!response.data.success) {
                return rejectWithValue(response.data);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);


const ShopCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload?.data || { items: [] };
            })
            .addCase(addToCart.rejected, (state,action) => {
                state.isLoading = false;
                    console.log("REJECTED PAYLOAD:", action.payload); // 🔥 ഇത് add ചെയ്യൂ

            })
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.cartItems = action.payload.data;
                state.cartItems = action.payload?.data || { items: [] };
            })
            .addCase(fetchCartItems.rejected, (state) => {
                state.isLoading = false;
                // state.cartItems = [];
                state.cartItems = { items: [] };
            })
            .addCase(updateCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.cartItems = action.payload.data;
                state.cartItems = action.payload?.data || { items: [] };
            })
            .addCase(updateCart.rejected, (state) => {
                state.isLoading = false;
                // state.cartItems = [];
                state.cartItems = { items: [] };
            })
            .addCase(deleteCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.cartItems = action.payload.data;
                state.cartItems = action.payload?.data || { items: [] };
            })
            .addCase(deleteCartItems.rejected, (state) => {
                state.isLoading = false;
                // state.cartItems = [];
                state.cartItems = { items: [] };
            });
    },
});

export default ShopCartSlice.reducer;

