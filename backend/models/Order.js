import mongoose, { Schema } from "mongoose";

const orderitemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = new Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [orderitemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ["Pending", "Accepted", "Preparing", "Ready", "Completed", "Cancelled"],
        default: "Pending"
    }
}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);

export default Order;