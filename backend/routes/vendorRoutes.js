import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import { addMenuItem, getNearbyVendors, getVendor, toggleVendorStatus } from '../controllers/vendorController.js';
import { protect } from '../midddleware/authMiddleware.js';


router.get("/nearby", wrapAsync(getNearbyVendors));
router.put("/toggle-status", protect, wrapAsync(toggleVendorStatus));

router.post("/:id/menu", protect, wrapAsync(addMenuItem));
router.put("/:id/status", protect, wrapAsync(toggleVendorStatus))
router.get("/:id", wrapAsync(getVendor));

export default router;