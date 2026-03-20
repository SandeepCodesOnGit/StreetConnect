import mongoose from 'mongoose';
import Vendor from '../models/Vendor.js'; // Adjust path to your model
import dotenv from 'dotenv';

dotenv.config();

const vendorData = [
  {
    "username": "sharma_chaat",
    "email": "sharma@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543210",
    "role": "vendor",
    "shopName": "Sharma Ji Ki Special Chaat",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9462, 26.8467] },
    "rating": 4.8,
    "menu": [
      { "name": "Aloo Tikki", "price": 40, "description": "Crispy potato patties", "isAvailable": true },
      { "name": "Pani Puri", "price": 30, "description": "6 pieces of spicy water balls", "isAvailable": true }
    ]
  },
  {
    "username": "verma_veggies",
    "email": "verma@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543211",
    "role": "vendor",
    "shopName": "Verma Fresh Vegetables",
    "category": "Vegetables",
    "isLive": false,
    "location": { "type": "Point", "coordinates": [80.9485, 26.8490] },
    "rating": 4.5,
    "menu": [
      { "name": "Organic Tomatoes", "price": 40, "description": "1kg fresh farm tomatoes", "isAvailable": true }
    ]
  },
  {
    "username": "royal_nonveg",
    "email": "royal@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543212",
    "role": "vendor",
    "shopName": "Royal Kabab Corner",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9430, 26.8420] },
    "rating": 4.9,
    "menu": [
      { "name": "Galouti Kabab", "price": 120, "description": "Famous melt-in-mouth kababs", "isAvailable": true }
    ]
  },
  {
    "username": "gupta_fruits",
    "email": "gupta@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543213",
    "role": "vendor",
    "shopName": "Gupta Fruit Stall",
    "category": "Fruits",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9500, 26.8500] },
    "rating": 4.2,
    "menu": [
      { "name": "Seasonal Mangoes", "price": 80, "description": "1kg Dussehri Mangoes", "isAvailable": true }
    ]
  },
  {
    "username": "momo_king",
    "email": "momo@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543214",
    "role": "vendor",
    "shopName": "Momo King Lucknow",
    "category": "Food",
    "isLive": false,
    "location": { "type": "Point", "coordinates": [80.9410, 26.8450] },
    "rating": 4.6,
    "menu": [
      { "name": "Paneer Momos", "price": 60, "description": "8 pieces steamed", "isAvailable": true }
    ]
  },
  {
    "username": "tiwari_sweets",
    "email": "tiwari@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543215",
    "role": "vendor",
    "shopName": "Tiwari Jalebi Bhandar",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9550, 26.8520] },
    "rating": 4.7,
    "menu": [
      { "name": "Hot Jalebi", "price": 50, "description": "250g crispy sweet rings", "isAvailable": true }
    ]
  },
  {
    "username": "khanna_repair",
    "email": "khanna@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543216",
    "role": "vendor",
    "shopName": "Khanna Mobile Repair",
    "category": "Other",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9400, 26.8380] },
    "rating": 4.3,
    "menu": [
      { "name": "Screen Guard", "price": 99, "description": "Tempered glass installation", "isAvailable": true }
    ]
  },
  {
    "username": "pappu_chai",
    "email": "pappu@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543217",
    "role": "vendor",
    "shopName": "Pappu Cutting Chai",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9470, 26.8460] },
    "rating": 4.4,
    "menu": [
      { "name": "Masala Tea", "price": 10, "description": "Hot ginger tea", "isAvailable": true }
    ]
  },
  {
    "username": "singh_lassi",
    "email": "singh@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543218",
    "role": "vendor",
    "shopName": "Singh Punjabi Lassi",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9440, 26.8475] },
    "rating": 4.8,
    "menu": [
      { "name": "Sweet Lassi", "price": 40, "description": "Kulhad lassi with malai", "isAvailable": true }
    ]
  },
  {
    "username": "mishra_paan",
    "email": "mishra@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543219",
    "role": "vendor",
    "shopName": "Mishra Banarsi Paan",
    "category": "Other",
    "isLive": false,
    "location": { "type": "Point", "coordinates": [80.9490, 26.8430] },
    "rating": 4.5,
    "menu": [
      { "name": "Meetha Paan", "price": 25, "description": "Authentic sweet betel leaf", "isAvailable": true }
    ]
  },
  {
    "username": "lucky_burger",
    "email": "lucky@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543220",
    "role": "vendor",
    "shopName": "Lucky Egg Burger",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9455, 26.8465] },
    "rating": 4.1,
    "menu": [
      { "name": "Egg Burger", "price": 45, "description": "Street style spicy burger", "isAvailable": true }
    ]
  },
  {
    "username": "fresh_juice",
    "email": "juice@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543221",
    "role": "vendor",
    "shopName": "Pure Fresh Juices",
    "category": "Fruits",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9520, 26.8480] },
    "rating": 4.6,
    "menu": [
      { "name": "Mix Fruit Juice", "price": 50, "description": "Freshly squeezed", "isAvailable": true }
    ]
  },
  {
    "username": "south_indian",
    "email": "dosa@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543222",
    "role": "vendor",
    "shopName": "Anna Dosa Point",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9425, 26.8455] },
    "rating": 4.7,
    "menu": [
      { "name": "Masala Dosa", "price": 70, "description": "Crispy dosa with chutney", "isAvailable": true }
    ]
  },
  {
    "username": "fancy_bangles",
    "email": "bangles@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543223",
    "role": "vendor",
    "shopName": "Fancy Bangle Store",
    "category": "Other",
    "isLive": false,
    "location": { "type": "Point", "coordinates": [80.9515, 26.8410] },
    "rating": 4.0,
    "menu": [
      { "name": "Glass Bangles", "price": 120, "description": "Set of 12 colorful bangles", "isAvailable": true }
    ]
  },
  {
    "username": "sardar_paratha",
    "email": "paratha@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543224",
    "role": "vendor",
    "shopName": "Sardar Ji Ke Parathe",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9445, 26.8495] },
    "rating": 4.8,
    "menu": [
      { "name": "Paneer Paratha", "price": 60, "description": "Large butter stuffed paratha", "isAvailable": true }
    ]
  },
  {
    "username": "online_veg",
    "email": "onlineveg@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543225",
    "role": "vendor",
    "shopName": "Smart Veggie Cart",
    "category": "Vegetables",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9535, 26.8530] },
    "rating": 4.5,
    "menu": [
      { "name": "Potato Bag", "price": 100, "description": "5kg fresh potatoes", "isAvailable": true }
    ]
  },
  {
    "username": "biryani_house",
    "email": "biryani@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543226",
    "role": "vendor",
    "shopName": "Lucknowi Biryani Point",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9475, 26.8425] },
    "rating": 4.9,
    "menu": [
      { "name": "Chicken Biryani", "price": 150, "description": "Half plate authentic biryani", "isAvailable": true }
    ]
  },
  {
    "username": "sunny_snacks",
    "email": "snacks@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543227",
    "role": "vendor",
    "shopName": "Sunny Snacks & Samosas",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9482, 26.8458] },
    "rating": 4.3,
    "menu": [
      { "name": "Paneer Samosa", "price": 15, "description": "Big crispy samosa", "isAvailable": true }
    ]
  },
  {
    "username": "cool_kulfi",
    "email": "kulfi@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543228",
    "role": "vendor",
    "shopName": "Matka Kulfi Corner",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9438, 26.8488] },
    "rating": 4.6,
    "menu": [
      { "name": "Malai Kulfi", "price": 30, "description": "Traditional pot kulfi", "isAvailable": true }
    ]
  },
  {
    "username": "mega_repair",
    "email": "mega@lucknow.com",
    "password": "hashedpassword123",
    "phone": "9876543229",
    "role": "vendor",
    "shopName": "Mega Shoe Laundry",
    "category": "Other",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [80.9510, 26.8510] },
    "rating": 4.4,
    "menu": [
      { "name": "Sole Repair", "price": 150, "description": "Premium shoe stitching", "isAvailable": true }
    ]
  }
];

const seedDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/streetConnect");
        console.log("Connected to DB...");

        // Optional: Clear existing vendors first to avoid duplicates
        // await Vendor.deleteMany({}); 

        await Vendor.insertMany(vendorData);
        console.log("✅ 20 Vendors successfully saved to Database!");
        
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding data:", err);
        process.exit(1);
    }
};

seedDB();