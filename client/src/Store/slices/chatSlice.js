import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";


export const getUsers = createAsyncThunk("chat/getUsers", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/message/users");
    return res.data.users; 
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to load users");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const getMessages = createAsyncThunk("chat/getMessages", async (userId, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/message/${userId}`);
    return res.data.messages;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to load messages");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

// 🔹 Send a message
export const sendMessage = createAsyncThunk("chat/sendMessage", async (messageData, thunkAPI) => {
  try {
    const { chat } = thunkAPI.getState();
    const res = await axiosInstance.post(`/message/send/${chat.selectedUser._id}`, messageData);
    return res.data; // ✅ single message object
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to send message");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});


export const ClearChat = createAsyncThunk("chat/ClearChat", async(userId , thunkAPI)=>{
  try {
     const res = await axiosInstance.delete(`/message/clear/${userId}`);
     return res.data
  } catch (error) {
    toast.error(error.response.data.message || "Failed to Clear Chats");
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
})

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    error: null,
  },

  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = []; 
    },
    pushNewMessage: (state, action) => {
      state.messages.push(action.payload); 
    },
  },

  extraReducers: (builder) => {
    builder
      // 🔹 Users
      .addCase(getUsers.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isUserLoading = false;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.payload;
      })

      // 🔹 Messages
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload; 
        state.isMessagesLoading = false;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isMessagesLoading = false;
        state.error = action.payload;
      })

      // 🔹 Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload); 
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(ClearChat.fulfilled , (state)=>{
        state.messages =[];
        toast.success("Chat cleared successfully");
      })
      .addCase(ClearChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedUser, pushNewMessage } = chatSlice.actions;
export default chatSlice.reducer;
