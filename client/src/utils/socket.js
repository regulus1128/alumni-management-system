import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
    transports: ['websocket'], // ensure WebSocket connection
    path: "/socket.io",        // default, but include to be sure
  }); // ensure your .env has this

export default socket;
