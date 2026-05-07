import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapSigns, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="font-sans text-gray-800 bg-[#fffaf5] min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center text-center px-6 pt-24 pb-20 relative z-10">
        
        {/* Soft Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-orange-400/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-[80px] -z-10"></div>

        {/* 404 Text */}
        <div className="relative">
          <h1 className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600 leading-none select-none drop-shadow-sm">
            404
          </h1>
          
          {/* Icon Badge overlapping the 404 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-2xl flex items-center justify-center text-4xl md:text-5xl text-gray-900 border-8 border-[#fffaf5]">
            <FontAwesomeIcon icon={faMapSigns} />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-8 mb-4">
          Oops! This street is empty.
        </h2>
        
        <p className="text-lg text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
          Looks like the cart you're looking for has rolled away, or the page just doesn't exist anymore. 
        </p>

        <Link to="/">
          <button className="px-8 py-4 bg-gray-900 text-white rounded-full text-lg font-bold hover:bg-orange-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Homepage
          </button>
        </Link>
        
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;