import api from "@/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderList: [],
    orderDetails: null,
};

export const getAllOrdersByAdmin = createAsyncThunk("/api/admin/orders/getAllOrdersByAdmin", async () => {
    const response = await api.get("/api/admin/orders/get");
    return response.data;
});

export const getOrderDetailsForAdmin = createAsyncThunk("/api/admin/orders/getOrderDetailsForAdmin", async (id) => {
    const response = await api.get(`/api/admin/orders/details/${id}`);
    return response.data;
});


export const updateOrderStatus = createAsyncThunk("/api/admin/orders/updateOrderStatus", async ({id,orderStatus}) => {
    const response = await api.put(`/api/admin/orders/update/${id}`,{orderStatus});
    return response.data;
});







const AdminOrderSlice = createSlice({
    name: "adminOrder",
    initialState,
    reducers: {
        resetOrderDetails:(state)=>{
state.orderDetails=null 

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllOrdersByAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOrdersByAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
            })
            .addCase(getAllOrdersByAdmin.rejected, (state) => {
                state.isLoading = false;
                state.orderList = [];
            })
            .addCase(getOrderDetailsForAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
            })
            .addCase(getOrderDetailsForAdmin.rejected, (state) => {
                state.isLoading = false;
                state.orderDetails = [];
            });
    },
});
export const {resetOrderDetails}=AdminOrderSlice.actions

export default AdminOrderSlice.reducer;
