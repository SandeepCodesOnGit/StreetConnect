import { Server } from "socket.io";
import Vendor from "../models/Vendor.js";

const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["*"],
            credentials: true
        },
        transports: ['websocket', 'polling']
    });
    io.on("connection", (socket) => {
        console.log(`New client connected to Socket.io: ${socket.id}`);

        socket.on("updateVendorLocation", async (data) => {
            const { vendorId, lat, lng } = data;
            
            io.emit("vendorLocationChanged", { vendorId, lat, lng });

        })
        socket.on("disconnect", ()=> {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
    
    return io;
}

export { connectToSocket };