import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/config/api";

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
};

export const register = createAsyncThunk("/api/auth/register", async (formData) => {
    const response = await api.post("/api/auth/register", formData);
    return response.data;
});

export const login = createAsyncThunk("/api/auth/login", async (formData) => {
    const response = await api.post("/api/auth/login", formData);
    return response.data;
});

export const logout = createAsyncThunk("/api/auth/logout", async () => {
    const response = await api.post("/api/auth/logout");
    return response.data;
});

export const checkAuth = createAsyncThunk("/api/auth/checkAuth", async () => {
    const response = await api.get("/api/auth/checkauth", {
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Expires: "0",
        },
    });

    return response.data;
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(register.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(login.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
