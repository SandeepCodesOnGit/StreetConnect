import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false // Security: Password won't be returned in normal queries
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user",
    enum: ["user"]
  },
  // Optional: To store profile picture from Firebase/Cloudinary
  profilePic: {
    type: String, 
    default: "" 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);
export default User;