import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket.js";
import { toast } from "react-toastify";


export const getUser = createAsyncThunk("auth/me", async (_, ThunkAPI) => {
  try {
    const res = await axiosInstance.get("/user/me", {
      withCredentials: true,
    });
    return res.data.user;
  } catch (error) {
    return ThunkAPI.rejectWithValue(
      error.response?.data || "Failed to fetch user"
    );
  }
});


export const login = createAsyncThunk("/user/Sign-in", async (data, ThunkAPI) => {
  try {
    const res = await axiosInstance.post("/user/Sign-in", data, {
      withCredentials: true,
    });
    toast.success("Logged in Successfully");
    ThunkAPI.dispatch(getUser());
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
    return ThunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

// ✅ SIGNUP
export const Signup = createAsyncThunk("/user/Sign-up", async (data, ThunkAPI) => {
  try {
    const res = await axiosInstance.post("/user/Sign-up", data, {
      withCredentials: true,
    });
    toast.success("Account Created Successfully");
    ThunkAPI.dispatch(getUser());
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Signup failed");
    return ThunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

// ✅ LOGOUT
export const logout = createAsyncThunk("auth/Sign-out", async (_, ThunkAPI) => {
  try {
    await axiosInstance.get("/user/Sign-out", { withCredentials: true });
    disconnectSocket();
    return null;
  } catch (error) {
    toast.error(error.response?.data?.message || "Logout failed");
    return ThunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk("user/updateProfile", async (data, ThunkAPI ) =>{
   try {
     const res = await axiosInstance.put("/user/update-Profile",data,);
     toast.success("Profile Updated Sucessfully");
     return res.data;
   } catch (error) {
    toast.error(error.response.data.message || "Profile UPdate Failed ")
    return ThunkAPI.rejectWithValue(error.response.data.message);
   }
})

// ✅ Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
  },
  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload ;
        state.isCheckingAuth = false;
        if (action.payload?._id) {
         connectSocket(action.payload._id); 
        }
      })
      .addCase(getUser.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })
      .addCase(Signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(Signup.fulfilled, (state, action) => {
        state.isSigningUp = false;
      })
      .addCase(Signup.rejected, (state) => {
        state.isSigningUp = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
        state.onlineUsers = [];
      })
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile= false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      })
  },
});

export const { setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
