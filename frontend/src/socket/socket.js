import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
  reconnectionAttempts: 5,
});

export default socket;