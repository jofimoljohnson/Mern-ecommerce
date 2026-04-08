import api from "@/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    productList: [],
};

export const addNewProduct = createAsyncThunk("/api/admin/products/add", async (formData) => {
    const response = await api.post("/api/admin/products/add", formData, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
});

export const fetchAllProducts = createAsyncThunk("/api/admin/products/fetchAllProducts", async () => {
    const response = await api.get("/api/admin/products/get");
    return response.data;
});

export const editProduct = createAsyncThunk("/api/admin/products/edit", async ({ id, formData }) => {
    const response = await api.put(`/api/admin/products/edit/${id}`, formData, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
});

export const deleteProduct = createAsyncThunk("/api/admin/products/delete", async (id) => {
    const response = await api.delete(`/api/admin/products/delete/${id}`);
    return response.data;
});



const AdminProductSlice = createSlice({
    name: "adminProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.pending,(state)=>{
            state.isLoading=true

        }).addCase(fetchAllProducts.fulfilled,(state,action)=>{
            console.log("ACTION",action.payload)
            state.isLoading=false 
            state.productList=action.payload.data 

        }).addCase(fetchAllProducts.rejected,(state,action)=>{
            state.isLoading=false 
            state.productList=[]
        })
    },
});


export default AdminProductSlice.reducer