import { Server } from "socket.io";

const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });
    io.on("connection", (socket) => {
        console.log(`New client connected to Socket.io: ${socket.id}`);
        socket.on("disconnect", ()=> {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
}

export { connectToSocket };