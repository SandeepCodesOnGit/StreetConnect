import React, {useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- FONT AWESOME IMPORTS (Only what Home needs) ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faBell, 
  faBagShopping, 
  faBolt, 
  faStar, 
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

// --- IMPORT YOUR NEW COMPONENTS ---
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// --- FIXED: Import Images for Vite/React Leaflet ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet Default Icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Home = () => {
    const navigate = useNavigate();
    const [isLocating, setIsLocating] = useState(false);

    const handleFindNearMe = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setIsLocating(false);

            navigate(`/nearby?lat=${latitude}&lng=${longitude}`);
        },
        (error) => {
            console.error(error);
            alert("Please allow location access to find vendors");
            setIsLocating(false);
        },
        {enableHighAccuracy: true}
    );
    };

  return (
    <div className="font-sans text-gray-800">

      {/* ================= 2. HERO SECTION ================= */}
      <section className="relative min-h-screen bg-linear-to-br from-orange-500 via-orange-400 to-yellow-400 flex flex-col justify-center items-center text-center text-white px-4 pt-20">
        
        <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-semibold mb-6 border border-white/30 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Live Tracking Active
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-sm">
          Find Your Favorite <br />
          <span className="relative inline-block">
            Street Vendors in Real-Time
            <svg className="absolute w-full h-4 -bottom-2 left-0 text-yellow-300" viewBox="0 0 200 9" fill="none"><path d="M2.00025 6.99997C2.00025 6.99997 101.5 0.999996 198.5 2.49997" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl opacity-90 mb-10 leading-relaxed">
          Discover nearby chaat walas, vegetable carts, and street food vendors. 
          Pre-order your favorites and skip the queue.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-16 w-full md:w-auto px-4">
            <button 
                onClick={handleFindNearMe}
                disabled={isLocating}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white rounded-full text-lg font-bold hover:bg-white hover:text-orange-500 transition"
            >
                {isLocating ? <FontAwesomeIcon icon={faSpinner} className='animate-spin'/> : <FontAwesomeIcon icon={faMapMarkerAlt} />}
                {isLocating ? "Locating..." : "Find Vendors Near Me"}
            </button>
            <button className="px-8 py-4 bg-transparent text-white font-bold hover:underline">
                I'm a Vendor
            </button>
        </div>

        <div className="grid grid-cols-3 gap-8 md:gap-16 text-center mb-20 md:mb-0">
            <div><h3 className="text-3xl md:text-4xl font-bold">5000+</h3><p className="text-xs md:text-sm opacity-80">Active Vendors</p></div>
            <div><h3 className="text-3xl md:text-4xl font-bold">50K+</h3><p className="text-xs md:text-sm opacity-80">Happy Customers</p></div>
            <div><h3 className="text-3xl md:text-4xl font-bold">15+</h3><p className="text-xs md:text-sm opacity-80">Cities</p></div>
        </div>

        <div className="absolute bottom-0 w-full overflow-hidden leading-none">
            <svg className="relative block w-[calc(100%+1.3px)] h-12.5 md:h-20 rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
            </svg>
        </div>
      </section>

      {/* ================= 3. FEATURES SECTION ================= */}
      <section className="py-20 bg-white px-6 md:px-10">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Why Choose <span className="text-orange-500">StreetSync</span>?</h2>
            <p className="text-gray-500">Connecting you with local vendors through technology</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <FeatureCard icon={faMapMarkerAlt} title="Real-Time GPS" desc="Track their live location as they move through your area." />
            <FeatureCard icon={faBell} title="Smart Notifications" desc="Get notified when your favorite vendors go live." />
            <FeatureCard icon={faBagShopping} title="Pre-Order" desc="Order ahead and pick up when ready. No more waiting." />
            <FeatureCard icon={faBolt} title="Instant Updates" desc="Real-time menu updates and availability status." />
        </div>
      </section>

      {/* ================= 4. MAP SECTION ================= */}
      <section className="bg-gray-50 py-20 px-4 md:px-10">
        <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Discover Vendors <span className="text-yellow-500">Near You</span></h2>
        </div>

        <div className="flex flex-col lg:flex-row h-150 max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="w-full lg:w-2/3 h-125 lg:h-full relative z-0">
                 <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <Marker position={[28.6139, 77.2090]}><Popup>Sharma Ji Chaat</Popup></Marker>
                 </MapContainer>
            </div>

            <div className="w-full lg:w-1/3 h-125 lg:h-full overflow-y-auto p-6 bg-white border-l border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-700">Nearby Vendors (6)</h3>
                </div>

                <div className="space-y-4">
                    <VendorCard name="Sharma Ji Chaat" rating="4.8" orders="2,340" image="https://images.unsplash.com/photo-1567188040706-fb8d89590769?q=80&w=200" status="Live" />
                    <VendorCard name="Momos King" rating="4.7" orders="3,120" image="https://images.unsplash.com/photo-1626776877555-408484e1837a?q=80&w=200" status="Offline" />
                    <VendorCard name="Fruit Cart" rating="4.6" orders="980" image="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=200" status="Live" />
                </div>
            </div>
        </div>
      </section>

      {/* ================= 5. FOOTER ================= */}
      <Footer />

    </div>
  );
};

// --- Page-Specific Sub Components ---

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300 border border-gray-100">
        <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
            <FontAwesomeIcon icon={icon} />
        </div>
        <h3 className="font-bold text-lg mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
);

const VendorCard = ({ name, rating, orders, image, status }) => (
    <div className="flex gap-4 p-4 border rounded-xl hover:shadow-md transition cursor-pointer bg-white">
        <div className="w-20 h-20 rounded-lg overflow-hidden relative shrink-0">
            <img src={image} alt={name} className="w-full h-full object-cover" />
            <span className={`absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-bold rounded-sm text-white ${status === 'Live' ? 'bg-green-500' : 'bg-gray-400'}`}>
                {status === 'Live' ? 'LIVE' : 'OFF'}
            </span>
        </div>
        <div className="flex flex-col justify-center">
            <p className="text-[10px] uppercase text-orange-400 font-bold mb-1">Street Food</p>
            <h4 className="font-bold text-gray-800 text-sm mb-1">{name}</h4>
            <div className="flex items-center text-xs text-gray-500 gap-2">
                <span className="flex items-center text-yellow-500 font-bold">
                  <FontAwesomeIcon icon={faStar} className="mr-1"/> {rating}
                </span>
                <span>• {orders} orders</span>
            </div>
        </div>
    </div>
);

export default Home;