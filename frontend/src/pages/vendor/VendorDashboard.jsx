import React, { useState, useEffect, useRef } from "react";
import {
  useParams,
  useNavigate,
  NavLink,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import api from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Added faEdit, faTimes, and faCamera for the edit UI
import {
  faStore,
  faRobot,
  faEdit,
  faTimes,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { useSocketContext } from "../../socket/SocketContext";

import MenuList from "../../components/vendor/MenuList";
import AddMenu from "../../components/vendor/AddMenu";
import LiveOrders from "../../components/vendor/LiveOrders";
// import AutoMenuGenerator from "../../components/vendor/AutoMenuGenerator";
// import DemandHeatmap from "../../components/vendor/DemandHeatmap";

const VendorDashboard = () => {
  const { vendorId } = useParams();
  const [isLive, setIsLive] = useState(false);
  const lastDbSyncTime = useRef(0);
  const [vendor, setVendor] = useState(null);

  // --- NEW: EDIT STATES ---
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    shopName: "",
    phone: "",
    category: "",
    profilePic: "",
  });
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [currentLocation, setCurrentLocation] = useState(null);
  const { socket } = useSocketContext();

  useEffect(() => {
    fetchVendorStatus();
  }, [vendorId]);

  // GPS Radar logic remains the same...
  useEffect(() => {
    let watchId;
    if (isLive && socket) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
            socket.emit("updateVendorLocation", {
              vendorId: vendorId,
              lat: latitude,
              lng: longitude,
            });

            const now = Date.now();
            if (now - lastDbSyncTime.current > 15000) {
              api
                .put(`/vendors/${vendorId}/location`, {
                  lat: latitude,
                  lng: longitude,
                })
                .catch((err) =>
                  console.error("Failed to sync location to DB:", err),
                );
              lastDbSyncTime.current = now;
            }
          },
          (err) => {
            if (err.code === 1) alert("Location access required!");
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
        );
      }
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isLive, vendorId, socket]);

  const fetchVendorStatus = async () => {
    try {
      const res = await api.get(`/vendors/${vendorId}`);
      if (res.data.success && res.data.vendor) {
        setVendor(res.data.vendor);
        setIsLive(res.data.vendor.isLive);
        // Initialize edit data
        setEditData(res.data.vendor);
      }
    } catch (err) {
      console.error("Failed to load vendor status");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/vendors/categories");
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // --- NEW: UPDATE PROFILE FUNCTION ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const cleanPhone = editData.phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      alert("Please enter exactly 10 digits for the phone number.");
      return;
    }

    if (!editData.shopName.trim()) {
      alert("Shop name is required.");
      return;
    }
    setIsSaving(true);
    try {
      const updatedData = {
        ...editData,
        category: editData.category.trim().toLowerCase(),
      };

      const res = await api.put(`/vendors/${vendorId}/profile`, updatedData);
      if (res.data.success) {
        setVendor(res.data.vendor);
        setIsEditing(false);
        // alert("Profile Updated!");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Update failed. Try again.";
      console.error("Backend Error:", errorMsg);
      alert(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleLive = async () => {
    const newStatus = !isLive;
    setIsLive(newStatus);
    try {
      const res = await api.put(`/vendors/${vendorId}/status`, {
        isLive: newStatus,
      });
      if (!res.data.success) {
        setIsLive(!newStatus);
      } else if (socket) {
        socket.emit("vendorStatusChanged", {
          vendorId: vendorId,
          isLive: newStatus,
        });
      }
    } catch (error) {
      setIsLive(!newStatus);
      alert("Failed to update status.");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `font-bold pb-3 px-2 transition border-b-2 ${isActive ? "text-orange-500 border-orange-500" : "text-gray-400 border-transparent hover:text-gray-600"}`;

  return (
    <div className="pt-24 min-h-screen bg-gray-100 pb-32">
      {/* --- NEW: EDIT PROFILE MODAL --- */}
      {isEditing && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-pointer"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-black text-gray-800">
                Store Settings
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">
                  Shop Name
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
                  value={editData.shopName}
                  onChange={(e) =>
                    setEditData({ ...editData, shopName: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    maxLength="10"
                    pattern="\d*"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
                    value={editData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setEditData({ ...editData, phone: val });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    list="category-list"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition bg-white"
                    placeholder="e.g. Organic Snacks"
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value })
                    }
                  />
                  <datalist id="category-list">
                    {categories.map((cat) => (
                      <option key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </option>
                    ))}
                  </datalist>
                  <p className="text-[10px] text-gray-400 mt-1">
                    If your category isn't listed, just type it in!
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">
                  Profile Pic URL
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition"
                  placeholder="https://image-link.com"
                  value={editData.profilePic}
                  onChange={(e) =>
                    setEditData({ ...editData, profilePic: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-200 transition transform active:scale-95"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        {/* --- UPDATED HEADER CARD --- */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            {/* Store Branding Section */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-orange-100 ring-2 ring-white group-hover:border-orange-500 transition-all duration-300 shadow-inner">
                  <img
                    src={
                      vendor?.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    className="w-full h-full object-cover"
                    alt="profile"
                  />
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 bg-white shadow-md border w-8 h-8 rounded-full flex items-center justify-center text-orange-500 hover:scale-110 transition"
                >
                  <FontAwesomeIcon icon={faCamera} size="xs" />
                </button>
              </div>

              <div>
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                  {vendor?.shopName}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs bg-gray-50 hover:bg-orange-50 text-gray-400 hover:text-orange-500 px-3 py-1.5 rounded-lg border border-gray-100 transition-all font-bold"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                    Store
                  </button>
                </h1>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">
                  <span className="capitalize">{vendor?.category}</span>
                </p>
              </div>
            </div>

            {/* Live Toggle Section */}
            <div className="flex items-center gap-3 border border-gray-100 px-5 py-2 rounded-full shadow-sm">
              <span
                className={`font-bold uppercase tracking-wide text-sm ${isLive ? "text-[#00d26a]" : "text-gray-400"}`}
              >
                {isLive ? "Online" : "Offline"}
              </span>
              <button
                onClick={handleToggleLive}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${isLive ? "bg-[#00d26a]" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isLive ? "translate-x-9" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>

          <div className="flex gap-8 border-b border-gray-200 pb-0 overflow-x-auto whitespace-nowrap">
            <NavLink
              to={`/vendor-dashboard/${vendorId}/orders`}
              className={navLinkClass}
            >
              Live Orders
            </NavLink>
            <NavLink
              to={`/vendor-dashboard/${vendorId}/menu`}
              className={navLinkClass}
            >
              My Products
            </NavLink>
            <NavLink
              to={`/vendor-dashboard/${vendorId}/add`}
              className={navLinkClass}
            >
              + Add Product
            </NavLink>
            {/* <NavLink
              to={`/vendor-dashboard/${vendorId}/ai-menu`}
              className={navLinkClass}
            >
              <FontAwesomeIcon icon={faRobot} className="text-purple-600" /> AI
              Menu Sync
            </NavLink>
            <NavLink
              to={`/vendor-dashboard/${vendorId}/heatmap`}
              className={navLinkClass}
            >
              <FontAwesomeIcon icon={faRobot} className="text-purple-600" />{" "}
              Smart Heatmap
            </NavLink> */}
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<LiveOrders vendorId={vendorId} />} />
          <Route path="menu" element={<MenuList vendorId={vendorId} />} />
          <Route path="add" element={<AddMenu vendorId={vendorId} />} />
          {/* <Route
            path="ai-menu"
            element={
              <AutoMenuGenerator
                vendorId={vendorId}
                category={vendor?.category}
              />
            }
          />
          <Route
            path="heatmap"
            element={
              <DemandHeatmap
                vendorId={vendorId}
                category={vendor?.category}
                location={currentLocation}
              />
            }
          /> */}
        </Routes>
      </div>
    </div>
  );
};

export default VendorDashboard;
