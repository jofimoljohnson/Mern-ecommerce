import api from "@/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    searchResults: []
};

export const searchProducts = createAsyncThunk("/api/shop/search/searchProducts", async (keyword) => {
    const response = await api.get(`/api/shop/search/${keyword}`);
    return response.data;
});

const ShopSearchSlice = createSlice({
    name: "shoppingSearch",
    initialState,
    reducers: {
        resetSearchResults:(state)=>{
            state.searchResults=[]

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults = action.payload.data;
                
            })
            .addCase(searchProducts.rejected, (state) => {
                state.isLoading = false;
                state.searchResults = []
              
            });
    },
});
export const {resetSearchResults}=ShopSearchSlice.actions
export default ShopSearchSlice.reducer;