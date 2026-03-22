import mongoose from 'mongoose';
import Vendor from '../models/Vendor.js'; // Adjust path to your model
import dotenv from 'dotenv';

dotenv.config();

const vendorData = [
  {
    "username": "iiit_canteen_king",
    "shopName": "Jhalwa Hotspot",
    "email": "canteen@iiita.ac.in",
    "password": "hashedpassword101",
    "phone": "9876543001",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7705, 25.4295] },
    "rating": 4.5,
    "menu": [
      { "name": "Cheese Maggi", "price": 45, "description": "Exam night fuel", "isAvailable": true },
      { "name": "Veg Grilled Sandwich", "price": 50, "description": "Crispy and fresh", "isAvailable": true },
      { "name": "Cold Coffee", "price": 60, "description": "With chocolate syrup", "isAvailable": true }
    ]
  },
  {
    "username": "sharma_tea_iiit",
    "shopName": "Sharma Ji Ki Tapri",
    "email": "sharma@jhalwa.com",
    "password": "hashedpassword102",
    "phone": "9876543002",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7720, 25.4302] },
    "rating": 4.8,
    "menu": [
      { "name": "Adrak Chai", "price": 10, "description": "Fresh ginger tea", "isAvailable": true },
      { "name": "Bun Makkhan", "price": 25, "description": "Freshly buttered bun", "isAvailable": true },
      { "name": "Samosa", "price": 12, "description": "Classic potato filling", "isAvailable": true }
    ]
  },
  {
    "username": "pantry_plus",
    "shopName": "The Student Pantry",
    "email": "pantry@prayagraj.com",
    "password": "hashedpassword103",
    "phone": "9876543003",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7735, 25.4310] },
    "rating": 4.2,
    "menu": [
      { "name": "Veg Burger", "price": 45, "description": "Potato patty with mayo", "isAvailable": true },
      { "name": "French Fries", "price": 60, "description": "Salted golden fries", "isAvailable": true },
      { "name": "Lemon Ice Tea", "price": 40, "description": "Refreshing and chilled", "isAvailable": true }
    ]
  },
  {
    "username": "jhalwa_bites",
    "shopName": "Jhalwa Food Court",
    "email": "admin@jhalwabites.com",
    "password": "hashedpassword104",
    "phone": "9876543004",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7712, 25.4288] },
    "rating": 3.9,
    "menu": [
      { "name": "Chicken Roll", "price": 80, "description": "Kolkata style", "isAvailable": true },
      { "name": "Egg Roll", "price": 50, "description": "Double egg", "isAvailable": true },
      { "name": "Paneer Tikka Roll", "price": 90, "description": "Spicy paneer filling", "isAvailable": true }
    ]
  },
  {
    "username": "momo_nation_alld",
    "shopName": "Momo Nation",
    "email": "momo@jhalwa.com",
    "password": "hashedpassword105",
    "phone": "9876543005",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7690, 25.4320] },
    "rating": 4.4,
    "menu": [
      { "name": "Veg Steamed Momos", "price": 60, "description": "8 pieces with chutney", "isAvailable": true },
      { "name": "Fried Momos", "price": 80, "description": "Crispy fried", "isAvailable": true },
      { "name": "Paneer Steam Momos", "price": 100, "description": "Soft paneer chunks", "isAvailable": true },
      { "name": "Kurkure Momos", "price": 120, "description": "Extra crunchy", "isAvailable": true }
    ]
  },
  {
    "username": "sangam_sweets",
    "shopName": "Sangam Delights",
    "email": "sweets@prayagraj.in",
    "password": "hashedpassword106",
    "phone": "9876543006",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7750, 25.4335] },
    "rating": 4.6,
    "menu": [
      { "name": "Gulab Jamun", "price": 30, "description": "Hot and fresh (2pcs)", "isAvailable": true },
      { "name": "Rasmalai", "price": 50, "description": "Soft and milky", "isAvailable": true },
      { "name": "Jalebi", "price": 40, "description": "Pure desi ghee", "isAvailable": true }
    ]
  },
  {
    "username": "engineers_cafe",
    "shopName": "The Debug Cafe",
    "email": "debug@iiit.com",
    "password": "hashedpassword107",
    "phone": "9876543007",
    "role": "vendor",
    "category": "Food",
    "isLive": false,
    "location": { "type": "Point", "coordinates": [81.7710, 25.4275] },
    "rating": 4.1,
    "menu": [
      { "name": "Cappuccino", "price": 80, "description": "Frothy coffee", "isAvailable": true },
      { "name": "Iced Latte", "price": 90, "description": "Vanilla flavored", "isAvailable": true },
      { "name": "Brownie", "price": 70, "description": "With hot chocolate", "isAvailable": true }
    ]
  },
  {
    "username": "paratha_house_alld",
    "shopName": "Aloo Paratha Junction",
    "email": "paratha@jhalwa.com",
    "password": "hashedpassword108",
    "phone": "9876543008",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7700, 25.4305] },
    "rating": 4.3,
    "menu": [
      { "name": "Aloo Pyaz Paratha", "price": 50, "description": "With curd", "isAvailable": true },
      { "name": "Paneer Paratha", "price": 80, "description": "Stuffed with paneer", "isAvailable": true },
      { "name": "Gobi Paratha", "price": 60, "description": "Seasonal cauliflower", "isAvailable": true }
    ]
  },
  {
    "username": "dosa_plaza_jhalwa",
    "shopName": "South Express",
    "email": "south@alld.com",
    "password": "hashedpassword109",
    "phone": "9876543009",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7725, 25.4290] },
    "rating": 4.0,
    "menu": [
      { "name": "Masala Dosa", "price": 80, "description": "Traditional style", "isAvailable": true },
      { "name": "Idli Sambar", "price": 40, "description": "Soft steamed (2pcs)", "isAvailable": true },
      { "name": "Vada Sambhar", "price": 50, "description": "Crispy dal vadas", "isAvailable": true }
    ]
  },
  {
    "username": "burger_lab",
    "shopName": "The Burger Lab",
    "email": "lab@jhalwa.com",
    "password": "hashedpassword110",
    "phone": "9876543010",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7745, 25.4325] },
    "rating": 4.5,
    "menu": [
      { "name": "Cheese Burger", "price": 110, "description": "Extra cheese slice", "isAvailable": true },
      { "name": "Crispy Chicken Burger", "price": 140, "description": "Deep fried chicken", "isAvailable": true },
      { "name": "Peri Peri Fries", "price": 80, "description": "Spicy seasoning", "isAvailable": true }
    ]
  },
  {
    "username": "biryani_blues_alld",
    "shopName": "Sangam Biryani",
    "email": "biryani@prayag.com",
    "password": "hashedpassword111",
    "phone": "9876543011",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7685, 25.4285] },
    "rating": 4.7,
    "menu": [
      { "name": "Hyderabadi Biryani", "price": 220, "description": "Served with Salan", "isAvailable": true },
      { "name": "Egg Biryani", "price": 150, "description": "2 eggs included", "isAvailable": true },
      { "name": "Veg Dum Biryani", "price": 130, "description": "Slow cooked veggies", "isAvailable": true }
    ]
  },
  {
    "username": "juice_vibes",
    "shopName": "Healthy Vibes Juice",
    "email": "health@jhalwa.com",
    "password": "hashedpassword112",
    "phone": "9876543012",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7715, 25.4315] },
    "rating": 4.2,
    "menu": [
      { "name": "Orange Juice", "price": 60, "description": "Pure orange", "isAvailable": true },
      { "name": "Apple Juice", "price": 80, "description": "Cold pressed", "isAvailable": true },
      { "name": "Watermelon Juice", "price": 50, "description": "Summer special", "isAvailable": true }
    ]
  },
  {
    "username": "wrap_it_up",
    "shopName": "Wrap It Up",
    "email": "wrap@iiita.com",
    "password": "hashedpassword113",
    "phone": "9876543013",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7702, 25.4298] },
    "rating": 4.1,
    "menu": [
      { "name": "Paneer Tikka Wrap", "price": 95, "description": "Whole wheat base", "isAvailable": true },
      { "name": "Potato Wedges", "price": 60, "description": "Spicy roasted", "isAvailable": true },
      { "name": "Chicken Wrap", "price": 120, "description": "Grilled chicken strips", "isAvailable": true }
    ]
  },
  {
    "username": "kathi_junction_alld",
    "shopName": "Kathi Junction Jhalwa",
    "email": "kathi@prayag.com",
    "password": "hashedpassword114",
    "phone": "9876543014",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7730, 25.4308] },
    "rating": 4.4,
    "menu": [
      { "name": "Double Egg Roll", "price": 60, "description": "Classic Kolkata style", "isAvailable": true },
      { "name": "Egg Chicken Roll", "price": 100, "description": "Best seller", "isAvailable": true },
      { "name": "Veg Roll", "price": 40, "description": "Mix veg filling", "isAvailable": true }
    ]
  },
  {
    "username": "waffle_house_iiit",
    "shopName": "The Waffle House",
    "email": "waffle@jhalwa.com",
    "password": "hashedpassword115",
    "phone": "9876543015",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7740, 25.4330] },
    "rating": 4.6,
    "menu": [
      { "name": "Belgian Waffle", "price": 140, "description": "Maple syrup & butter", "isAvailable": true },
      { "name": "Nutella Waffle", "price": 180, "description": "Loaded with chocolate", "isAvailable": true },
      { "name": "Strawberry Waffle", "price": 160, "description": "Fresh berries", "isAvailable": true }
    ]
  },
  {
    "username": "pizza_paradise_alld",
    "shopName": "Pizza Paradise",
    "email": "pizza@jhalwa.com",
    "password": "hashedpassword116",
    "phone": "9876543016",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7708, 25.4282] },
    "rating": 3.7,
    "menu": [
      { "name": "Margherita", "price": 200, "description": "Extra cheese", "isAvailable": true },
      { "name": "Farmhouse Pizza", "price": 300, "description": "Fresh veggies", "isAvailable": true },
      { "name": "Coke 500ml", "price": 40, "description": "Chilled beverage", "isAvailable": true }
    ]
  },
  {
    "username": "thali_express",
    "shopName": "Maa Annapurna Thali",
    "email": "thali@jhalwa.com",
    "password": "hashedpassword117",
    "phone": "9876543017",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7695, 25.4312] },
    "rating": 4.8,
    "menu": [
      { "name": "Standard Thali", "price": 80, "description": "Dal, Sabzi, 4 Roti", "isAvailable": true },
      { "name": "Executive Thali", "price": 150, "description": "Paneer, Dal, Sweet, Rice", "isAvailable": true },
      { "name": "Buttermilk", "price": 20, "description": "Masala Chaas", "isAvailable": true }
    ]
  },
  {
    "username": "shake_it_up",
    "shopName": "Shake It Up",
    "email": "shake@prayag.com",
    "password": "hashedpassword118",
    "phone": "9876543018",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7722, 25.4296] },
    "rating": 4.3,
    "menu": [
      { "name": "Oreo Shake", "price": 90, "description": "Extra thick", "isAvailable": true },
      { "name": "Mango Shake", "price": 70, "description": "Fresh fruit", "isAvailable": true },
      { "name": "KitKat Shake", "price": 100, "description": "Chocolate crunch", "isAvailable": true }
    ]
  },
  {
    "username": "nashta_point",
    "shopName": "Morning Nashta",
    "email": "nashta@jhalwa.com",
    "password": "hashedpassword119",
    "phone": "9876543019",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7755, 25.4340] },
    "rating": 4.0,
    "menu": [
      { "name": "Poha", "price": 30, "description": "Indori style", "isAvailable": true },
      { "name": "Upma", "price": 40, "description": "Suji based", "isAvailable": true },
      { "name": "Bread Omlette", "price": 50, "description": "2 eggs", "isAvailable": true }
    ]
  },
  {
    "username": "chaat_bhandar_alld",
    "shopName": "Gupta Chaat Bhandar",
    "email": "gupta@jhalwa.com",
    "password": "hashedpassword120",
    "phone": "9876543020",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7718, 25.4318] },
    "rating": 4.9,
    "menu": [
      { "name": "Aloo Tikki", "price": 40, "description": "Desi ghee fried", "isAvailable": true },
      { "name": "Pani Puri", "price": 20, "description": "6 pieces", "isAvailable": true },
      { "name": "Papdi Chaat", "price": 50, "description": "Tangy and sweet", "isAvailable": true }
    ]
  },
  {
    "username": "pasta_la_vista",
    "shopName": "Pasta La Vista",
    "email": "pasta@iiita.com",
    "password": "hashedpassword121",
    "phone": "9876543021",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7738, 25.4322] },
    "rating": 4.2,
    "menu": [
      { "name": "White Sauce Pasta", "price": 120, "description": "Creamy Alfredo", "isAvailable": true },
      { "name": "Red Sauce Pasta", "price": 110, "description": "Spicy Arrabbiata", "isAvailable": true },
      { "name": "Garlic Bread", "price": 60, "description": "Buttery (4pcs)", "isAvailable": true }
    ]
  },
  {
    "username": "sandwich_central",
    "shopName": "Sandwich Central",
    "email": "sand@jhalwa.com",
    "password": "hashedpassword122",
    "phone": "9876543022",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7680, 25.4270] },
    "rating": 3.8,
    "menu": [
      { "name": "Corn Cheese Sandwich", "price": 70, "description": "Sweet corn", "isAvailable": true },
      { "name": "Paneer Junglee Sandwich", "price": 85, "description": "Spicy mashed paneer", "isAvailable": true },
      { "name": "Aloo Masala Sandwich", "price": 40, "description": "Classic toast", "isAvailable": true }
    ]
  },
  {
    "username": "kulfi_king_alld",
    "shopName": "Kulfi King Jhalwa",
    "email": "kulfi@prayag.in",
    "password": "hashedpassword123",
    "phone": "9876543023",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7706, 25.4328] },
    "rating": 4.7,
    "menu": [
      { "name": "Pista Kulfi", "price": 40, "description": "Rich nuts", "isAvailable": true },
      { "name": "Badam Shake", "price": 60, "description": "Chilled almond milk", "isAvailable": true },
      { "name": "Malai Kulfi", "price": 35, "description": "Pure cream", "isAvailable": true }
    ]
  },
  {
    "username": "chowmein_express",
    "shopName": "Chowmein Express",
    "email": "chow@jhalwa.com",
    "password": "hashedpassword124",
    "phone": "9876543024",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7728, 25.4345] },
    "rating": 4.1,
    "menu": [
      { "name": "Veg Chowmein", "price": 60, "description": "Street style", "isAvailable": true },
      { "name": "Manchurian", "price": 80, "description": "Dry or gravy", "isAvailable": true },
      { "name": "Spring Rolls", "price": 50, "description": "Crispy (2pcs)", "isAvailable": true }
    ]
  },
  {
    "username": "lassi_bar_iiit",
    "shopName": "Banarasi Lassi",
    "email": "lassi@iiita.com",
    "password": "hashedpassword125",
    "phone": "9876543025",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7742, 25.4285] },
    "rating": 4.5,
    "menu": [
      { "name": "Kulhad Lassi", "price": 50, "description": "Thick cream", "isAvailable": true },
      { "name": "Cold Milk", "price": 40, "description": "Kesar Badam", "isAvailable": true },
      { "name": "Rabri", "price": 60, "description": "Traditional sweet", "isAvailable": true }
    ]
  },
  {
    "username": "frankie_king",
    "shopName": "Frankie Point",
    "email": "frank@jhalwa.com",
    "password": "hashedpassword126",
    "phone": "9876543026",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7692, 25.4292] },
    "rating": 4.3,
    "menu": [
      { "name": "Cheese Frankie", "price": 60, "description": "Loaded cheese", "isAvailable": true },
      { "name": "Schezwan Frankie", "price": 55, "description": "Extra spicy", "isAvailable": true },
      { "name": "Corn Frankie", "price": 50, "description": "Buttery corn", "isAvailable": true }
    ]
  },
  {
    "username": "pav_bhaji_center",
    "shopName": "Bombay Pav Bhaji",
    "email": "pav@jhalwa.com",
    "password": "hashedpassword127",
    "phone": "9876543027",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7716, 25.4300] },
    "rating": 4.4,
    "menu": [
      { "name": "Butter Pav Bhaji", "price": 80, "description": "Amul butter", "isAvailable": true },
      { "name": "Cheese Pav Bhaji", "price": 110, "description": "Grated cheese", "isAvailable": true },
      { "name": "Extra Pav", "price": 20, "description": "2 pieces", "isAvailable": true }
    ]
  },
  {
    "username": "egg_it_up",
    "shopName": "Egg Variety Corner",
    "email": "egg@iiita.com",
    "password": "hashedpassword128",
    "phone": "9876543028",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7732, 25.4315] },
    "rating": 3.9,
    "menu": [
      { "name": "Boiled Eggs", "price": 20, "description": "2 eggs", "isAvailable": true },
      { "name": "Masala Omlette", "price": 40, "description": "Spicy onion tomato", "isAvailable": true },
      { "name": "Egg Bhurji", "price": 60, "description": "With 2 pavs", "isAvailable": true }
    ]
  },
  {
    "username": "sweet_fix_jhalwa",
    "shopName": "Dessert Heaven",
    "email": "fix@jhalwa.com",
    "password": "hashedpassword129",
    "phone": "9876543029",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7752, 25.4328] },
    "rating": 4.6,
    "menu": [
      { "name": "Sizzling Brownie", "price": 120, "description": "With vanilla ice cream", "isAvailable": true },
      { "name": "Choco Lava Cake", "price": 90, "description": "Molten chocolate", "isAvailable": true },
      { "name": "Waffle Cone", "price": 50, "description": "2 scoops", "isAvailable": true }
    ]
  },
  {
    "username": "chai_sutta_jhalwa",
    "shopName": "The Chai Sutta Bar",
    "email": "chai@iiit.com",
    "password": "hashedpassword130",
    "phone": "9876543030",
    "role": "vendor",
    "category": "Food",
    "isLive": true,
    "location": { "type": "Point", "coordinates": [81.7704, 25.4308] },
    "rating": 4.8,
    "menu": [
      { "name": "Ginger Chai", "price": 15, "description": "Kulhad tea", "isAvailable": true },
      { "name": "Maskabun", "price": 30, "description": "Butter and cream", "isAvailable": true },
      { "name": "Rose Chai", "price": 20, "description": "Floral taste", "isAvailable": true },
      { "name": "Iced Tea", "price": 40, "description": "Lemon and peach", "isAvailable": true }
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