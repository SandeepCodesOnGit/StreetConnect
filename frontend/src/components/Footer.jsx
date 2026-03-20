import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-[#4A3B32] text-white pt-16 pb-8 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-600 pb-12">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-yellow-400 p-2 rounded-full text-gray-900">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <h2 className="text-xl font-bold">StreetSync</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Connecting India's street economy with modern technology.
          </p>
          <div className="flex gap-4 mt-6">
            <SocialIcon icon={faInstagram} />
            <SocialIcon icon={faTwitter} />
            <SocialIcon icon={faFacebookF} />
          </div>
        </div>

        <FooterColumn title="Quick Links" links={["Discover Vendors", "For Vendors", "How It Works", "Pricing"]} />
        <FooterColumn title="Categories" links={["Street Food", "Vegetables", "Fruits", "Beverages"]} />

        <div>
          <h3 className="font-bold text-lg mb-6">Contact Us</h3>
          <div className="bg-gray-100 h-24 rounded flex items-center justify-center text-gray-400 text-xs">Map Preview</div>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} StreetSync. All rights reserved.
      </div>
    </footer>
  );
};

// Sub-components only needed in the Footer
const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="font-bold text-lg mb-6">{title}</h3>
    <ul className="space-y-3 text-sm text-gray-400">
      {links.map((link, i) => <li key={i} className="hover:text-white cursor-pointer transition">{link}</li>)}
    </ul>
  </div>
);

const SocialIcon = ({ icon }) => (
  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition cursor-pointer">
    <FontAwesomeIcon icon={icon} />
  </div>
);

export default Footer;