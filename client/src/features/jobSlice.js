import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const postJob = createAsyncThunk(
    'job/postJob',
    async (jobData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${backendUrl}/api/job/post-job`, jobData,  { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const fetchAllJobs = createAsyncThunk(
    'job/fetchAllJobs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${backendUrl}/api/job/get-all-jobs`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const fetchJobById = createAsyncThunk(
    'job/fetchJobById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${backendUrl}/api/job/get-job-by-id/${id}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
            
        }

    }
)

export const getJobsByUser = createAsyncThunk(
    'job/getJobsByUser', 
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${backendUrl}/api/job/job/${role}/${id}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const deleteJob = createAsyncThunk(
    'event/deleteJob',
    async(id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/job/delete-job/${id}`, { withCredentials: true });
            return { id };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const updateJob = createAsyncThunk(
    'job/updateJob',
    async (updatedJob, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${backendUrl}/api/job/update-job/${updatedJob.id}`, updatedJob,  { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const fetchMyApplications = createAsyncThunk(
    "applications/fetchMyApplications",
    async (_, thunkAPI) => {
      try {
        const res = await axios.get(`${backendUrl}/api/application/application/mine`, {
          withCredentials: true,
        });
        return res;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
    }
  );

const initialState = {
    jobs: [],
    selectedJobs: null,
    loading: false,
    error: null
};

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postJob.fulfilled, (state, action) => {
                state.loading = false;
                console.log('action.payload in post job: ',action.payload);
                const newJob = action.payload.job;
                if (!Array.isArray(state.jobs)) {
                    state.jobs = []; // ensure it's an array
                }
            
                state.jobs.unshift(newJob);
            })
            .addCase(postJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(fetchAllJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload.jobs || []; // Ensure jobs is always an array
            })
            .addCase(fetchAllJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getJobsByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobsByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedJobs = action.payload.jobs;
            })
            .addCase(getJobsByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming action.payload contains the ID of the deleted event
                const deletedJobId = action.payload.id || action.meta.arg; // fallback if backend returns only ID
                state.selectedJobs = state.selectedJobs.filter(job => job.id !== deletedJobId);
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                state.loading = false;
                if (!Array.isArray(state.jobs)) {
                    state.jobs = []; // fallback to safe empty array
                }
                const updatedJobIndex = state.jobs.findIndex(job => job.id === action.payload.id);
                if (updatedJobIndex!== -1) {
                    state.jobs[updatedJobIndex] = action.payload;
                }
            })
            .addCase(fetchMyApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedJobs = action.payload.data; // adjust this path based on response shape
            })
            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default jobSlice.reducer;

