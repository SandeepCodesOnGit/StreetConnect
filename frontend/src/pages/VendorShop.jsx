import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPlus,
  faMinus,
  faCartShopping,
  faArrowLeft,
  faTimes,
  faSpinner,
  faUtensils, 
  faBan,
  faFire
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import { useVendor } from "../hooks/useVendor";
import { io } from "socket.io-client";

const VendorShop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { vendor, loading, error } = useVendor(id);
  const [liveVendor, setLiveVendor] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { cart, addToCart, removeFromCart, getItemQty, clearCart, totalItems, totalPrice } = useCart();
  
  useEffect(() => {
    if (vendor) setLiveVendor(vendor);
  }, [vendor]);

  useEffect(() => {
    const socket = io("http://localhost:8080");

    const handleMenuUpdate = (data) => {
      if (data.vendorId === id) {
        setLiveVendor((prev) => {
          if (!prev) return prev;
          return { ...prev, menu: data.menu };
        });
      }
    };

    socket.on("menuUpdated", handleMenuUpdate);

    return () => {
      socket.off("menuUpdated", handleMenuUpdate);
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if(totalItems === 0) setIsCartOpen(false);
  }, [totalItems]);

  const placeOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const formattedItems = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.qty
      }));

      const orderData = {
        vendorId: liveVendor._id,
        items: formattedItems,
        totalAmount: totalPrice,
      };

      const res = await api.post("/orders", orderData);

      if (res.data.success) {
        alert("🎉 Order Placed Successfully!");
        clearCart(); 
        setIsCartOpen(false); 
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("You need to be logged in to place an order. Redirecting to login...");
        setIsCartOpen(false);
        navigate("/signin");
      } else {
        const errorMsg = error.response?.data?.message || "Something went wrong.";
        alert(`Order Failed: ${errorMsg}`);
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-orange-500" />
    </div>
  );

  if (!liveVendor) return <div className="mt-32 text-center text-xl font-bold">Vendor not found.</div>;

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-40">
      <div className="max-w-5xl mx-auto px-4 lg:px-0">
        
        {/* --- HEADER SECTION --- */}
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-500 transition font-bold text-sm">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Map
        </button>

        <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start mb-12">
          <div className="w-32 h-32 lg:w-40 lg:h-40 shrink-0 bg-gray-100 rounded-3xl overflow-hidden shadow-inner relative border-4 border-white outline outline-1 outline-gray-100">
            <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black text-white shadow-md backdrop-blur-md ${liveVendor.isLive ? "bg-green-500/90 animate-pulse" : "bg-gray-800/90"}`}>
              {liveVendor.isLive ? "LIVE NOW" : "OFFLINE"}
            </span>
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" className="object-cover w-full h-full" alt="shop" />
          </div>

          <div className="flex-1 text-center md:text-left pt-2">
            <h1 className="text-3xl lg:text-5xl font-black text-gray-900 mb-2 tracking-tight">
              {liveVendor.shopName}
            </h1>
            <p className="text-orange-500 font-black uppercase tracking-widest text-xs lg:text-sm mb-5">
              {liveVendor.category}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl font-black shadow-sm">
                <FontAwesomeIcon icon={faStar} className="text-yellow-500" /> {liveVendor.rating || "New"}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-8 px-2 tracking-tight flex items-center gap-3">
           Our Menu <FontAwesomeIcon icon={faFire} className="text-orange-500" />
        </h2>

        {/* --- 🚨 UPGRADED DELICIOUS MENU GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {liveVendor.menu && liveVendor.menu.length > 0 ? (
            liveVendor.menu.map((item, index) => {
              const qty = getItemQty(item.name);

              return (
                <div key={index} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col group relative">
                  
                  {/* Big Appetizing Image */}
                  <div className="h-56 w-full bg-gray-50 relative overflow-hidden">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${item.isAvailable === false ? 'grayscale blur-[2px]' : ''}`}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-orange-200 bg-orange-50">
                        <FontAwesomeIcon icon={faUtensils} className="text-5xl mb-2" />
                        <span className="text-sm font-bold">No Image</span>
                      </div>
                    )}

                    {/* Sold Out Overlay */}
                    {item.isAvailable === false && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                         <FontAwesomeIcon icon={faBan} className="text-4xl mb-2" />
                         <span className="font-black uppercase tracking-widest">Sold Out</span>
                      </div>
                    )}
                  </div>

                  {/* Text & Controls Container */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <h4 className={`font-black text-2xl mb-2 leading-tight ${item.isAvailable === false ? 'text-gray-400' : 'text-gray-900'}`}>
                        {item.name}
                      </h4>
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-medium">
                        {item.description || "A delicious street food specialty, made fresh to order."}
                      </p>
                    </div>

                    {/* Price & Add to Cart Row */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <p className={`font-black text-2xl ${item.isAvailable === false ? 'text-gray-400' : 'text-orange-500'}`}>
                        ₹{item.price}
                      </p>

                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(item)}
                          disabled={!liveVendor.isLive || item.isAvailable === false}
                          className="bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all active:scale-95 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 uppercase tracking-wider"
                        >
                          {item.isAvailable === false ? 'Out' : 'Add +'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 bg-orange-500 text-white px-2 py-1.5 rounded-xl font-bold shadow-lg shadow-orange-500/30">
                          <button onClick={() => removeFromCart(item.name)} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition active:scale-90">
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <span className="w-4 text-center text-lg">{qty}</span>
                          <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition active:scale-90">
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <FontAwesomeIcon icon={faUtensils} className="text-6xl text-gray-200 mb-4" />
              <p className="text-gray-500 font-bold text-xl mb-2">Menu is empty</p>
              <p className="text-gray-400">This vendor is still setting up their shop.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Floating Cart & Modal --- */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 max-w-4xl mx-auto px-4 z-40 animate-fade-in-up">
          <div onClick={() => setIsCartOpen(true)} className="bg-gray-900 text-white p-4 lg:p-5 rounded-2xl shadow-2xl flex items-center justify-between hover:bg-black transition-colors cursor-pointer border border-gray-800">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-lg">
                {totalItems}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  Total Amount
                </p>
                <p className="font-black text-2xl text-white">₹{totalPrice}</p>
              </div>
            </div>
            <button className="flex items-center gap-3 font-black px-6 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors shadow-md active:scale-95">
              View Cart <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal UI remains clean and unchanged */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] md:rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <h2 className="text-2xl font-black text-gray-900">Your Order</h2>
              <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50/50">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex-1 pr-4">
                    <h4 className="font-black text-gray-900 text-lg">{item.name}</h4>
                    <p className="text-sm font-bold text-gray-500">₹{item.price} each</p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="font-black text-xl text-gray-900">
                      ₹{item.price * item.qty}
                    </div>
                    <div className="flex items-center gap-3 bg-gray-100 px-2 py-1 rounded-xl font-bold">
                      <button onClick={() => removeFromCart(item.name)} className="w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-600 hover:text-orange-500 active:scale-90 transition">
                        <FontAwesomeIcon icon={faMinus} className="text-xs" />
                      </button>
                      <span className="w-4 text-center">{item.qty}</span>
                      <button onClick={() => addToCart(item)} className="w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-600 hover:text-orange-500 active:scale-90 transition">
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white border-t border-gray-100 shrink-0">
              <div className="flex justify-between items-end mb-6">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">
                  Grand Total
                </span>
                <span className="text-4xl font-black text-orange-500">
                  ₹{totalPrice}
                </span>
              </div>

              <button
                onClick={placeOrder}
                disabled={isPlacingOrder}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/20 transition-transform active:scale-95 text-xl flex justify-center items-center gap-3"
              >
                {isPlacingOrder ? (
                  <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Processing...</>
                ) : (
                  "PLACE ORDER"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorShop;