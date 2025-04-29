import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from "../utils/axiosInterceptors.js"
import toast from "react-hot-toast";


export const register = createAsyncThunk('register', async (useData, { rejectWithValue }) => {
        try {
            const response = await  authAxios.post('/users/register',useData); 
            toast.success("Please check your email");
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data.message)
            return rejectWithValue(error.response?.data || "Registration failed");
        }
});

export const verifyEmail = createAsyncThunk('verifyEmail', async (token, { rejectWithValue }) => {
    try {
        const response = await authAxios.post("/users/verify-email", {token: token});
        toast.success(response.data.message);
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Registration failed");
    }
});

export const login = createAsyncThunk('login',async (credentials, { rejectWithValue, dispatch }) => {
        try {
            const response = await authAxios.post('/users/login', credentials);
            toast.success(response.data.message);
            return {
                user: response.data.data.user,
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken,
            };
        } catch (error) {
            toast.error(error.response?.data.message)
            return rejectWithValue(error.response?.data);
        }
});

export const updateAccountDetails = createAsyncThunk('updateAccount',async (updateDetails, { rejectWithValue, dispatch }) => {
    try {
        const response = await authAxios.patch('/users/update-account', updateDetails);
        toast.success(response.data.message);
        return {
            user: response.data.data,
        };
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data);
    }
});

export const uploadAvatar = createAsyncThunk('avatar',async (avatar,{rejectWithValue,dispatch}) => {
    try {
        const response = await authAxios.patch('/users/upload-avatar',avatar)
        toast.success(response.data.message)
        return {
            user: response.data.data,
        };
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data)
    }
})

export const forgotPassword = createAsyncThunk('forgotPassword',async (email, { rejectWithValue, dispatch }) => {
    try {
        const response = await authAxios.post('/users/forgot-password', email);
        toast.success(response.data.message);
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data);
    }
});

export const verifyOtp = createAsyncThunk('verifyOtp',async (otp, { rejectWithValue, dispatch }) => {
    try {
        const response = await authAxios.post('/users/verify-otp', otp);
        toast.success(response.data.message);
        return response.data.data;
    } catch (error) { 
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data);
    }
});

export const resetPassword = createAsyncThunk('resetPassword',async (password, { rejectWithValue, dispatch }) => {
    try {
        const response = await authAxios.patch('/users/reset-password', password);
        toast.success(response.data.message);
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data);
    }
});
                                            
export const logout = createAsyncThunk('logout', async (_,{ rejectWithValue, dispatch }) => {
    try {
       const response = await authAxios.post("/users/logout");
        toast.success(response.data.message)
        return null;
    } catch (error) {
        toast.error(error.response?.data.message);
        return rejectWithValue(error.response?.data);
    }
});

export const requestAdminAccess = createAsyncThunk('requestAdminAccess', async (_, { rejectWithValue }) => {
    try {
        const response = await  authAxios.post('/users/request-admin'); 
        toast.success(response.data.message);
        return response;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "Admin access request failed");
    }
});

export const approveAdminAccess = createAsyncThunk('approveAdminAccess', async (email, { rejectWithValue }) => {
    try {
        const response = await  authAxios.post('/users/approve-admin',email); 
        toast.success(response.data.message);
        return response;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "approve admin request failed");
    }
});

export const getAdminRequests = createAsyncThunk('getAdminRequests', async (_, { rejectWithValue }) => {
    try {
        const response = await  authAxios.get('/users/get-admin'); 
        toast.success(response.data.message);
        return response?.data?.data;
    } catch (error) {
        toast.error(error.response?.data.message)
        return rejectWithValue(error.response?.data || "get admin failed");
    }
});

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    adminRequestList: [],
    loading: false,
    error: null
};

const userSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(verifyEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(login.pending, (state) => {
               state.loading = true;
               state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("accessToken", action.payload.accessToken);
                localStorage.setItem("refreshToken", action.payload.refreshToken);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(updateAccountDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
             })
             .addCase(updateAccountDetails.fulfilled, (state, action) => {
                 state.loading = false;
                 state.user = action.payload.user;
                 localStorage.setItem("user", JSON.stringify(action.payload.user));
             })
             .addCase(updateAccountDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
             })
             .addCase(uploadAvatar.pending, (state) => {
                state.loading = true;
                state.error = null;
             })
             .addCase(uploadAvatar.fulfilled, (state, action) => {
                 state.loading = false;
                 state.user = action.payload.user;
                 localStorage.setItem("user", JSON.stringify(action.payload.user));
             })
             .addCase(uploadAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
             })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            })           
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
             })         
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
             })           
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(requestAdminAccess.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestAdminAccess.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(requestAdminAccess.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(approveAdminAccess.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveAdminAccess.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(approveAdminAccess.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(getAdminRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminRequests.fulfilled, (state, action) => {
                state.adminRequestList = action.payload
                state.loading = false;
            })
            .addCase(getAdminRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })              
     },
});

export default userSlice.reducer;