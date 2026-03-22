import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // 🚨 Using your custom Axios instance!
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faClock, faCheckCircle, faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
const socket = io("http://localhost:8080");

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        // Automatically sends cookies because of your custom api instance!
        const res = await api.get('/orders/myorders');
        setOrders(res.data.orders);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  useEffect(() => {
    const handleStatusChange = (data) => {
      // Find the specific order in our array and update its status
      setOrders((prevOrders) => 
        prevOrders.map((order) => 
          order._id === data.orderId 
            ? { ...order, status: data.status } 
            : order
        )
      );
    };

    socket.on("orderStatusChanged", handleStatusChange);

    // Clean up the listener when they leave the page
    return () => socket.off("orderStatusChanged", handleStatusChange);
  }, []);

  // Helper function to color-code the order status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Accepted': return 'bg-blue-100 text-blue-700';
      case 'Preparing': return 'bg-purple-100 text-purple-700';
      case 'Ready': return 'bg-green-100 text-green-700';
      case 'Completed': return 'bg-gray-100 text-gray-600';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-orange-500" />
    </div>
  );

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-32">
      <div className="max-w-3xl mx-auto px-4 lg:px-0">
        
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-500 transition font-bold text-sm">
            <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-8">My Orders</h1>

        {error ? (
          <div className="text-center text-red-500 font-bold p-6 bg-red-50 rounded-2xl border border-red-100">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <FontAwesomeIcon icon={faBoxOpen} className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't ordered any street food recently.</p>
            <button onClick={() => navigate('/')} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition">
              Explore Nearby Vendors
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)} 
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer"
            >
                
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      {order.vendor ? order.vendor.shopName : "Unknown Vendor"}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Order ID: {order._id.slice(-10).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-700 font-medium">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-gray-500 font-bold text-sm uppercase tracking-wider">Total Amount</span>
                  <span className="text-xl font-black text-gray-900">₹{order.totalAmount}</span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;