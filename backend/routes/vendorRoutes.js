import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import { addMenuItem, deleteMenuItem, getNearbyVendors, getVendor, toggleVendorStatus, updateMenuItem, updateVendorLocation, getVendorCategories } from '../controllers/vendorController.js';
import { authorize, protect } from '../midddleware/authMiddleware.js';


router.get("/nearby", wrapAsync(getNearbyVendors));
router.get("/categories", wrapAsync(getVendorCategories));
// router.put("/toggle-status", protect, wrapAsync(toggleVendorStatus));

router.post("/:id/menu", protect, authorize("vendor"), wrapAsync(addMenuItem));
router.put("/:id/location", protect, authorize("vendor"), wrapAsync(updateVendorLocation));
router.put("/:id/status", protect, authorize("vendor"), wrapAsync(toggleVendorStatus));
router.put("/:id/menu/:itemId", protect, authorize("vendor"), wrapAsync(updateMenuItem));
router.delete("/:id/menu/:itemId", protect, authorize("vendor"), wrapAsync(deleteMenuItem));
router.get("/:id", wrapAsync(getVendor));

export default router;