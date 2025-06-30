import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;

export const getUserConversations = createAsyncThunk(
  "chat/getUserConversations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${backendUrl}/api/conversation/conversations`, {}, { withCredentials: true });
      return res.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${backendUrl}/api/message/messages?conversationId=${conversationId}`, { withCredentials: true });
      return res.data.messages;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ conversationId, content }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${backendUrl}/api/message/send`, {
        conversationId,
        content
      }, { withCredentials: true });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createOrFetchConversation = createAsyncThunk(
  "chat/createOrFetchConversation",
  async ({ recipientId, recipientRole }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${backendUrl}/api/conversation/conversation`, {
        recipientId,
        recipientRole
      }, { withCredentials: true });

      return res.data.conversation;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    selectedConversation: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
      state.messages = [];
    },
    clearChat: (state) => {
      state.selectedConversation = null;
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(getUserConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendMessage.fulfilled, (state, action) => {
        if (
          state.selectedConversation &&
          state.selectedConversation._id === action.payload.conversationId
        ) {
          state.messages.push(action.payload);
        }
      })
      .addCase(createOrFetchConversation.fulfilled, (state, action) => {
        const exists = state.conversations.find(c => c._id === action.payload._id);
        if (!exists) {
          state.conversations.push(action.payload);
        }
        state.selectedConversation = action.payload;
      })
  },
});

export const { setSelectedConversation, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
