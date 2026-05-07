import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-[#130700] text-[#FFFBF5] pt-24 pb-10 px-6 md:px-10 font-['Syne',sans-serif] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-white/10 pb-16">
        {/* COLUMN 1: BRANDING (Takes up 4 columns) */}
        <div className="lg:col-span-4">
          <Link
            to="/"
            className="font-['Bebas_Neue',sans-serif] text-4xl tracking-[0.1em] text-white inline-block mb-6 hover:opacity-80 transition-opacity"
          >
            Street<span className="text-orange-500">Sync</span>
          </Link>
          <p className="text-[#FFFBF5]/60 text-sm leading-relaxed mb-8 max-w-xs">
            Connecting the neighborhood's street economy with modern technology.
            Discover, order, and support local vendors in real-time.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={faInstagram} link="https://www.instagram.com/sandpprajapati/" />
            <SocialIcon icon={faLinkedin} link="https://linkedin.com/in/sandp5" />
            <SocialIcon icon={faGithub} link="https://github.com/SandeepCodesOnGit" />
          </div>
        </div>

        {/* COLUMN 2: QUICK LINKS (Takes up 3 columns) */}
        <div className="lg:col-span-3">
          <h3 className="text-[0.85rem] font-bold tracking-[0.15em] uppercase text-orange-500 mb-6">
            Explore
          </h3>
          <ul className="space-y-4 text-sm text-[#FFFBF5]/70">
            <li>
              <Link
                to="/"
                className="hover:text-orange-400 hover:pl-2 transition-all duration-300"
              >
                Discover Vendors
              </Link>
            </li>
            <li>
              <Link
                to="/for-vendors"
                className="hover:text-orange-400 hover:pl-2 transition-all duration-300"
              >
                For Vendors
              </Link>
            </li>
            <li>
              <Link
                to="/how-it-works"
                className="hover:text-orange-400 hover:pl-2 transition-all duration-300"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-orange-400 hover:pl-2 transition-all duration-300"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: NEWSLETTER (Takes up 5 columns for a wider input field) */}
        <div className="lg:col-span-5">
          <h3 className="text-[0.85rem] font-bold tracking-[0.15em] uppercase text-orange-500 mb-6">
            Stay Updated
          </h3>
          <p className="text-[#FFFBF5]/60 text-sm leading-relaxed mb-6">
            Get notified when new vendors go live in your neighborhood. No spam,
            just fresh food.
          </p>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-[#FFFBF5]/40"
              />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/5 border border-white/10 text-white rounded-full py-3 pl-11 pr-32 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
            <button className="absolute inset-y-1.5 right-1.5 bg-orange-500 hover:bg-orange-600 text-white px-5 rounded-full text-xs font-bold tracking-wide uppercase transition-colors flex items-center gap-2">
              Subscribe <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT ROW */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mt-10 text-[#FFFBF5]/40 text-xs">
        <p>© {new Date().getFullYear()} StreetSync. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

// --- SUB COMPONENT ---
const SocialIcon = ({ icon, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-[#FFFBF5]/70 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 hover:-translate-y-1"
  >
    <FontAwesomeIcon icon={icon} />
  </a>
);

export default Footer;
