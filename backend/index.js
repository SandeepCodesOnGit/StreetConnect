import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import {connectToSocket} from './controllers/socketManager.js';
import mongoose from 'mongoose';
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

// app.set('trust proxy', 1);
app.set("io", io);

main().then((res) => {
    console.log("Connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
}

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(cookieParser());
app.use(express.json({}));
app.use(express.urlencoded({extended: true}));

app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/orders", orderRoutes)

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, 'API Route Not Found'));
// });

// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if(!err.message) err.message = "Oh NO, Something went wrong on the server!";

//     console.error("🔥 Error caught by Global Handler:", err);
//     res.status(statusCode).json({
//         success: false,
//         message: err.message,
//         stack: process.env.NODE_ENV === 'production' ? null : err.stack
//     });
// })
server.listen(8080, () => {
    console.log(`listening...`);
})