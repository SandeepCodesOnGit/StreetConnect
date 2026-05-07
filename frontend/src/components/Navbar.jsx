import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faBoxOpen, faStore, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 md:px-10 py-4 bg-[#FFFBF5]/90 backdrop-blur-md border-b border-orange-500/15 font-['Syne',sans-serif]">
      
      {/* 🚨 LOGO - Updated to match the Bebas Neue typography */}
      <Link to="/" className="font-['Bebas_Neue',sans-serif] text-3xl tracking-[0.1em] text-[#1C0A00] hover:opacity-80 transition">
        Street<span className="text-orange-500">Sync</span>
      </Link>
      
      {/* 🚨 NAV LINKS - Updated to match the uppercase tracked style */}
      <ul className="hidden md:flex gap-8 items-center">
        <Link to="/"><li className="text-[0.78rem] font-bold tracking-[0.12em] uppercase text-[#B87645] hover:text-orange-500 transition-colors cursor-pointer">Discover</li></Link>
        <Link to="/for-vendors">
          <li className="text-[0.78rem] font-bold tracking-[0.12em] uppercase text-[#B87645] hover:text-orange-500 transition-colors cursor-pointer">For Vendors</li>
        </Link>
        <Link to="/how-it-works">
          <li className="text-[0.78rem] font-bold tracking-[0.12em] uppercase text-[#B87645] hover:text-orange-500 transition-colors cursor-pointer">How It Works</li>
        </Link>
      </ul>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            {/* CONDITIONAL LOGIC: Vendor Dashboard vs Customer Orders */}
            {user.role === 'vendor' ? (
              <Link 
                to={`/vendor-dashboard/${user.vendorId || user._id}`} 
                className="hidden md:flex items-center gap-2 text-[0.78rem] font-bold tracking-[0.12em] uppercase text-orange-500 hover:text-orange-600 transition border-r border-orange-500/20 pr-4 mr-2"
              >
                <FontAwesomeIcon icon={faStore} />
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/orders" 
                className="hidden md:flex items-center gap-2 text-[0.78rem] font-bold tracking-[0.12em] uppercase text-[#B87645] hover:text-orange-500 transition border-r border-orange-500/20 pr-4 mr-2"
              >
                <FontAwesomeIcon icon={faBoxOpen} />
                My Orders
              </Link>
            )}

            <span className="hidden md:block text-[0.85rem] font-bold text-[#1C0A00]">
              Hi, {user.username || "User"}
            </span>
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-red-200 text-red-500 rounded-full text-[0.78rem] font-bold tracking-[0.08em] uppercase hover:bg-red-50 hover:border-red-300 transition ml-2 flex items-center gap-2"
            >
              Logout <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
          </>
        ) : (
          <>
            <Link to="/signin">
              <button className="hidden md:block px-5 py-2 text-[0.78rem] font-bold tracking-[0.12em] uppercase text-[#B87645] hover:text-orange-500 transition">
                Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-6 py-2.5 bg-orange-500 text-white rounded-full text-[0.78rem] font-bold tracking-[0.12em] uppercase hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 transition-all">
                Get Started
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;