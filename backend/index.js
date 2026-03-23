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
const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");
const corsOptions = {
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions));

app.options(/(.*)/, cors(corsOptions));

app.use(cookieParser());
app.use(express.json({}));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Kya be laude");
})
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vendors", vendorRoutes);

server.listen(process.env.PORT, () => {
    console.log(`listening...`);
})