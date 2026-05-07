import Vendor from "../models/Vendor.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const generateAiMenu = async (req, res) => {
//   const { imageBase64 } = req.body;

//   if (!imageBase64) {
//     return res.status(400).json({
//       success: false,
//       message: "Image is required",
//     });
//   }
//   const base64Data = imageBase64.split(",")[1];
//   // console.log(base64Data);

//   const mimeType = imageBase64.substring(
//     imageBase64.indexOf(":") + 1,
//     imageBase64.indexOf(";"),
//   );

//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({
//     model: "gemini-3-flash-preview",
//   });

//   // 3. The Strict, Universal Marketplace Prompt
//   const prompt = `
//       You are an AI assistant for a universal local marketplace application in India.
//       Analyze this image of a vendor's shop, cart, or inventory. The vendor could be selling ANYTHING (e.g., groceries, clothing, street food, electronics, hardware, books, toys, or services).
      
//       Identify the distinct items visible in the image. For each item, generate the following:
//       - "name": The clear, common name of the item.
//       - "description": A short, attractive 1-2 sentence description suitable for an e-commerce platform.
//       - "price": A realistic estimated price in INR (₹).
//       - "isAvailable": Always set this to true (the vendor can turn it off later).
//       - "imageUrl": Create a working image URL according to the item name.
      
//       Return ONLY a raw JSON array. Do not include markdown, HTML, or code block ticks (like \`\`\`json).
//       The output MUST match this exact structure:
//       [
//         { 
//           "name": "Men's Cotton Shirt", 
//           "description": "Comfortable, breathable cotton shirt perfect for daily wear.",
//           "price": 450, 
//           "isAvailable": true,
//           "imageUrl": "URL should be generated based on the item name"
//         },
//         { 
//           "name": "Fresh Apples", 
//           "description": "Sweet and crisp red apples, sourced locally.",
//           "price": 120, 
//           "isAvailable": true,
//           "imageUrl": "URL should be generated based on the item name"
//         }
//       ]
//     `;

//   const imagePart = {
//     inlineData: {
//       data: base64Data,
//       mimeType: mimeType,
//     },
//   };

//   let result;
//   let retries = 5;

//   while (retries > 0) {
//     try {
//       result = await model.generateContent([prompt, imagePart]);
//       break;
//     } catch (error) {
//       if (error.status === 503 && retries > 1) {
//         console.log(
//           `[AI Traffic Jam] Google is busy. Retrying... (${retries - 1} attempts left)`,
//         );
//         await new Promise((resolve) => setTimeout(resolve, 2000));
//         retries--;
//       } else if (error.status === 429) {
//         return res.status(429).json({
//           success: false,
//           message: "Rate limit exceeded. Please wait a moment and try again.",
//         });
//       } else {
//         throw error;
//       }
//     }
//   }

//   let responseText = result.response.text();
//   console.log(responseText);

//   // 5. Clean the response (just in case Gemini adds markdown ticks anyway)
//   responseText = responseText
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   // 6. Parse and send back to React
//   const menuItems = JSON.parse(responseText);

//   res.status(200).json({
//     success: true,
//     items: menuItems,
//   });
// };

// const getSmartHeatmap = async (req, res) => {
//   try {
//     const { latitude, longitude, category } = req.body;

//     if (!latitude || !longitude) {
//       return res.status(400).json({
//         success: false,
//         message: "Location data missing",
//       });
//     }

//     // Get the current time in India so the AI knows if it's lunch, evening snacks, or dinner!
//     const currentTime = new Date().toLocaleTimeString("en-IN", {
//       timeZone: "Asia/Kolkata",
//     });

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

//     // The Strict JSON Prompt for Location Strategy
//     const prompt = `
//       You are an AI business strategist for a local street vendor application in India.
//       A vendor selling "${category}" is currently at GPS coordinates: [${latitude}, ${longitude}].
//       The current time is ${currentTime}.
      
//       Based on typical urban traffic, residential patterns, or logical foot traffic at this time of day, calculate a nearby "hotspot" within a 1km radius where they should move their cart right now to maximize sales.
      
//       Return ONLY a raw JSON object. Do not include markdown or code block ticks.
//       The output MUST match this exact structure:
//       {
//         "hotspotLat": number,
//         "hotspotLng": number,
//         "radiusInMeters": number,
//         "reason": "A short, 1-2 sentence explanation of why this spot is busy right now."
//       }
//     `;

//     let result;
//     let retries = 5;

//     // The Auto-Retry Loop for Traffic Jams
//     while (retries > 0) {
//       try {
//         result = await model.generateContent(prompt);
//         break;
//       } catch (error) {
//         if (error.status === 503 && retries > 1) {
//           console.log(
//             `[AI Traffic Jam] Google is busy. Retrying... (${retries - 1} attempts left)`,
//           );
//           await new Promise((resolve) => setTimeout(resolve, 2000));
//           retries--;
//         } else if (error.status === 429) {
//           return res.status(429).json({
//             success: false,
//             message:
//               "⏳ Rate limit exceeded. Please wait 60 seconds and try again.",
//           });
//         } else {
//           throw error;
//         }
//       }
//     }

