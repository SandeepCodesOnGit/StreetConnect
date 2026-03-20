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

  const vendor = await Vendor.findById(id);
  console.log(vendor)
  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  vendor.isLive = !vendor.isLive;
  await vendor.save();

  const io = req.app.get("io");

  if(io) {
    io.emit("vendorStatusChanged", {
      vendorId: vendor._id,
      isLive: vendor.isLive
    });
    console.log(`Broadcasted status change for vendor ${vendor._id} (Live: ${vendor.isLive})`);
  }

  res.status(200).json({
    success: true,
    message: `You are now ${vendor.isLive ? "LIVE" : "OFFLINE"}`,
    isLive: vendor.isLive,
  });
};

const addMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;

  if (!name || !price) {
    return res.status(400).json({ 
        success: false, 
        message: "Name and price are required" 
    });
  }
console.log(req.body);
  const vendor = await Vendor.findById(id);

  if (!vendor) {
    return res.status(404).json({ 
        success: false, 
        message: "Vendor not found" 
    });
  }

  const newItem = {
    name: name,
    description: description,
    price: Number(price),
    isAvailable: true,
    imageUrl: image,
  };
  console.log(newItem)
  vendor.menu.push(newItem);
  await vendor.save();

  res.status(201).json({ 
    success: true, 
    message: "Menu item added!", 
    menu: vendor.menu 
});
};

export { getNearbyVendors, toggleVendorStatus, getVendor, addMenuItem };
