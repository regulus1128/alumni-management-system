import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const postAForum = createAsyncThunk(
    'forum/postAForum',
    async (forumData, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("title", forumData.title);
            formData.append("description", forumData.description);
            if (forumData.image) {
                formData.append("image", forumData.image);
            }
            const response = await axios.post(`${backendUrl}/api/forum/post-forum`, formData,  { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const getAllForums = createAsyncThunk(
    'forum/getAllForums',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${backendUrl}/api/forum/get-forums`,  { withCredentials: true });
            console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const getSingleForum = createAsyncThunk(
    'forum/getSingleForum',
    async (forumId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${backendUrl}/api/forum/get-forum/${forumId}`,  { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const getForumsByUser = createAsyncThunk(
    'forum/getForumsByUser',
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${backendUrl}/api/forum/forum/${role}/${id}`,  { withCredentials: true });
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response.data);
            
        }
    }
)

export const deleteForum = createAsyncThunk(
    'event/deleteForum',
    async(id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/forum/delete-forum/${id}`,  { withCredentials: true });
            return { id };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const forumSlice = createSlice({
    name: 'forum',
    initialState: {
        forums: [],
        selectedForum: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postAForum.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postAForum.fulfilled, (state, action) => {
                state.loading = false;
                state.forums.unshift(action.payload.forum);
            })
            .addCase(postAForum.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllForums.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllForums.fulfilled, (state, action) => {
                state.loading = false;
                state.forums = action.payload.forums;
            })
            .addCase(getAllForums.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getSingleForum.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleForum.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedForum = action.payload.forum;
            })
            .addCase(getSingleForum.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getForumsByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getForumsByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedForum = action.payload.forums;
            })
            .addCase(getForumsByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteForum.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming action.payload contains the ID of the deleted event
                const deletedForumId = action.payload.id || action.meta.arg; // fallback if backend returns only ID
                state.selectedForum = state.selectedForum.filter(forum => forum.id !== deletedForumId);
            });
}
})
    

export default forumSlice.reducer;