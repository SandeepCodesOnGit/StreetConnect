import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNearbyVendors } from "../hooks/useNearbyVendors";
import { useAuth } from "../context/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStoreSlash,
  faStar,
  faSpinner,
  faMapLocationDot
} from "@fortawesome/free-solid-svg-icons";

// --- 1. DEFINE THE LIVE (GREEN) ICON (SMALLER) ---
const liveIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -28],
  shadowSize: [32, 32],
});

// --- 2. DEFINE THE OFFLINE (GRAY) ICON (SMALLER) ---
const offlineIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-grey.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -28],
  shadowSize: [32, 32],
});

// --- 3. DEFINE THE USER (BLUE) ICON (SMALLER) ---
const userIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -28],
  shadowSize: [32, 32],
});

const MapCameraUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { animate: true });
  }, [center, map]);
  return null;
};

const NearbyVendors = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  // Grab coordinates from the URL, or fallback to Lucknow for testing
    const lat = searchParams.get("lat") || 26.8467;
    const lng = searchParams.get("lng") || 80.9462;
  

  // const lat = 26;
  // const lng = 80;

  const [showOnlyLive, setShowOnlyLive] = useState(false);
  const { vendors, loading, error } = useNearbyVendors(lat, lng);


  const displayedVendors = (vendors || []).filter((v) => {
    if (showOnlyLive) return v.isLive;
    return true;
  });

  const userLocation =
    lat && lng ? [parseFloat(lat), parseFloat(lng)] : [26.8467, 80.9462];

  if (!lat || !lng) {
    return (
      <div className="mt-32 text-center font-bold text-orange-600">
        Please allow location access on the Home page.
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      {/* ADDED: pt-20 (on mobile) and lg:pt-24 (on desktop) to clear the fixed Navbar */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-400 w-full mx-auto p-4 gap-4 pt-20 lg:pt-24">
        {/* SIDEBAR */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden h-125 lg:h-[calc(100vh-120px)]">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-black text-gray-800 mb-4">
              Explore Nearby
            </h2>

            <div className="flex items-center gap-3 bg-gray-50 p-2 px-4 rounded-full border border-gray-200">
              <span
                className={`text-xs font-bold uppercase ${!showOnlyLive ? "text-gray-900" : "text-gray-400"}`}
              >
                All
              </span>
              <button
                onClick={() => setShowOnlyLive(!showOnlyLive)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${showOnlyLive ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${showOnlyLive ? "translate-x-6" : "translate-x-0"}`}
                ></div>
              </button>
              <span
                className={`text-xs font-bold uppercase flex items-center gap-1 ${showOnlyLive ? "text-green-600" : "text-gray-400"}`}
              >
                Live Now
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {loading ? (
              <div className="text-center mt-10">
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="animate-spin text-3xl text-orange-500 mb-2"
                />
                <p className="text-gray-500 text-sm font-medium">
                  Scanning for vendors...
                </p>
              </div>
            ) : displayedVendors.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <FontAwesomeIcon
                  icon={faStoreSlash}
                  className="text-4xl mb-3 opacity-20"
                />
                <p className="text-sm font-bold">
                  No vendors active in this area.
                </p>
              </div>
            ) : (
             displayedVendors.map((vendor) => (
                <div
                  key={vendor._id}
                  className="group flex flex-col p-4 border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all bg-white"
                >
                  <div className="flex gap-4 cursor-pointer" onClick={() => navigate(`/vendor/${vendor._id}`)}>
                    <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0 relative overflow-hidden">
                      <span
                        className={`absolute top-1 left-1 px-2 py-0.5 text-[9px] font-black rounded-md text-white z-10 ${vendor.isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                      >
                        {vendor.isLive ? "LIVE" : "OFFLINE"}
                      </span>
                      <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200"
                        alt="shop"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <p className="text-[10px] uppercase text-orange-500 font-black tracking-widest mb-1">
                        {vendor.category}
                      </p>
                      <h4 className="font-bold text-gray-900 text-base mb-1">
                        {vendor.shopName}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 gap-2">
                        <span className="text-yellow-500 font-bold">
                          <FontAwesomeIcon icon={faStar} className="mr-1" />{" "}
                          {vendor.rating || "New"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 🚨 UPDATED: Buttons in Sidebar */}
                  <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2">
                    {/* Only show Track Live if vendor is Live AND user is logged in AND user is not a vendor */}
                    {vendor.isLive && user && user.role !== 'vendor' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/track/${vendor._id}`);
                        }}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faMapLocationDot} /> Track Live
                      </button>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/vendor/${vendor._id}`);
                      }}
                      className="flex-1 bg-orange-100 hover:bg-orange-500 hover:text-white text-orange-600 py-2 rounded-xl text-xs font-bold transition"
                    >
                      View Menu
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
        {/* MAP */}
        <div className="w-full lg:w-2/3 bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden h-125 lg:h-[calc(100vh-120px)] relative z-0">
          <MapContainer
            center={userLocation}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />
            <MapCameraUpdater center={userLocation} />

            {/* User Location */}
            <Marker position={userLocation} icon={userIcon}>
              <Popup className="custom-popup">📍 You are here!</Popup>
            </Marker>

            {/* Vendor Markers */}
            {displayedVendors.map((vendor) => (
              <Marker
                key={vendor._id}
                position={[
                  vendor.location.coordinates[1],
                  vendor.location.coordinates[0],
                ]}
                icon={vendor.isLive ? liveIcon : offlineIcon}
              >
                <Popup>
                  <div className="text-center p-1">
                    <strong className="block text-gray-900 text-base mb-1">
                      {vendor.shopName}
                    </strong>
                    <div className="flex flex-col gap-2 mt-2">
                      {/* 🚨 UPDATED: Button inside Map Popup */}
                      {vendor.isLive && user && user.role !== 'vendor' && (
                        <button 
                          onClick={() => navigate(`/track/${vendor._id}`)} 
                          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold w-full flex justify-center items-center gap-2"
                        >
                          <FontAwesomeIcon icon={faMapLocationDot} /> Track Live
                        </button>
                      )}
                      <button 
                        onClick={() => navigate(`/vendor/${vendor._id}`)} 
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold w-full"
                      >
                        VIEW MENU
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
};

export default NearbyVendors;
