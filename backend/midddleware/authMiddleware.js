import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";

const protect = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({ message: "NOt authorized, please login" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const Model = decoded.role === "vendor" ? Vendor : User;
        const currUser = await Model.findById(decoded.id).select("-password");


        if(!currUser) {
            return res.status(404).json({ message: "User no longer exists" });
        }

        req.user = currUser;
        req.user.role = decoded.role;

        next();
    } catch (error) {
        console.log("Auth Middleware Error: ", error);
        res.status(401).json({ message: "Token is invalid or expired" });
    }
};

export { protect };