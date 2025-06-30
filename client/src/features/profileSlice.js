import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;

export const fetchUserProfile = createAsyncThunk(
    'profile/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
        const response = await axios.get(`${backendUrl}/api/profile/fetch-profile`, { withCredentials: true});
        // console.log('user from profile slice: ',response);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response.data);
        }
    }
)

export const fetchAlumni = createAsyncThunk(
    'alumni/fetchAlumni',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${backendUrl}/api/alumni/alumni`,  { withCredentials: true });
            // console.log('alumni from profile slice: ',response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const updateUserProfile = createAsyncThunk(
    'profile/updateUserProfile',
    async (userDetails, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            for (let key in userDetails) {
                if (userDetails[key] !== undefined && userDetails[key] !== null) {
                  // Convert batch and graduatedIn to number if needed
                  if (key === "batch" || key === "graduatedIn") {
                    formData.append(key, Number(userDetails[key]));
                  } else {
                    formData.append(key, userDetails[key]);
                  }
                }
              }


            const response = await axios.put(`${backendUrl}/api/profile/update-profile`, formData,  { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        user: null,
        loading: false,
        error: null,
        role: null,
        alumni: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.role = action.payload.role;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(fetchAlumni.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAlumni.fulfilled, (state, action) => {
                state.loading = false;
                state.alumni = action.payload.alumni;
            })
            .addCase(fetchAlumni.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default profileSlice.reducer;
