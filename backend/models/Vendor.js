import mongoose, { Schema } from "mongoose";


const MenuItemSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String 
  },
  isAvailable: { 
    type: Boolean, 
    default: true
  },
  imageUrl: { type: String }
});

const VendorSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  shopName: { 
    type: String, 
    required: true 
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
    select: false 
  },
  phone: { 
    type: String, 
    required: true,
    trim: true,
    match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"]
  },
  role: { 
    type: String, 
    default: "vendor", 
    enum: ["vendor"] 
  },
  category: {
    type: String,
    trim: true,
    required: true,
    lowercase: true
  },
  isLive: {
    type: Boolean,
    default: false
  },

  location: {
    type: {
      type: String,
      enum: ['Point'], 
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },

  rating: { 
    type: Number, 
    default: 0 
  },
  profilePic: {
    type: String,
    default: "",
    trim: true
  },
  
  menu: [MenuItemSchema] 

}, { timestamps: true });


VendorSchema.index({ location: "2dsphere" });

const Vendor = mongoose.model('Vendor', VendorSchema);
export default Vendor;