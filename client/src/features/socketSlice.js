// socketSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

const initialState = {
  socket: null,
  onlineUsers: [],
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    addOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setSocket, addOnlineUsers } = socketSlice.actions;

export const initializeSocket = (userId) => (dispatch, getState) => {
  const existingSocket = getState().socket.socket;
  if (!existingSocket) {
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ['websocket'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
      socket.emit('addUser', userId);
    });

    socket.on('getMessage', (data) => {
      console.log('📩 New message received:', data);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    dispatch(setSocket(socket));
  }
};

export default socketSlice.reducer;
