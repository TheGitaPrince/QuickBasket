import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from "../utils/axiosInterceptors.js";
import toast from "react-hot-toast";


export const cashOnDelivery = createAsyncThunk("cashOnDelivery", async (formData,{ rejectWithValue }) => {
    try {
        const response = await authAxios.post("/order/cash-on-delivery", formData)
        toast.success(response?.data?.message);
        return response?.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Order failed");
    }
})

export const onlinePaymentOrder = createAsyncThunk("onlinePaymentOrder", async (formData, { rejectWithValue }) => {
    try {
        const response = await authAxios.post("/order/create-stripe-session", formData);
        toast.success("Redirecting to payment...");
        return response?.data;
    } catch (error) {
        toast.error(error.response?.data.message);
        return rejectWithValue(error.response?.data || "Payment initiation failed");
    }
});

export const verifyPayment = createAsyncThunk("verifyPayment", async (sessionId, { rejectWithValue }) => {
    try {
        const response = await authAxios.post("/order/verify-payment", sessionId);
        toast.success(response?.data?.message);
        return response?.data;
    } catch (error) {
        toast.error(error.response?.data.message);
        return rejectWithValue(error.response?.data || "Payment Verification failed");
    }
});

export const getOrderDetails = createAsyncThunk("getOrderDetails", async (_,{ rejectWithValue }) => {
    try {
        const response = await authAxios.get("/order/get-order-details")
        return response?.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Get Order Items failed");
    }
})

const initialState = {
    orderItems: [],
    isLoading: false,
    error: null
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
      builder
        .addCase(cashOnDelivery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(cashOnDelivery.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(cashOnDelivery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message
        })
        .addCase(onlinePaymentOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(onlinePaymentOrder.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(onlinePaymentOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        })
        .addCase(verifyPayment.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(verifyPayment.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(verifyPayment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message
        })
        .addCase(getOrderDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getOrderDetails.fulfilled, (state, action) => {
            state.orderItems = action.payload
            state.loading = false;
        })
        .addCase(getOrderDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message
        })
    }
})

export default orderSlice.reducer;