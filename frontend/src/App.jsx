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
import TrackVendor from "./pages/TrackVendor";
import ProtectedRoute from "./components/ProtectedRoute";



const App = () => {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/nearby" element={ <NearbyVendors/>} />
        <Route 
          path="/vendor/:id" 
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <VendorShop />
            </ProtectedRoute>
          } />
        <Route 
          path="/orders" 
          element={ 
            <ProtectedRoute allowedRoles={["user"]}>
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/track/:vendorId" 
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <TrackVendor/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders/:id" 
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <OrderDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vendor-dashboard/:vendorId/*" 
          element={ 
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
};

export default App;
