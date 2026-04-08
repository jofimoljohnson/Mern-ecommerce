import api from "@/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
    "/api/shop/products/fetchAllFilteredProducts",
    async ({ filterParams, sortParams }) => {
        const params = new URLSearchParams();

        // ✅ FIX: array → comma string
        Object.keys(filterParams).forEach((key) => {
            if (filterParams[key]?.length > 0) {
                params.append(key, filterParams[key].join(","));
            }
        });

        if (sortParams) {
            params.append("sortBy", sortParams);
        }

        console.log("API PARAMS:", params.toString());

        const response = await api.get(`/api/shop/products/get?${params.toString()}`);

        return response.data;
    },
);

export const fetchProductDetails = createAsyncThunk("/api/shop/products/fetchProductDetails", async (id) => {
    const response = await api.get(`/api/shop/products/get/${id}`);
    return response.data;
});

const ShopProductSlice = createSlice({
    name: "shoppingProducts",
    initialState,
    reducers: {
        setProductDetails: (state) => {
            state.productDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFilteredProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = action.payload.data;
            })
            .addCase(fetchAllFilteredProducts.rejected, (state) => {
                state.isLoading = false;
                state.productList = [];
            })
            .addCase(fetchProductDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productDetails = action.payload.data;
            })
            .addCase(fetchProductDetails.rejected, (state) => {
                state.isLoading = false;
                state.productDetails = [];
            });
    },
});
export const {setProductDetails}=ShopProductSlice.actions
export default ShopProductSlice.reducer;
