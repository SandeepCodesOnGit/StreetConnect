import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
    return jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn: "30d",});
};

const sendCookie = (user, role, statusCode, res) => {
    const token = generateToken(user.id, role);

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    res.status(statusCode).cookie("token", token, cookieOptions).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: role,
        ...(role === "vendor" && {
            shopName: user.shopName,
            category: user.category
        })
    });
};

const login = async (req, res) => {
    const { email, password, role} = req.body;
    if(!email || !password || !role) {
        return res.status(400).json({ message: "Please provide email, password, and role" });
    }

    const Model = role === "vendor" ? Vendor : User;

    const user = await Model.findOne({ email }).select("+password");
    if(!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    
    sendCookie(user, role, 200, res);
}

const signup = async (req, res) => {
    const {username, email, password, phone, role, shopName, category} = req.body;
    if(!username || !email || !password || !phone || !role) {
        return res.status(400).json({ message: "Please fill all field"});
    }
    const Model = role === "vendor" ? Vendor : User;

    const userExist = await Model.findOne({ email });

    if(userExist){
        return res.status(400).json({message: "User already Exists"});
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUserData = {
        username: username,
        email: email,
        password: hashedPassword,
        phone: phone,
        role: role
    };

    if(role === "vendor") {
        if(!shopName || !category){
            return res.status(400).json({ message: "Shop name and category are required for vendors"});
        }
        newUserData.shopName = shopName;
        newUserData.category = category;
        newUserData.isLive = false;
    }

    const user = await Model.create(newUserData);
    sendCookie(user, role, 201, res);
}

const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
        httpOnly: true
    }).status(200).json({ 
    success: true, 
    message: "Logged out successfully" 
  });
}

const getMe = async (req, res) => {
    try {
        const Model = req.user.role === "vendor" ? Vendor : User;
        const user = await Model.findById(req.user.id).select("-password");

        if(!user) {
            return res.status(404).json({ message: "User not found"});
        }

        res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            ...(user.role === "vendor" && {
                shopName: user.shopName,
                category: user.category
            })
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export {login, logout, signup, getMe};