import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import api from "../api/axios";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSpinner,
  faLocationCrosshairs,
  faClock,
  faRoute
} from "@fortawesome/free-solid-svg-icons";

import { useSocketContext } from "../socket/SocketContext";

// --- ICONS ---
const vendorIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
    iconAnchor: [12, 41],
  popupAnchor: [1, -28],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
    iconAnchor: [12, 41],
  popupAnchor: [1, -28],
  shadowSize: [41, 41],
});

const AutoZoomFit = ({ bounds }) => {
  const map = useMap();
  const [hasZoomed, setHasZoomed] = useState(false);

  useEffect(() => {
    if (!hasZoomed && bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
      setHasZoomed(true);
    }
  }, [bounds, map, hasZoomed]);

  return null;
};

const TrackVendor = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [vendor, setVendor] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  
  // 🚨 NEW: State to hold Distance and ETA
  const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });
  
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const { socket } = useSocketContext();

  // 1. Watch the User's Location Continuously
  useEffect(() => {
    const urlLat = searchParams.get("lat");
    const urlLng = searchParams.get("lng");

    if (urlLat && urlLng) {
      setUserLocation([parseFloat(urlLat), parseFloat(urlLng)]);
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting location:", error);
        if (!userLocation) {
          setLocationError("Please allow location access to track the route.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [searchParams]);

  // 2. Fetch Initial Vendor Data
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await api.get(`/vendors/${vendorId}`);
        const vendorData = res.data.vendor || res.data;
        setVendor(vendorData);
      } catch (err) {
        console.error("Failed to load vendor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [vendorId]);

  // 3. Listen for Real-Time Vendor Movement via Socket
  useEffect(() => {
    if (!socket || !vendorId) return;

    socket.emit("joinVendorRoom", vendorId); // Join a room specific to this vendor for targeted updates

    const handleLocationChange = (data) => {
      if (data.vendorId === vendorId) {
        setVendor((prev) => ({
          ...prev,
          location: { ...prev.location, coordinates: [data.lng, data.lat] },
        }));
      }
    };

    socket.on("vendorLocationChanged", handleLocationChange);
    return () => {
      socket.emit("leaveVendorRoom", vendorId); // Optional: Leave the room when component unmounts
      socket.off("vendorLocationChanged", handleLocationChange);
    };
  }, [vendorId, socket]);

  // 4. Draw Route Line & GET ETA 
  useEffect(() => {
    if (!vendor || !vendor.location?.coordinates || !userLocation) return;

    const timeout = setTimeout(() => {
      const [vendorLng, vendorLat] = vendor.location.coordinates;
      const [uLat, uLng] = userLocation;

      if (isNaN(vendorLng) || isNaN(vendorLat) || isNaN(uLat) || isNaN(uLng)) {
        console.error("Invalid coordinates detected");
        return;
      }

      const getRoute = async () => {
        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${uLng},${uLat};${vendorLng},${vendorLat}?overview=full&geometries=geojson`,
          );

          const data = await res.json();

          if (data.routes?.length > 0) {
            const formattedRoute = data.routes[0].geometry.coordinates.map(
              ([lng, lat]) => [lat, lng],
            );
            setRoutePath(formattedRoute);

            // 🚨 NEW: Extract and save the Distance (meters) and Duration (seconds)
            setRouteInfo({
              distance: data.routes[0].distance,
              duration: data.routes[0].duration
            });
          }
        } catch (err) {
          console.error("OSRM Routing Error:", err);
        }
      };

      getRoute();
    }, 800);
    return () => clearTimeout(timeout);
  }, [vendor?.location?.coordinates, userLocation]);

  // 🚨 NEW: Helper function to format the numbers beautifully
  const formatRouteInfo = () => {
    if (!routeInfo.distance || !routeInfo.duration) return null;
    
    // Format Distance: Show km if > 1000m, otherwise show meters
    const distStr = routeInfo.distance > 1000 
      ? (routeInfo.distance / 1000).toFixed(1) + " km" 
      : Math.round(routeInfo.distance) + " m";
      
    // Format Duration: Convert seconds to minutes
    const mins = Math.round(routeInfo.duration / 60);
    const durStr = mins > 60 
      ? `${Math.floor(mins / 60)} hr ${mins % 60} min` 
      : `${mins || 1} min`; // Show '1 min' if it rounds down to 0

    return { distStr, durStr };
  };

  const formattedInfo = formatRouteInfo();

  // --- UI SCREENS BEFORE MAP LOADS ---
  if (locationError) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gray-50">
        <FontAwesomeIcon
          icon={faLocationCrosshairs}
          className="text-4xl text-gray-300 mb-4"
        />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Location Required
        </h2>
        <p className="text-gray-500">{locationError}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (loading || !userLocation) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <FontAwesomeIcon
          icon={faSpinner}
          className="animate-spin text-4xl text-orange-500 mb-4"
        />
        <p className="text-gray-500 font-bold">
          {loading
            ? "Loading vendor details..."
            : "Acquiring your real-time GPS..."}
        </p>
      </div>
    );
  }

  if (!vendor)
    return (
      <div className="min-h-screen flex justify-center items-center font-bold">
        Vendor not found.
      </div>
    );

  const [vendorLng, vendorLat] = vendor.location.coordinates;
  const vendorLocation = [vendorLat, vendorLng];

  const bounds =
    routePath.length > 0 ? routePath : [userLocation, vendorLocation];

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 mb-4">
        {/* TOP BAR */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black text-gray-900">
              {vendor.shopName}
            </h2>
            <p className="text-xs font-bold text-green-500 uppercase tracking-widest animate-pulse">
              Live Tracking Active
            </p>
          </div>
          <button
            onClick={() => navigate(`/vendor/${vendor._id}`)}
            className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-500 hover:text-white transition"
          >
            Menu
          </button>
        </div>

        {/* MAP CONTAINER */}
        <div className="w-full h-[65vh] bg-gray-200 rounded-3xl shadow-lg border border-gray-200 overflow-hidden relative z-0">
          
          {/* 🚨 NEW: Floating ETA Card positioned over the map */}
          {formattedInfo && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-1000 bg-white px-6 py-4 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-between gap-6 w-11/12 max-w-sm">
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-green-500">{formattedInfo.durStr}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} /> ETA
                </span>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{formattedInfo.distStr}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <FontAwesomeIcon icon={faRoute} /> Away
                </span>
              </div>
            </div>
          )}

          <MapContainer
            center={userLocation}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <AutoZoomFit bounds={bounds} />

            <Marker position={userLocation} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>

            <Marker position={vendorLocation} icon={vendorIcon}>
              <Popup>{vendor.shopName}</Popup>
            </Marker>

            {routePath.length > 0 && (
              <Polyline
                positions={routePath}
                color="#f97316"
                weight={5}
                opacity={0.8}
                dashArray="10, 10"
                lineCap="round"
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default TrackVendor;