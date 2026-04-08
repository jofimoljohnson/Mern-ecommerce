import api from "@/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    approvalURL: null,
    orderId: null,
    orderList:[],
    orderDetails:null
};

export const createNewOrder = createAsyncThunk("/api/shop/order/createOrder", async (orderData) => {
    const response = await api.post("/api/shop/order/create", orderData);
    return response.data;
});

export const capturePayment = createAsyncThunk(
    "/api/shop/order/capturePayment",
    async ({ paymentId, payerId, orderId }) => {
        const response = await api.post("/api/shop/order/capture", {
            paymentId,
            payerId,
            orderId,
        });
        return response.data;
    },
);


export const getAllOrdersByUserId = createAsyncThunk(
    "/api/shop/order/getAllOrdersByUserId",
    async (userId) => {
        const response = await api.get(`/api/shop/order/list/${userId}`);
        return response.data;
    },
);


export const getOrderDetails = createAsyncThunk(
    "/api/shop/order/getOrderDetails",
    async (id) => {
        const response = await api.get(`/api/shop/order/details/${id}`);
        return response.data;
    },
);





const ShopOrderSlice = createSlice({
    name: "shoppingOrder",
    initialState,
    reducers: {
        resetOrderDetails:(state)=>{
state.orderDetails=null 


        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.approvalURL = action.payload.approvalURL;
                state.orderId = action.payload.orderId;
                sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));
            })
            .addCase(createNewOrder.rejected, (state) => {
                state.isLoading = false;
                state.approvalURL = null;
                state.orderId = null;
            }).addCase(getAllOrdersByUserId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
                
            })
            .addCase(getAllOrdersByUserId.rejected, (state) => {
                state.isLoading = false;
                state.orderList=[]
                
            }).addCase(getOrderDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
                
            })
            .addCase(getOrderDetails.rejected, (state) => {
                state.isLoading = false;
                state.orderDetails=null
                
            })
    },
});
export const {resetOrderDetails}=ShopOrderSlice.actions 
export default ShopOrderSlice.reducer;
