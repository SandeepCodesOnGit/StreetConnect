import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, faEnvelope, faLock, faUser, faStore, 
  faArrowRight, faArrowLeft, faIdCard, faPhone, 
  faUtensils, faChevronDown, faSpinner 
} from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(null); 
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    shopName: "",
    category: ""
  });

  useEffect(() => {
    if(role === 'vendor') {
      const fetchCategories = async () => {
        try {
          const response = await api.get('/vendors/categories');
          if(response.data.success && response.data.categories.length > 0){
            setCategories(response.data.categories);
            setFormData(prev => ({ ...prev, category: response.data.categories[0] })); 
          }
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      };
      fetchCategories();
    }
  }, [role]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: role,
        ...(role === "vendor" && {
            shopName: formData.shopName,
            category: formData.category
        })
    };

    const result = await signup(payload);
    if(result.success) {
        navigate("/");
    } else {
        alert(result.message);
        setIsSubmitting(false);
    }
  };

  return (
    // 🚨 FIXED: min-h-screen with padding top (pt-32) to clear the Navbar!
    <div className="relative min-h-screen w-full bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 flex items-center justify-center pt-32 pb-12 px-4 font-sans overflow-x-hidden">
      
      {/* Background Text */}
      <div className="fixed -bottom-10 -right-10 text-white/10 text-[10rem] font-black select-none pointer-events-none leading-none z-0 hidden lg:block">
        JOIN<br />SYNC
      </div>

      {/* 🚨 FIXED: Removed overflow-hidden so dropdown can escape */}
      <div className="relative z-10 w-full max-w-xl bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/30 flex flex-col">
        
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-white text-center">
            <div className="bg-yellow-400 p-4 rounded-2xl text-gray-900 shadow-xl mb-4 text-2xl">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              {role ? `Join as ${role.charAt(0).toUpperCase() + role.slice(1)}` : "Choose Your Path"}
            </h2>
            <div className="flex gap-2 mt-4">
                <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step === 1 ? 'bg-yellow-400' : 'bg-white/20'}`}></div>
                <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step === 2 ? 'bg-yellow-400' : 'bg-white/20'}`}></div>
            </div>
          </div>

          {/* STEP 1: Role Selection */}
          {step === 1 && !role && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300">
              <RoleCard 
                icon={faUser} 
                title="Customer" 
                desc="I want to find & track vendors." 
                onClick={() => { setRole('user'); setStep(2); }} 
              />
              <RoleCard 
                icon={faStore} 
                title="Vendor" 
                desc="I want to list my shop & sync." 
                onClick={() => { setRole('vendor'); setStep(2); }} 
              />
            </div>
          )}

          {/* STEP 2: The Form */}
          {step === 2 && (
            <form className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300" onSubmit={handleSubmit}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField icon={faIdCard} name="username" placeholder="Username" value={formData.username} onChange={handleChange} required/>
                <InputField icon={faPhone} name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required/>
                <InputField icon={faEnvelope} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required/>
                <InputField icon={faLock} name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              </div>

              {role === 'vendor' && (
                <div className="space-y-4 pt-4 border-t border-white/10 relative">
                  <InputField icon={faStore} name="shopName" placeholder="Shop/Stall Name" value={formData.shopName} onChange={handleChange} required />
                  
                  {/* Dropdown works perfectly now! */}
                  <CustomDropdown 
                    icon={faUtensils} 
                    name="category" 
                    options={categories} 
                    value={formData.category} 
                    onChange={handleChange} 
                    placeholder="Select Category"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4 relative z-0">
                <button type="button" onClick={() => { setRole(null); setStep(1); }} className="p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all active:scale-95">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button 
                  type='submit'
                  disabled={isSubmitting}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 group active:scale-95 transition-all"
                >
                  {isSubmitting ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' /> : "CREATE ACCOUNT"}
                  {!isSubmitting && <FontAwesomeIcon icon={faArrowRight} className='group-hover:translate-x-1 transition-transform' />} 
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 🚨 FIXED: Added rounded-b-[2.5rem] to force the corners to stay round! */}
        <div className="bg-black/20 p-6 text-center border-t border-white/10 mt-auto rounded-b-[2.5rem] relative z-0">
          <p className="text-white/80 text-sm font-medium">
            Already have an account? <Link to="/signin" className="ml-2 text-yellow-300 font-bold hover:text-white underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const RoleCard = ({ icon, title, desc, onClick }) => (
  <button 
    onClick={onClick}
    className="group p-8 bg-white/5 hover:bg-white/15 border border-white/20 rounded-3xl text-left transition-all hover:scale-[1.02] hover:shadow-2xl flex flex-col items-center md:items-start md:text-left w-full"
  >
    <div className="w-16 h-16 bg-yellow-400/20 text-yellow-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-yellow-400 group-hover:text-gray-900 transition-all">
      <FontAwesomeIcon icon={icon} />
    </div>
    <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
    <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
  </button>
);

const InputField = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white group-focus-within:text-yellow-300 transition-colors">
      <FontAwesomeIcon icon={icon} />
    </div>
    <input 
      {...props}
      className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all font-medium"
    />
  </div>
);

// CUSTOM DROPDOWN COMPONENT
const CustomDropdown = ({ icon, options, value, onChange, name, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="relative group z-50">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white group-focus-within:text-yellow-300 transition-colors z-10">
        <FontAwesomeIcon icon={icon} />
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white/10 border ${isOpen ? 'border-yellow-300 ring-2 ring-yellow-300/50' : 'border-white/20'} rounded-xl py-4 pl-11 pr-4 text-left focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all font-medium flex justify-between items-center`}
      >
        <span className={value ? "text-white" : "text-white/50"}>
          {value || placeholder}
        </span>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`text-white/50 text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          {/* Menu drops down and overlaps the footer seamlessly */}
          <div className="absolute z-50 w-full mt-2 bg-black/60 backdrop-blur-3xl border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.length > 0 ? (
                options.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    className={`px-5 py-3.5 cursor-pointer transition-colors text-white font-medium hover:bg-white/20 ${value === opt ? 'bg-yellow-400/30 text-yellow-300 border-l-2 border-yellow-400' : ''}`}
                  >
                    {opt}
                  </div>
                ))
              ) : (
                <div className="px-5 py-3 text-white/50 font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Loading...
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Signup;