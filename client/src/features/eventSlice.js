import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;

export const postAnEvent = createAsyncThunk(
    'event/postAnEvent',
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${backendUrl}/api/event/post-event`, eventData,  { withCredentials: true });
            // console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const getAllEvents = createAsyncThunk(
    'event/getAllEvents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${backendUrl}/api/event/get-all-events`,  { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const getEventById = createAsyncThunk(
    'event/getEventById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${backendUrl}/api/event/get-event/${id}`,  { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const getEventsByUser = createAsyncThunk(
    'event/getEventsByUser',
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const formattedRole = role.toLowerCase();
      
      // Log the request parameters for debugging
            // console.log(`Fetching events for ${formattedRole} with ID: ${id}`);
            const response = await axios.get(`${backendUrl}/api/event/user/${role}/${id}`,  { withCredentials: true })
            // console.log("Events response:", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
            
        }
    }
)

export const deleteEvent = createAsyncThunk(
    'event/deleteEvent',
    async(id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/event/delete-event/${id}`,  { withCredentials: true });
            return { id };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const eventSlice = createSlice({
    name: 'event',
    initialState: {
        events: [],
        selectedEvent: [],
        currentEvent: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postAnEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postAnEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = Array.isArray(state.events)
                ? [...state.events, action.payload.event]
                : [action.payload.event];
            })
            .addCase(postAnEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(getAllEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getEventById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEventById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEvent = action.payload.event;
            })
            .addCase(getEventById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getEventsByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEventsByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedEvent = action.payload.events;
            })
            .addCase(getEventsByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming action.payload contains the ID of the deleted event
                const deletedEventId = action.payload.id || action.meta.arg; // fallback if backend returns only ID
                state.selectedEvent = state.selectedEvent.filter(event => event.id !== deletedEventId);
            })
    }
})

export default eventSlice.reducer;
