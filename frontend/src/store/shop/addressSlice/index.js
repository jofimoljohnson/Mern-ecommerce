import api from "@/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    addressList: [],
};

export const addNewAddress = createAsyncThunk("/api/shop/address/addNewAddress", async (formData) => {
    const response = await api.post("/api/shop/address/add", formData);
    return response.data;
});

export const fetchAllAddress = createAsyncThunk("/api/shop/address/fetchAllAddress", async ({ userId }) => {
    const response = await api.get(`/api/shop/address/get/${userId}`);
    return response.data;
});

export const editAddress = createAsyncThunk("/api/shop/address/editAddress", async ({ userId, addressId, formData }) => {
    const response = await api.put(`/api/shop/address/update/${userId}/${addressId}`, formData);
    return response.data;
});

export const deleteAddress = createAsyncThunk("/api/shop/address/deleteAddress", async ({ userId, addressId }) => {
    const response = await api.delete(`/api/shop/address/delete/${userId}/${addressId}`);
    return response.data;
});

const ShopAddresstSlice = createSlice({
    name: "shoppingAddress",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addNewAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewAddress.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addNewAddress.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchAllAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addressList = action.payload.data;
            })
            .addCase(fetchAllAddress.rejected, (state) => {
                state.isLoading = false;
                state.addressList = [];
            });
    },
});

export default ShopAddresstSlice.reducer;
