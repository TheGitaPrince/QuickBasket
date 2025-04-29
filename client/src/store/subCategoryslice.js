import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from "../utils/axiosInterceptors.js";
import toast from "react-hot-toast";

export const createSubCategory = createAsyncThunk("create",async (createData, { rejectWithValue }) => {
    try {
      const response = await authAxios.post("/subcategory/create-subcategory", createData);
      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data.message)
      return rejectWithValue(error.response?.data || "Subcategory creation failed");
    }
});

export const getSubCategories = createAsyncThunk("subCategory/get",async (search, { rejectWithValue }) => {
    try {
      const response = await authAxios.get("/subcategory/get-subcategory",{params: search});
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data.message)
      return rejectWithValue(error.response?.data || "Fetching subcategories failed");
    }
});

export const updateSubCategory = createAsyncThunk("subCategory/update",async (updateData, { rejectWithValue }) => {
    try {
      const response = await authAxios.patch("/subcategory/update-subcategory", updateData);
      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data.message)
      return rejectWithValue(error.response?.data || "Subcategory update failed");
    }
});

export const deleteSubCategory = createAsyncThunk("subCategory/delete",async (id, { rejectWithValue }) => {
    try {
      const response = await authAxios.post("/subcategory/delete-subcategory",{subCategoryId: id});
      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data.message)
      return rejectWithValue(error.response?.data || "Subcategory deletion failed");
    }
});

const initialState = {
  subCategories: [],
  isLoading: false,
  error: null
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(createSubCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubCategory.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message
      })
      .addCase(getSubCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSubCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subCategories = action.payload;
      })
      .addCase(getSubCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message
      })
      .addCase(updateSubCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubCategory.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.isLoading= false;
        state.error = action.payload?.message
      })
      .addCase(deleteSubCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message
      })
  },
});

export default subCategorySlice.reducer;
