import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";

const protect = async (req, res, next) => {
    console.log("Cookies received:", req.cookies);
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

const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Role: ${req.user.role} is not allowed to access this resource` 
            });
        }
        next();
    }
}

export { protect, authorize };