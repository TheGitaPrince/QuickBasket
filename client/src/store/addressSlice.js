import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from "../utils/axiosInterceptors.js";
import toast from "react-hot-toast";


export const addAddress = createAsyncThunk("addAddress", async (formData, { rejectWithValue }) => {
    try {
        const response = await authAxios.post("/address/add-address", formData)
        toast.success(response?.data?.message);
        return response?.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Address Added failed");
    }
})

export const getAddress = createAsyncThunk("getAddress", async (_,{ rejectWithValue }) => {
    try {
        const response = await authAxios.get("/address/get-address")
        return response?.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Fetching address failed");
    }
})

export const updateAddress = createAsyncThunk("updateAddress", async (formData,{ rejectWithValue }) => {
    try {
        const response = await authAxios.patch("/address/update-address", formData)
        toast.success(response?.data?.message);
        return response?.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Update address failed");
    }
})

export const deleteAddress = createAsyncThunk("deleteAddress", async (addressId,{ rejectWithValue }) => {
    try {
        const response = await authAxios.post("/address/delete-address", addressId)
        toast.success(response?.data?.message);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Delete address failed");
    }
})

const initialState = {
    addressList: [],
    isLoading: false,
    error: null
}

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
      builder
        .addCase(addAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addAddress.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(addAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message
        })
        .addCase(getAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAddress.fulfilled, (state, action) => {
            state.addressList = action.payload
            state.loading = false;
        })
        .addCase(getAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message
        })
        .addCase(updateAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateAddress.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(updateAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message
        })
        .addCase(deleteAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteAddress.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(deleteAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message
        })
    }
})

export default addressSlice.reducer;