import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL.replace(/\/$/, ""),
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["*"],
            credentials: true
        },
        transports: ['websocket', 'polling']
    });
    io.use((socket, next) => {
        try {
        const headerCookie = socket.handshake.headers.cookie;
        if(!headerCookie) {
            console.log("No cookies found in handshake headers");
            return next(new Error("Authentication error: No cookies provided"));
        }

        const cookies = cookie.parse(headerCookie);
        const token = cookies.token;

        if(!token) {
            console.log("No token found in cookies");
            return next(new Error("Authentication error: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        socket.user = decoded;
        next();
        } catch (error) {
            console.error("Socket auth error:", error.message);
            return next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`New client connected to Socket.io: ${socket.id}`);
        const userId = socket.user.id || socket.user._id;
        socket.join(userId);
        socket.on("updateVendorLocation", async (data) => {
            const { vendorId, lat, lng } = data;
            
            io.to(vendorId).emit("vendorLocationChanged", { vendorId, lat, lng });

        });
        socket.on("joinVendorRoom", (vendorId) => {
            socket.join(vendorId);
            console.log(`User ${userId} joined room for vendor ${vendorId}`);
        });
        socket.on("leaveVendorRoom", (vendorId) => {
            socket.leave(vendorId);
            console.log(`User ${userId} left room for vendor ${vendorId}`);
        });
        socket.on("disconnect", ()=> {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
    
    return io;
}

export { connectToSocket };