//     let responseText = result.response.text();
//     console.log(responseText);

//     // Clean and parse the JSON string
//     responseText = responseText
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();
//     const heatmapData = JSON.parse(responseText);

//     res.status(200).json({
//       success: true,
//       data: heatmapData,
//     });
//   } catch (error) {
//     console.error("AI Heatmap Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred while generating the heatmap.",
//     });
//   }
// };

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
        $maxDistance: 10000,
      },
    },
  }).select("-password");

  res.status(200).json({
    success: true,
    count: nearbyVendors.length,
    vendors: nearbyVendors,
  });
};

const getVendorCategories = async (req, res) => {
  const rawCategories = await Vendor.distinct("category");

  const defaultCategories = [
    "food",
    "vegetables",
    "fruits",
    "repair",
    "clothing",
    "electronics",
    "books",
    "furniture",
    "toys",
    "health",
    "beauty",
  ];

  const combined = [
    ...new Set([
      ...defaultCategories,
      ...rawCategories.map((c) => c.toLowerCase()),
    ]),
  ];

  const categories = combined
    .sort()
    .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1));
  res.status(200).json({ success: true, categories: categories });
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
    return res.status(403).json({
      success: false,
      message: "Forbidden: You can only update your own status.",
    });
  }

  const vendor = await Vendor.findById(id);
  // console.log(vendor);
  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  vendor.isLive = !vendor.isLive;
  await vendor.save();

  const io = req.app.get("io");

  if (io) {
    io.to(vendor._id.toString()).emit("vendorStatusChanged", {
      vendorId: vendor._id.toString(),
      isLive: vendor.isLive,
    });
    // console.log(
    //   `Broadcasted status change for vendor ${vendor._id} (Live: ${vendor.isLive})`,
    // );
  }
  vendor;
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
    return res.status(403).json({
      success: false,
      message: "Forbidden: You can only update your own location.",
    });
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
  const { name, description, price, imageUrl } = req.body;

  if (req.user._id.toString() !== id) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: You can only add items to your own menu.",
    });
  }

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: "Name and price are required",
    });
  }
  // console.log(req.body);
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
    imageUrl: imageUrl,
  };

  vendor.menu.push(newItem);
  await vendor.save();

  const io = req.app.get("io");
  if (io) {
    io.to(vendor._id.toString()).emit("menuUpdated", {
      vendorId: vendor._id.toString(),
      menu: vendor.menu,
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

  if (req.user.id.toString() !== id) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Not your menu." });
  }

  const vendor = await Vendor.findById(id);
  if (!vendor) {
    return res
      .status(404)
      .json({ success: false, message: "Vendor not found" });
  }

  const item = vendor.menu.id(itemId);
  if (!item) {
    return res
      .status(404)
      .json({ success: false, message: "Menu item not found" });
  }

  if (name) item.name = name;
  if (description) item.description = description;
  if (price) item.price = Number(price);
  if (isAvailable !== undefined) item.isAvailable = isAvailable;
  if (image !== undefined) item.imageUrl = image;

  await vendor.save();

  const io = req.app.get("io");
  if (io) {
    io.to(vendor._id.toString()).emit("menuUpdated", {
      vendorId: vendor._id.toString(),
      menu: vendor.menu,
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

  if (req.user.id.toString() !== id) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Not your menu." });
  }
  const vendor = await Vendor.findById(id);
  if (!vendor) {
    return res
      .status(404)
      .json({ success: false, message: "Vendor not found" });
  }

  vendor.menu.pull(itemId);
  await vendor.save();

  const io = req.app.get("io");
  if (io) {
    io.to(vendor._id.toString()).emit("menuUpdated", {
      vendorId: id.toString(),
      menu: vendor.menu,
    });
  }

  res.status(200).json({
    success: true,
    message: "Menu item deleted!",
    menu: vendor.menu,
  });
};

const updateVendorProfile = async (req, res) => {
  const { id } = req.params;

  const { shopName, phone, category, profilePic } = req.body;
  
  if (phone && !/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Phone number must be exactly 10 digits.",
    });
  }

  if (req.user._id.toString() !== id) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: You can only update your own profile.",
    });
  }

  const updateData = {};
  if (shopName) updateData.shopName = shopName;
  if (phone) updateData.phone = phone;
  if (category) updateData.category = category.toLowerCase();
  if (profilePic) updateData.profilePic = profilePic;

  const updatedVendor = await Vendor.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).select("-password");

  if (!updatedVendor) {
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    vendor: updatedVendor,
  });
};

export {
  getNearbyVendors,
  toggleVendorStatus,
  getVendor,
  addMenuItem,
  updateVendorLocation,
  updateMenuItem,
  deleteMenuItem,
  getVendorCategories,
  updateVendorProfile,
};
