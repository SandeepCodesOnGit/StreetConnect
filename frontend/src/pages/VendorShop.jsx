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
  faUtensils, // 🚨 NEW: Added the utensils icon for the image fallback
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/cartContext";
import api from "../api/axios";
import { useVendor } from "../hooks/useVendor";

const VendorShop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { vendor, loading, error } = useVendor(id);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { cart, addToCart, removeFromCart, getItemQty, clearCart, totalItems, totalPrice } = useCart();
  
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
        vendorId: vendor._id,
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
      console.error("Order failed:", error);
      if (error.response && error.response.status === 401) {
        alert(
          "You need to be logged in to place an order. Redirecting to login...",
        );
        setIsCartOpen(false);
        navigate("/signin");
      } else {
        const errorMsg =
          error.response?.data?.message || "Something went wrong.";
        alert(`Order Failed: ${errorMsg}`);
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FontAwesomeIcon
          icon={faSpinner}
          className="animate-spin text-4xl text-orange-500"
        />
      </div>
    );

  if (!vendor)
    return (
      <div className="mt-32 text-center text-xl font-bold">
        Vendor not found.
      </div>
    );

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-32">
      <div className="max-w-4xl mx-auto px-4 lg:px-0">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-500 transition font-bold text-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Map
        </button>

        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          <div className="w-32 h-32 shrink-0 bg-gray-100 rounded-2xl overflow-hidden shadow-inner relative">
            <span
              className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black text-white ${vendor.isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
            >
              {vendor.isLive ? "LIVE" : "OFFLINE"}
            </span>
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"
              className="object-cover w-full h-full"
              alt="shop"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
              {vendor.shopName}
            </h1>
            <p className="text-orange-500 font-bold uppercase tracking-widest text-xs lg:text-sm mb-4">
              {vendor.category}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-gray-600">
              <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold">
                <FontAwesomeIcon icon={faStar} /> {vendor.rating || "New"}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-800 mt-10 mb-6 px-2">
          Menu Items
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {vendor.menu && vendor.menu.length > 0 ? (
            vendor.menu.map((item, index) => {
              const qty = getItemQty(item.name);

              return (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:border-orange-200 hover:shadow-md transition-all group"
                >
                  {/* 🚨 THE NEW IMAGE SECTION 🚨 */}
                  <div className="shrink-0">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-50"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-orange-50 rounded-xl flex items-center justify-center text-orange-200 shadow-sm border border-orange-100">
                        <FontAwesomeIcon icon={faUtensils} className="text-2xl" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-gray-900 font-black text-lg">
                        ₹{item.price}
                      </p>

                      {/* Cart Logic */}
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(item)}
                          disabled={!vendor.isLive || !item.isAvailable}
                          className="shrink-0 bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white px-5 py-1.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="shrink-0 flex items-center gap-2 bg-orange-500 text-white px-2 py-1 rounded-xl font-bold shadow-md text-sm">
                          <button
                            onClick={() => removeFromCart(item.name)}
                            className="w-6 h-6 rounded-lg hover:bg-white/20 flex items-center justify-center transition"
                          >
                            <FontAwesomeIcon icon={faMinus} className="text-xs" />
                          </button>
                          <span className="w-4 text-center">{qty}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-6 h-6 rounded-lg hover:bg-white/20 flex items-center justify-center transition"
                          >
                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400 font-medium">
                This vendor hasn't added any menu items yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- Floating Cart & Modal remain exactly the same --- */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 max-w-4xl mx-auto px-4 z-40 animate-fade-in-up">
          <div
            onClick={() => setIsCartOpen(true)}
            className="bg-green-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between hover:bg-green-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white text-green-600 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-sm">
                {totalItems}
              </div>
              <div>
                <p className="text-xs text-green-100 font-bold uppercase tracking-wider">
                  Total Amount
                </p>
                <p className="font-black text-xl">₹{totalPrice}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 font-bold px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-sm lg:text-base">
              View Cart <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h2 className="text-2xl font-black text-gray-900">Your Order</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-50 pb-4"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-sm font-bold text-gray-500">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-100 text-gray-800 px-2 py-1 rounded-lg font-bold">
                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faMinus} className="text-xs" />
                    </button>
                    <span className="w-4 text-center text-sm">{item.qty}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-xs" />
                    </button>
                  </div>

                  <div className="w-16 text-right font-black text-gray-900">
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">
                  Grand Total
                </span>
                <span className="text-2xl font-black text-gray-900">
                  ₹{totalPrice}
                </span>
              </div>

              <button
                onClick={placeOrder}
                disabled={isPlacingOrder}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-black py-4 rounded-xl shadow-lg transition-transform active:scale-95 text-lg flex justify-center items-center gap-2"
              >
                {isPlacingOrder ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin"
                    />{" "}
                    Processing...
                  </>
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