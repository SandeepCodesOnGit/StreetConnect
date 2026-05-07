import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faEarthAsia, 
  faStore, 
  faHandshake 
} from '@fortawesome/free-solid-svg-icons';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="font-sans text-gray-800 bg-[#fffaf5] min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 px-6 md:px-10 text-center z-10">
        {/* Soft Background Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-orange-500/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-4xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-bold tracking-widest uppercase mb-6 inline-block">
            Our Story
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            Empowering the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
              Street Economy
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            StreetSync is bridging the gap between traditional Local vendors and modern consumers using real-time location technology.
          </p>
        </div>
      </section>

      {/* MISSION SECTION (Text + Image) */}
      <section className="py-20 px-6 md:px-10 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Technology built for <br />
              <span className="text-orange-500">local communities.</span>
            </h2>
            <p className="text-lg text-gray-500 mb-6 leading-relaxed">
              For generations, local vendors have been the heartbeat of our cities. They provide fresh food, unique goods, and essential services. But in a world moving towards digital convenience, these micro-entrepreneurs are often left behind.
            </p>
            <p className="text-lg text-gray-500 leading-relaxed">
              We built StreetSync to change that. By giving vendors a simple digital storefront and live GPS tracking, we help them reach more customers, increase their daily earnings, and thrive in the modern economy.
            </p>
          </div>
          <div className="w-full lg:w-1/2 relative">
            {/* Decorative blob behind image */}
            <div className="absolute -inset-4 bg-orange-100 rounded-3xl transform rotate-3 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
              alt="Street Food Vendor" 
              className="w-full h-auto rounded-3xl shadow-2xl object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-24 px-6 md:px-10 bg-[#fffaf5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-500 text-lg">What drives us to build a better platform every day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard 
              icon={faStore} 
              title="Support Local" 
              desc="We believe in keeping money within the community by uplifting local micro-businesses."
            />
            <ValueCard 
              icon={faEarthAsia} 
              title="Accessible Tech" 
              desc="Technology shouldn't just be for big restaurants. It should be easy and free for the smallest carts."
            />
            <ValueCard 
              icon={faHeart} 
              title="Authenticity" 
              desc="Nothing beats the taste and soul of real street food and locally crafted goods."
            />
            <ValueCard 
              icon={faHandshake} 
              title="Trust & Safety" 
              desc="Building a reliable ecosystem where buyers and sellers can connect with complete confidence."
            />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gray-900 text-center px-6 relative overflow-hidden">
        {/* Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-[80px]"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Be part of the movement.</h2>
          <p className="text-lg text-gray-400 mb-10">
            Whether you're looking for your favorite street snack or want to grow your vendor business, StreetSync is the place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/nearby">
              <button className="w-full sm:w-auto px-8 py-4 bg-orange-500 text-white rounded-full text-lg font-bold hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300 shadow-xl">
                Explore Vendors
              </button>
            </Link>
            <Link to="/vendors">
              <button className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full text-lg font-bold hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                Partner With Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- SUB COMPONENT ---
const ValueCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-white border border-orange-50 rounded-3xl hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-2 group">
    <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
      <FontAwesomeIcon icon={icon} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default About;