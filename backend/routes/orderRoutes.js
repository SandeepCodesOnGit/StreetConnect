import express from "express";
const router = express.Router();
import { createOrder, getMyOrders, getOrderById, getVendorOrders, updateOrderStatus } from "../controllers/orderController.js";
import wrapASync from "../utils/wrapAsync.js";
import { protect } from "../midddleware/authMiddleware.js";

router.post("/", protect, wrapASync(createOrder));

router.get("/myorders", protect, wrapASync(getMyOrders));

router.get("/vendor/:vendorId", protect, wrapASync(getVendorOrders));

router.get("/:id", protect, wrapASync(getOrderById));

router.put("/:id/status", protect, wrapASync(updateOrderStatus));

export default router;