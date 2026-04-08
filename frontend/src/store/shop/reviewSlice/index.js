import api from "@/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    reviews: []
};

export const addReview = createAsyncThunk("/api/shop/review/addReview", async (formdata) => {
    const response = await api.post('/api/shop/review/add',formdata);
    return response.data;
});



export const getReviews = createAsyncThunk("/api/shop/review/getReviews", async (id) => {
    const response = await api.get(`/api/shop/review/${id}`);
    return response.data;
});



const ShopReviewSlice = createSlice({
    name: "shoppingReview",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(getReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload.data;
                
            })
            .addCase(getReviews.rejected, (state) => {
                state.isLoading = false;
                state.reviews = []
              
            })
            
    },
});
export default ShopReviewSlice.reducer;