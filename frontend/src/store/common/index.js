import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/config/api";

const initialState = {
    isLoading: true,
    featureImageList: [],
};

export const getFeatureImages = createAsyncThunk("/api/common/getFeatureImages", async () => {
    const response = await api.get("/api/common/feature/get");
    return response.data;
});

export const addFeatureImages = createAsyncThunk("/api/common/addFeatureImages", async (image) => {
    const response = await api.post("/api/common/feature/add", {image});
    return response.data;
});

const FeatureSlice = createSlice({
    name: "feature",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFeatureImages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFeatureImages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.featureImageList = action.payload.data;
            })
            .addCase(getFeatureImages.rejected, (state) => {
                state.isLoading = false;
                state.featureImageList = [];
            });
    },
});

export default FeatureSlice.reducer;
