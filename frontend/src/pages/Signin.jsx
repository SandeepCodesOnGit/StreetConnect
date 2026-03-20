import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faLock, faArrowRight, faUser, faStore, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Signin = () => {
    const { signin } = useAuth();
    const navigate = useNavigate();

  const [role, setRole] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
        email: formData.email,
        password: formData.password,
        role: role
    };

    const result = await signin(payload);
    if(result.success) {
      if(role === "vendor") {
        const vendorId = result.user?._id; 
            navigate(`/vendor-dashboard/${vendorId}`);
      } else{
        navigate("/");
      }
    } else {
        alert(result.message);
        setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-orange-500 via-orange-400 to-yellow-400 flex items-center justify-center p-6 font-sans overflow-hidden">
      
      {/* Background Decorative Text */}
      <div className="fixed -bottom-10 -left-10 text-white/10 text-[12rem] font-black select-none pointer-events-none leading-none z-0 hidden lg:block">
        STREET<br />SYNC
      </div>

      {/* Main Signin Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden transform transition-all">
        
        <div className="p-8 md:p-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8 text-white">
            <div className="bg-yellow-400 p-4 rounded-2xl text-gray-900 shadow-xl mb-4 text-2xl">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
            <p className="text-white/80 text-sm mt-2 font-medium text-center">
              Enter your credentials to access your {role} account.
            </p>
          </div>

          {/* Role Toggle Switch */}
          <div className="mb-10 p-1.5 bg-black/20 rounded-2xl flex relative overflow-hidden border border-white/10">
            {/* Sliding Background Indicator */}
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-yellow-400 rounded-xl transition-all duration-300 ease-in-out shadow-lg ${
                role === 'vendor' ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'
              }`}
            />
            
            <button 
              onClick={() => setRole('user')}
              className={`flex-1 py-3 z-10 text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${
                role === 'user' ? 'text-gray-900' : 'text-white'
              }`}
            >
              <FontAwesomeIcon icon={faUser} className="text-xs" /> Customer
            </button>
            
            <button 
              onClick={() => setRole('vendor')}
              className={`flex-1 py-3 z-10 text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${
                role === 'vendor' ? 'text-gray-900' : 'text-white'
              }`}
            >
              <FontAwesomeIcon icon={faStore} className="text-xs" /> Vendor
            </button>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white group-focus-within:text-yellow-300 transition-colors">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <input 
                type="email" 
                name='email'
                required
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:bg-white/20 transition-all shadow-inner"
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white group-focus-within:text-yellow-300 transition-colors">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <input 
                type="password" 
                name='password'
                required
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:bg-white/20 transition-all shadow-inner"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end px-1">
              <button type="button" className="text-xs text-white hover:text-yellow-300 transition-colors font-semibold tracking-wide uppercase">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black text-lg py-4 rounded-xl shadow-xl transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
            >
              {isSubmitting ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <>SIGN IN <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>

        {/* Signup Footer */}
        <div className="bg-black/30 p-8 text-center border-t border-white/10">
          <p className="text-white text-sm font-medium">
            New to StreetSync? 
            <Link to="/signup">
            <button className="ml-2 text-yellow-300 font-bold hover:text-white transition-all underline underline-offset-8 decoration-yellow-300/50 hover:decoration-white">
              Create an account
            </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;