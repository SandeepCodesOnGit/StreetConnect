import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// 🚨 ADDED: faStore for the Vendor Dashboard icon
import { faMapMarkerAlt, faBoxOpen, faStore } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-5 bg-gray-900/80 backdrop-blur-md text-white border-b border-white/10">
      
      {/* WRAPPED LOGO IN LINK: Now clicking the logo takes you back to the map! */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
        <div className="bg-yellow-400 p-2 rounded-full text-gray-900 flex items-center justify-center w-8 h-8">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
        </div>
        <h1 className="text-2xl font-bold tracking-wide">StreetSync</h1>
      </Link>
      
      <ul className="hidden md:flex gap-8 font-medium">
        <Link to="/"><li className="hover:text-yellow-200 cursor-pointer transition">Discover</li></Link>
        <li className="hover:text-yellow-200 cursor-pointer transition">For Vendors</li>
        <li className="hover:text-yellow-200 cursor-pointer transition">How It Works</li>
        <li className="hover:text-yellow-200 cursor-pointer transition">About</li>
      </ul>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            {/* 🚨 THE CONDITIONAL LOGIC: Vendor Dashboard vs Customer Orders */}
            {user.role === 'vendor' ? (
              <Link 
                to={`/vendor-dashboard/${user.vendorId || user._id}`} 
                className="hidden md:flex items-center gap-2 font-semibold text-yellow-400 hover:text-yellow-300 transition border-r border-gray-600 pr-4 mr-2"
              >
                <FontAwesomeIcon icon={faStore} />
                My Dashboard
              </Link>
            ) : (
              <Link 
                to="/orders" 
                className="hidden md:flex items-center gap-2 font-semibold hover:text-yellow-400 transition border-r border-gray-600 pr-4 mr-2"
              >
                <FontAwesomeIcon icon={faBoxOpen} />
                My Orders
              </Link>
            )}

            <span className="hidden md:block font-semibold text-yellow-300">
              Hi, {user.username || "User"}
            </span>
            
            <button 
              onClick={handleLogout}
              className="px-5 py-2 border border-white rounded-full font-semibold hover:bg-red-500 hover:border-red-500 transition ml-2"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signin">
              <button className="hidden md:block px-5 py-2 border border-white rounded-full font-semibold hover:bg-white hover:text-orange-500 transition">Sign In</button>
            </Link>
            <Link to="/signup">
              <button className="px-5 py-2 bg-yellow-500 rounded-full font-semibold hover:bg-yellow-600 transition shadow-lg text-white">Get Started</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;