import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from "../utils/axiosInterceptors.js";
import toast from "react-hot-toast";


export const addItemToCart = createAsyncThunk("addItem", async (productId,{ rejectWithValue }) => {
    try {
        const response = await authAxios.post("/cart/add-cart-item", productId)
        console.log(response)
        toast.success(response?.data?.message);
        return response?.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Item Added failed");
    }
})

export const getCartItems = createAsyncThunk("getItems", async (_,{ rejectWithValue }) => {
    try {
        const response = await authAxios.get("/cart/get-cart-items")
        return response?.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Get cart Item failed");
    }
})

export const updateCartItem = createAsyncThunk("updateItem", async (quantity,{ rejectWithValue, dispatch }) => {
    try {
        const response = await authAxios.patch("/cart/update-cart-item", quantity)
        toast.success(response?.data?.message);
        return response?.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Update cart Item failed");
    }
})

export const deleteCartItem = createAsyncThunk("deleteItem", async (cartItemId,{ rejectWithValue }) => {
    try {
        const response = await authAxios.post("/cart/delete-cart-item", cartItemId)
        toast.success(response?.data?.message);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Delete cart Item failed");
    }
})

const initialState = {
    cartItems: [],
    isLoading: false,
    error: null
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCart: (state) => {
            state.cartItems = [];
            state.isLoading = false;
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
      builder
        .addCase(addItemToCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addItemToCart.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(addItemToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message
        })
        .addCase(getCartItems.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getCartItems.fulfilled, (state, action) => {
            state.cartItems = action.payload
            state.loading = false;
        })
        .addCase(getCartItems.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message
        })
        .addCase(updateCartItem.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateCartItem.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(updateCartItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message
        })
        .addCase(deleteCartItem.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteCartItem.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(deleteCartItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message
        })
    }
})

export default cartSlice.reducer;
export const { resetCart } = cartSlice.actions;