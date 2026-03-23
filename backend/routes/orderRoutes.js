import express from "express";
const router = express.Router();
import { createOrder, getMyOrders, getOrderById, getVendorOrders, updateOrderStatus } from "../controllers/orderController.js";
import wrapASync from "../utils/wrapAsync.js";
import { authorize, protect } from "../midddleware/authMiddleware.js";

router.post("/", protect, authorize("user", "vendor"), wrapASync(createOrder));

router.get("/myorders", protect, authorize("user", "vendor"), wrapASync(getMyOrders));

router.get("/vendor/:vendorId", protect, authorize("vendor"), wrapASync(getVendorOrders));

router.put("/:id/status", protect, authorize("vendor"), wrapASync(updateOrderStatus));

router.get("/:id", protect, authorize("user"), wrapASync(getOrderById));

export default router;