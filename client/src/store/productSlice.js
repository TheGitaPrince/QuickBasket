import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from "../utils/axiosInterceptors.js";
import toast from "react-hot-toast";


export const createProduct = createAsyncThunk("create", async (createData, { rejectWithValue }) => {
    try {
        const response = await  authAxios.post("/products/create-product",createData); 
        toast.success(response?.data?.message);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Product creation failed");
    }
});

export const getProduct = createAsyncThunk("getProduct",async ( { page, limit, search },{ rejectWithValue })=> {
    try {
        const response = await authAxios.get("/products/get-product",{ params: { page, limit, search }})
        return response?.data.data
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Failed to get products"); 
    }
})

export const getProductByCategory = createAsyncThunk("getProductByCategory",async (id,{ rejectWithValue })=> {
    try {
        const response = await authAxios.get("/products/get-product-category",{params: { id }})
        return response?.data.data
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Failed to get products by category"); 
    }
})

export const getProductByCategoryAndSubCategory = createAsyncThunk("getProductBy",async (param,{ rejectWithValue })=> {
    try {
        const response = await authAxios.get("/products/get-product-category-subcategory",{params: param})
        return response?.data.data
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Failed to get products by Category & Subcategory"); 
    }
})

export const getProductDetails = createAsyncThunk("getProductDetails",async (productId,{ rejectWithValue })=> {
    try {
        const response = await authAxios.get("/products/get-product-details",{params: productId})
        return response?.data.data
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Failed to get product details"); 
    }
})

export const updateProduct = createAsyncThunk("updateProduct",async (formData,{ rejectWithValue })=> {
    try {
        const response = await authAxios.patch("/products/update-product",formData)
        return response?.data.data
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Failed to update product"); 
    }
})

export const deleteProduct = createAsyncThunk("deleteProduct",async (_id,{ rejectWithValue })=> {
    try {
        const response = await authAxios.post("/products/delete-product",_id)
        toast.success(response?.data?.message);
        return response
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Failed to delete product"); 
    }
})


const initialState = {
    products: [],
    productsBySubCategory: [],
    productsByCategory: {},
    currentProduct: null,
    totalNoPage: 1,
    totalCount: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.totalNoPage = action.payload.totalNoPage;
                state.totalCount = action.payload.totalCount;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(getProductByCategory.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductByCategory.fulfilled, (state, action) => {
                state.loading = false;
                const categoryId = action.meta.arg;
                if (action.payload?.Products) {
                    state.productsByCategory[categoryId] = action.payload.Products;
                } else {
                    state.productsByCategory[categoryId] = [];
                }
            })
            .addCase(getProductByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(getProductByCategoryAndSubCategory.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductByCategoryAndSubCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.productsBySubCategory = action.payload.products;
                state.totalCount = action.payload.totalCount;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
            })
            .addCase(getProductByCategoryAndSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(getProductDetails.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProduct = action.payload
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(updateProduct.pending, (state, action) => {
                state.loading= true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.product;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(deleteProduct.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }    
});

export default productSlice.reducer;