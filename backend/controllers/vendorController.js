import Vendor from "../models/Vendor.js";

const getNearbyVendors = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat && !lng) {
    return res
      .status(400)
      .json({ message: "Please provide latitude and longitude" });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  const nearbyVendors = await Vendor.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: 2000,
      },
    },
  }).select("-password");

  res.status(200).json({
    success: true,
    count: nearbyVendors.length,
    vendors: nearbyVendors,
  });
};

const getVendor = async (req, res) => {
  const { id } = req.params;

  const vendor = await Vendor.findById(id).select("-password");

  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });
  }
  res.status(200).json({
    success: true,
    vendor: vendor,
  });
};

const toggleVendorStatus = async (req, res) => {
  const { id } = req.params;

  if (req.user._id.toString() !== id) {
    return res.status(403).json({ success: false, message: "Forbidden: You can only update your own status." });
  }

  const vendor = await Vendor.findById(id);
  console.log(vendor);
  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  vendor.isLive = !vendor.isLive;
  await vendor.save();

  const io = req.app.get("io");

  if (io) {
    io.emit("vendorStatusChanged", {
      vendorId: vendor._id.toString(),
      isLive: vendor.isLive,
    });
    console.log(
      `Broadcasted status change for vendor ${vendor._id} (Live: ${vendor.isLive})`,
    );
  }

  res.status(200).json({
    success: true,
    message: `You are now ${vendor.isLive ? "LIVE" : "OFFLINE"}`,
    isLive: vendor.isLive,
  });
};

const updateVendorLocation = async (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.body;

  if (req.user._id.toString() !== id) {
    return res.status(403).json({ success: false, message: "Forbidden: You can only update your own location." });
  }

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ success: false, message: "Latitude and longitude are required" });
  }
  const updateVendor = await Vendor.findByIdAndUpdate(
    id,
    {
      $set: {
        "location.coordinates": [parseFloat(lng), parseFloat(lat)],
      },
    },
    { new: true },
  );

  if (!updateVendor) {
    return res
      .status(404)
      .json({ success: false, message: "Vendor not found" });
  }
  res.status(200).json({
    success: true,
    message: "Location updated successfully",
    vendor: updateVendor,
  });
};

const addMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;

  if (req.user._id.toString() !== id) {
    return res.status(403).json({ success: false, message: "Forbidden: You can only add items to your own menu." });
  }
  
  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: "Name and price are required",
    });
  }
  console.log(req.body);
  const vendor = await Vendor.findById(id);

  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });
  }

  const newItem = {
    name: name,
    description: description,
    price: Number(price),
    isAvailable: true,
    imageUrl: image,
  };
  
  vendor.menu.push(newItem);
  await vendor.save();

  const io = req.app.get("io");
  if (io) {
    io.emit("menuUpdated", {
      vendorId: vendor._id.toString(), 
      menu: vendor.menu
    });
  }

  res.status(201).json({
    success: true,
    message: "Menu item added!",
    menu: vendor.menu,
  });
};

const updateMenuItem = async (req, res) => {
  const { id, itemId } = req.params;
  const { name, description, price, isAvailable, image } = req.body;

  if(req.user.id.toString() !== id) {
    return res.status(403).json({ success: false, message: "Forbidden: Not your menu." });
  }
  
  const vendor = await Vendor.findById(id);
  if (!vendor) {
    return res.status(404).json({ success: false, message: "Vendor not found" });
  }

  const item = vendor.menu.id(itemId);
  if (!item) {
    return res.status(404).json({ success: false, message: "Menu item not found" });
  }

  if (name) item.name = name;
  if (description) item.description = description;
  if (price) item.price = Number(price);
  if (isAvailable !== undefined) item.isAvailable = isAvailable;
  if (image !== undefined) item.imageUrl = image;

  await vendor.save();

  const io = req.app.get("io");
  if(io) {
    io.emit("menuUpdated", {
      vendorId: vendor._id.toString(),
      menu: vendor.menu
    });
  }

  res.status(200).json({
    success: true,
    message: "Menu item updated!",
    menu: vendor.menu,
  });
};

const deleteMenuItem = async (req, res) => {
  const { id, itemId } = req.params;

  if(req.user.id.toString() !== id) {
    return res.status(403).json({ success: false, message: "Forbidden: Not your menu." });
  }
  const vendor = await Vendor.findById(id);
  if (!vendor) {
    return res.status(404).json({ success: false, message: "Vendor not found" });
  }

  vendor.menu.pull(itemId);
  await vendor.save();

  const io = req.app.get("io");
  if (io) {
    io.emit("menuUpdated", {
      vendorId: id.toString(),
      menu: vendor.menu
    });
  }

  res.status(200).json({
    success: true,
    message: "Menu item deleted!",
    menu: vendor.menu,
  });
}

export { getNearbyVendors, toggleVendorStatus, getVendor, addMenuItem, updateVendorLocation, updateMenuItem, deleteMenuItem };
