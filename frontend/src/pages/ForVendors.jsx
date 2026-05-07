import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMobileScreenButton, 
  faSatelliteDish, 
  faMoneyBillTrendUp, 
  faChartSimple, 
  faQuoteLeft, 
  faStore,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

// import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ForVendors = () => {
  return (
    <div className="font-sans text-gray-800 bg-[#fffaf5] min-h-screen flex flex-col overflow-hidden">
      {/* <Navbar /> */}

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 md:px-10 text-center z-10">
        {/* Soft Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-orange-500/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="max-w-4xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-bold tracking-widest uppercase mb-6 inline-block">
            Vendor Partner Program
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            Turn Your Business into a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
              Digital Storefront
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop waiting for foot traffic. Let the neighborhood know exactly where you are, accept pre-orders, and increase your daily earnings using just your smartphone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <button className="px-8 py-4 bg-gray-900 text-white rounded-full text-lg font-bold hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3">
                Register Your Business <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CORE BENEFITS GRID */}
      <section className="py-20 bg-white px-6 md:px-10 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Why Sell on StreetSync?</h2>
            <p className="text-gray-500 text-lg">Everything you need to grow your local business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard 
              icon={faMobileScreenButton} 
              title="Zero Setup Cost" 
              desc="No expensive hardware needed. If you have a smartphone, you have a digital storefront."
            />
            <BenefitCard 
              icon={faSatelliteDish} 
              title="Live Broadcasting" 
              desc="Moving locations? Tap one button to update your live GPS coordinates for the whole city."
            />
            <BenefitCard 
              icon={faMoneyBillTrendUp} 
              title="Skip the Haggle" 
              desc="Set your menu and prices upfront. Receive digital pre-orders and get paid directly."
            />
            <BenefitCard 
              icon={faChartSimple} 
              title="Smart Analytics" 
              desc="See which areas and which days of the week make you the most money."
            />
          </div>
        </div>
      </section>

      {/* HOW TO START (3 STEPS) */}
      <section className="py-24 bg-[#fffaf5] px-6 md:px-10 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Start Earning in <span className="text-orange-500">3 Simple Steps</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-8 justify-between relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-gradient-to-r from-orange-200 to-yellow-200 -z-10 rounded-full"></div>

            <StepCard step="1" title="Create Profile" desc="Sign up with your phone number and add your cart's name." />
            <StepCard step="2" title="Add Your Menu" desc="Take pictures of your items and set your prices." />
            <StepCard step="3" title="Go Live!" desc="Tap the green button to broadcast your location to buyers." />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      {/* <section className="py-20 bg-gray-900 text-white px-6 md:px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-[80px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <FontAwesomeIcon icon={faQuoteLeft} className="text-5xl text-orange-500/50 mb-8" />
          <h3 className="text-2xl md:text-4xl font-medium leading-relaxed mb-10">
            "I used to stand on the corner and wait for people to walk by. Now, I have 10 orders placed before I even park my cart. It completely changed my business."
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full overflow-hidden border-2 border-orange-500">
              <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=200&auto=format&fit=crop" alt="Vendor" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Ramesh Sharma</p>
              <p className="text-orange-400 text-sm">Street Food Vendor</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* FINAL CTA */}
      <section className="py-24 bg-orange-500 text-center px-6">
        <h2 className="text-4xl font-extrabold text-white mb-6">Ready to Boost Your Sales?</h2>
        <Link to="/signup">
          <button className="px-10 py-4 bg-white text-orange-600 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-2xl">
            Create Your Vendor Account
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

// --- SUB COMPONENTS ---

const BenefitCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-[#fffaf5] border border-orange-100 rounded-3xl hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
    <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
      <FontAwesomeIcon icon={icon} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

const StepCard = ({ step, title, desc }) => (
  <div className="flex-1 text-center group bg-white md:bg-transparent p-8 md:p-0 rounded-3xl shadow-sm md:shadow-none border border-gray-100 md:border-none">
    <div className="w-24 h-24 mx-auto bg-white border-4 border-orange-100 text-orange-500 rounded-full flex items-center justify-center text-3xl font-black shadow-lg mb-6 group-hover:border-orange-500 group-hover:scale-110 transition-all duration-300">
      {step}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500">{desc}</p>
  </div>
);

export default ForVendors;