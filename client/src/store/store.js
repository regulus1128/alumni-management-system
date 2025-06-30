import { configureStore } from "@reduxjs/toolkit";
import { darkModeSlice } from "../features/DarkModeSlice";
import authSlice from "../features/authSlice.js";
import profileReducer from "../features/profileSlice.js";
import jobReducer from "../features/jobSlice.js";
import eventSlice from "../features/eventSlice.js";
import forumSlice from "../features/forumSlice.js";
import chatSlice from "../features/chatSlice.js";

export const store = configureStore({
    reducer: {
        darkMode: darkModeSlice.reducer,
        auth: authSlice,
        profile: profileReducer,
        job: jobReducer,
        events: eventSlice,
        forums: forumSlice,
        chat: chatSlice,
    }
});