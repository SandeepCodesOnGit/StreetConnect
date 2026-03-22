import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import api from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';


import MenuList from '../../components/vendor/MenuList';
import AddMenu from '../../components/vendor/AddMenu';
import LiveOrders from '../../components/vendor/LiveOrders';

// IMPORT YOUR COMPONENTS


const socket = io("http://localhost:8080");

const VendorDashboard = () => {
  const { vendorId } = useParams();
  
  // 🚨 activeTab state is completely gone! React Router handles it now.
  const [isLive, setIsLive] = useState(false); 
  const lastDbSyncTime = useRef(0); 

  useEffect(() => {
    fetchVendorStatus();
  }, [vendorId]);

  // GPS Radar with Database Sync
  useEffect(() => {
    let watchId;
    if(isLive) {
      if("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition((position) => {
          const { latitude, longitude } = position.coords;
          socket.emit("updateVendorLocation", { vendorId: vendorId, lat: latitude, lng: longitude });

          const now = Date.now();
          if (now - lastDbSyncTime.current > 15000) {
            api.put(`/vendors/${vendorId}/location`, { lat: latitude, lng: longitude })
              .catch(err => console.error("Failed to sync location to DB:", err));
            lastDbSyncTime.current = now;
          }
        },
        (err) => {
          if(err.code === 1) alert("Please allow location access to be visible to customers!");
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 });
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }
    return () => {
      if(watchId) navigator.geolocation.clearWatch(watchId);
    }
  }, [isLive, vendorId]);

  const fetchVendorStatus = async () => {
    try {
      const res = await api.get(`/vendors/${vendorId}`);
      if (res.data.success && res.data.vendor) {
        setIsLive(res.data.vendor.isLive);
      }
    } catch (err) {
      console.error("Failed to load vendor status");
    }
  };

  const handleToggleLive = async () => {
    try {
      setIsLive(prev => !prev); 
      const res = await api.put(`/vendors/${vendorId}/status`);
      if (!res.data.success) setIsLive(prev => !prev);
    } catch (error) {
      setIsLive(prev => !prev); 
      alert("Failed to update status.");
    }
  };

  // Helper function to style active links cleanly
  const navLinkClass = ({ isActive }) => 
    `font-bold pb-3 px-2 transition border-b-2 ${isActive ? 'text-orange-500 border-orange-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`;

  return (
    <div className="pt-24 min-h-screen bg-gray-100 pb-32">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        
        {/* --- HEADER --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <FontAwesomeIcon icon={faStore} className="text-orange-500" /> Vendor Dashboard
            </h1>
            
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <span className={`font-black uppercase tracking-widest text-xs ${isLive ? 'text-green-500' : 'text-gray-400'}`}>
                {isLive ? 'Online' : 'Offline'}
              </span>
              <button onClick={handleToggleLive} className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${isLive ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isLive ? 'translate-x-8' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          
          {/* 🚨 REPLACED BUTTONS WITH ROUTER NavLinks */}
          <div className="flex gap-6 border-b border-gray-100 pb-0 overflow-x-auto whitespace-nowrap">
            <NavLink to={`/vendor-dashboard/${vendorId}/orders`} className={navLinkClass}>
              Live Orders
            </NavLink>
            <NavLink to={`/vendor-dashboard/${vendorId}/menu`} className={navLinkClass}>
              My Products
            </NavLink>
            <NavLink to={`/vendor-dashboard/${vendorId}/add`} className={navLinkClass}>
              + Add Product
            </NavLink>
          </div>
        </div>

        {/* 🚨 DYNAMIC NESTED ROUTES GO HERE */}
        <Routes>
          {/* If they just type /vendor-dashboard/123, redirect them to the orders tab */}
          <Route path="/" element={<Navigate to="orders" replace />} />
          
          {/* Sub-routes */}
          <Route path="orders" element={<LiveOrders vendorId={vendorId} />} />
          <Route path="menu" element={<MenuList vendorId={vendorId} />} />
          <Route path="add" element={<AddMenu vendorId={vendorId} />} />
        </Routes>

      </div>
    </div>
  );
};

export default VendorDashboard;