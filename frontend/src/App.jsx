import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import NearbyVendors from "./pages/NearbyVendors";
import Navbar from "./components/Navbar";
import VendorShop from "./pages/VendorShop";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import VendorDashboard from "./pages/vendor/VendorDashboard";

const App = () => {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/nearby" element={ <NearbyVendors/>} />
        <Route path="/vendor/:id" element={ <VendorShop /> } />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/vendor-dashboard/:vendorId" element={ <VendorDashboard />} />
      </Routes>
    </>
  );
};

export default App;
