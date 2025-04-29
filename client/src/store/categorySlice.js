import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from "../utils/axiosInterceptors.js"
import toast from "react-hot-toast";


export const createCategory = createAsyncThunk("create", async (createData, { rejectWithValue }) => {
    try {
        const response = await  authAxios.post("/category/create-category",createData); 
        toast.success(response?.data?.message);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Category creation failed");
    }
});

export const getCategory = createAsyncThunk("get", async (_, { rejectWithValue }) => {
    try {
        const response = await  authAxios.get("/category/get-category");
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Fetching categories failed");
    }
});

export const updateCategory = createAsyncThunk("update", async (updateData, { rejectWithValue }) => {
    try {
        const response = await  authAxios.patch("/category/update-category",updateData);
        toast.success(response?.data?.message)
        return response.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "category update failed");
    }
});

export const deleteCategory = createAsyncThunk("delete", async (_id, { rejectWithValue }) => {
    try {
        const response = await  authAxios.post("/category/delete-category",{_id: _id});
        toast.success(response?.data?.message)
        return response.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "category update failed");
    }
});

const initialState = {
    categories: [],
    isLoading: false,
    error: null
}

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message
            })
            .addCase(getCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message
            })  
            .addCase(updateCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message
            })   
            .addCase(deleteCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message
            })
    }    
});

export default categorySlice.reducer;