import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faBagShopping, faBolt } from '@fortawesome/free-solid-svg-icons';

// HOW CARD SUB-COMPONENT
const HowCard = ({ number, icon, title, desc, color }) => {
  const colors = {
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-100',
      border: 'border-orange-100',
      gradient: 'from-orange-50 to-white',
    },
    yellow: {
      bg: 'bg-yellow-400',
      text: 'text-yellow-100',
      border: 'border-yellow-100',
      gradient: 'from-yellow-50 to-white',
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-100',
      border: 'border-green-100',
      gradient: 'from-green-50 to-white',
    },
  };

  return (
    <div className={`group relative bg-gradient-to-br ${colors[color].gradient} border ${colors[color].border} rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
      <div className={`absolute top-5 right-5 text-6xl font-black ${colors[color].text}`}>
        {number}
      </div>
      <div className={`w-20 h-20 rounded-2xl ${colors[color].bg} text-white flex items-center justify-center text-3xl shadow-lg mb-8`}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
};

// MAIN COMPONENT
const HowItWorks = () => {
  return (
    <section className="py-24 bg-[#fffaf5] px-6 md:px-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-100 rounded-full blur-3xl opacity-40"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          {/* <span className="px-4 py-1 rounded-full bg-orange-100 text-orange-500 text-sm font-bold tracking-wide uppercase">
            Simple Process
          </span> */}
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mt-6 leading-tight">
            How <span className="text-orange-500">StreetSync</span> Works
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mt-5 text-lg leading-relaxed">
            Discover nearby businesses, connect instantly, and explore your local marketplace ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <HowCard
            number="01"
            icon={faMapMarkerAlt}
            color="orange"
            title="Discover Nearby"
            desc="Allow location access to instantly discover businesses, services, and marketplaces around you."
          />
          <HowCard
            number="02"
            icon={faBagShopping}
            color="yellow"
            title="Browse & Connect"
            desc="Explore products, services, live availability, categories, ratings, and marketplace updates."
          />
          <HowCard
            number="03"
            icon={faBolt}
            color="green"
            title="Order Instantly"
            desc="Place orders, contact businesses, or directly visit stores with real-time updates."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;