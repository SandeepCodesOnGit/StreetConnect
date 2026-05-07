import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import {
  faMapMarkerAlt,
  faBell,
  faBagShopping,
  faBolt,
  faStar,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HowItWorks from '../components/HowItWorks'; // 🚨 IMPORTED COMPONENT

import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// --- LEAFLET ICON FIX ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// --- MAP UPDATER COMPONENT ---
const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), {
        animate: true,
      });
    }
  }, [center, map]);

  return null;
};

const Home = () => {
  const navigate = useNavigate();

  // STATES
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearbyBusinesses, setNearbyBusinesses] = useState([]);
  const [isLocating, setIsLocating] = useState(true);

  // FETCH BUSINESSES
  const fetchNearbyBusinesses = async (lat, lng) => {
    try {
      const res = await api.get(`/vendors/nearby?lat=${lat}&lng=${lng}`);
      if (res.data.success) {
        setNearbyBusinesses(res.data.vendors);
      }
    } catch (error) {
      console.error('Failed to fetch nearby businesses', error);
    }
  };

  // LOCATION HANDLER (ON MOUNT)
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');

    // USE SAVED LOCATION IF AVAILABLE (Fast Load)
    if (savedLocation) {
      const parsedLocation = JSON.parse(savedLocation);
      setCurrentLocation([parsedLocation.latitude, parsedLocation.longitude]);
      fetchNearbyBusinesses(parsedLocation.latitude, parsedLocation.longitude);
      setIsLocating(false);
      return;
    }

    // FETCH NEW LOCATION IF NO CACHE
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
          setCurrentLocation([latitude, longitude]);
          await fetchNearbyBusinesses(latitude, longitude);
          setIsLocating(false);
        },
        (error) => {
          console.error(error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  // FIND NEAR ME (FORCES FRESH GPS PING)
  const handleFindNearMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Update cache with new fresh location
          localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
          navigate(`/nearby?lat=${latitude}&lng=${longitude}`);
        },
        (error) => {
          console.error(error);
          setIsLocating(false);
          // Fallback to whatever we have if fresh ping fails
          if (currentLocation) {
            navigate(`/nearby?lat=${currentLocation[0]}&lng=${currentLocation[1]}`);
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-[#fffaf5] overflow-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 flex flex-col justify-center items-center text-center text-white px-4 pt-24 overflow-hidden">
        
        {/* BACKGROUND BLUR */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>

        {/* LIVE BADGE */}
        <div className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-semibold mb-8 border border-white/30 flex items-center gap-2 shadow-lg z-10">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Live Marketplace Active
        </div>

        {/* HEADING */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 z-10">
          Discover Local
          <br />
          <span className="text-yellow-200">Businesses Live</span>
        </h1>

        {/* SUBTEXT */}
        <p className="text-lg md:text-xl max-w-3xl opacity-90 mb-10 leading-relaxed z-10">
          Explore nearby shops, marketplaces, vendors, services, electronics,
          groceries, fashion stores, and more in real-time.
        </p>

        {/* CTA BUTTON */}
        <div className="flex flex-col md:flex-row gap-4 mb-16 z-10">
          <button
            onClick={handleFindNearMe}
            disabled={isLocating}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-500 rounded-full text-lg font-bold hover:scale-105 transition shadow-2xl disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLocating ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            )}
            {isLocating ? 'Locating...' : 'Explore Near Me'}
          </button>
        </div>

        {/* STATS */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold">{nearbyBusinesses.length}</h3>
          <p className="text-xs md:text-sm opacity-80">Nearby Businesses</p>
        </div>

        {/* WAVE */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-[calc(100%+1.3px)] h-20 rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Why Choose <span className="text-orange-500">StreetSync</span>?
          </h2>
          <p className="text-gray-500 text-lg">The future of hyperlocal marketplaces</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <FeatureCard
            icon={faMapMarkerAlt}
            title="Live GPS"
            desc="Track businesses and vendors in real-time around your area."
          />
          <FeatureCard
            icon={faBell}
            title="Instant Alerts"
            desc="Receive notifications when businesses go live nearby."
          />
          <FeatureCard
            icon={faBagShopping}
            title="Smart Ordering"
            desc="Order products and services instantly from local businesses."
          />
          <FeatureCard
            icon={faBolt}
            title="Real-Time Updates"
            desc="Live availability, stock updates, and marketplace activity."
          />
        </div>
      </section>

      {/* 🚨 THE EXTRACTED COMPONENT 🚨 */}
      <HowItWorks />

      {/* MAP SECTION */}
      <section className="bg-gray-50 py-20 px-4 md:px-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800">
            Explore Businesses <span className="text-orange-500">Near You</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row h-[650px] max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          
          {/* MAP */}
          <div className="w-full lg:w-2/3 h-[500px] lg:h-full relative z-0">
            {currentLocation && (
              <MapContainer center={currentLocation} zoom={14} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; StreetSync"
                />

                <MapUpdater center={currentLocation} />

                <Marker position={currentLocation}>
                  <Popup><b>You are here!</b></Popup>
                </Marker>

                {nearbyBusinesses.map((business) =>
                  business.location && business.location.lat ? (
                    <Marker key={business._id} position={[business.location.lat, business.location.lng]}>
                      <Popup>
                        <strong>{business.shopName}</strong><br />
                        {business.category}
                      </Popup>
                    </Marker>
                  ) : null
                )}
              </MapContainer>
            )}

            {isLocating && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[1000] flex items-center justify-center">
                <div className="bg-white px-6 py-4 rounded-full shadow-lg font-bold text-orange-500 flex items-center gap-3">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Locating you...
                </div>
              </div>
            )}
          </div>

          {/* BUSINESS LIST */}
          <div className="w-full lg:w-1/3 h-[500px] lg:h-full overflow-y-auto p-6 bg-white border-l border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-700">Nearby Businesses</h3>
              <span className="text-sm font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                {nearbyBusinesses.length} found
              </span>
            </div>

            <div className="space-y-4">
              {nearbyBusinesses.length > 0 ? (
                nearbyBusinesses.map((business) => (
                  <BusinessCard
                    key={business._id}
                    name={business.shopName}
                    category={business.category}
                    rating={business.rating || 'New'}
                    orders={business.totalOrders || 0}
                    image={business.profilePic || 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=1200'}
                    status={business.isLive ? 'Live' : 'Offline'}
                    onClick={() => navigate(`/vendor/${business._id}`)}
                  />
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center pt-10">
                  {isLocating ? 'Searching nearby businesses...' : 'No businesses found nearby right now.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- SUB COMPONENTS ---

// FEATURE CARD
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-gray-100">
    <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
      <FontAwesomeIcon icon={icon} />
    </div>
    <h3 className="font-bold text-xl mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

// BUSINESS CARD
const BusinessCard = ({ name, category, rating, orders, image, status, onClick }) => (
  <div onClick={onClick} className="flex gap-4 p-4 border rounded-2xl hover:shadow-lg hover:-translate-y-1 transition cursor-pointer bg-white group">
    <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0">
      <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <span className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-bold rounded-full text-white shadow-sm ${status === 'Live' ? 'bg-green-500' : 'bg-gray-400'}`}>
        {status === 'Live' ? 'LIVE' : 'OFF'}
      </span>
    </div>
    <div className="flex flex-col justify-center flex-1">
      <p className="text-[10px] uppercase text-orange-400 font-bold mb-1 capitalize tracking-wide">{category}</p>
      <h4 className="font-bold text-gray-800 text-sm mb-1">{name}</h4>
      <div className="flex items-center text-xs text-gray-500 gap-2 flex-wrap">
        <span className="flex items-center text-yellow-500 font-bold">
          <FontAwesomeIcon icon={faStar} className="mr-1" /> {rating}
        </span>
        <span>• {orders} orders</span>
      </div>
    </div>
  </div>
);

export default Home;