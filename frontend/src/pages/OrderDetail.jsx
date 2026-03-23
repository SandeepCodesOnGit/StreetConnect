import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner, faReceipt, faStore, faClock, faThumbsUp, faFire, faShoppingBag, faCheckCircle, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { useSocketContext } from '../socket/SocketContext';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocketContext();

  console.log(order);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if(!socket ||!order?._id) return;

    const handleStatusChange = (data) => {
      if (data.orderId === order._id) {
        setOrder((prevOrder) => ({
          ...prevOrder,
          status: data.status
        }));
      }
    };
    socket.on("orderStatusChanged", handleStatusChange);

    return () => socket.off("orderStatusChanged", handleStatusChange);
  }, [order?._id, socket]);

  const orderSteps = [
    { status: 'Pending', icon: faClock },
    { status: 'Accepted', icon: faThumbsUp },
    { status: 'Preparing', icon: faFire },
    { status: 'Ready', icon: faShoppingBag },
    { status: 'Completed', icon: faCheckCircle }
  ];
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Accepted': return 'bg-blue-100 text-blue-700';
      case 'Preparing': return 'bg-purple-100 text-purple-700';
      case 'Ready': return 'bg-green-100 text-green-700';
      case 'Completed': return 'bg-gray-800 text-white';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-orange-500" />
    </div>
  );

  if (error || !order) return <div className="mt-32 text-center text-xl font-bold text-red-500">{error || "Order not found."}</div>;
  const currentStepIndex = orderSteps.findIndex(step => step.status === order.status);
  
  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-32">
      <div className="max-w-2xl mx-auto px-4 lg:px-0">
        
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-500 transition font-bold text-sm">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Orders
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-8 border-b border-gray-50 pb-6">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <FontAwesomeIcon icon={faReceipt} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Order Summary</h1>
            <p className="text-sm text-gray-500 font-medium">Order ID: {order._id}</p>
            <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
          </div>

          {/* 🚨 THE NEW PROGRESS BAR */}
          {order.status !== 'Cancelled' ? (
            <div className="mb-10 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500 ease-in-out" 
                   style={{ width: `${(Math.max(0, currentStepIndex) / (orderSteps.length - 1)) * 100}%` }}></div>
              
              <div className="relative z-10 flex justify-between">
                {orderSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={step.status} className="flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${isCompleted ? 'bg-orange-500 text-white shadow-md scale-110' : 'bg-gray-100 text-gray-300'}`}>
                        <FontAwesomeIcon icon={step.icon} className={isCurrent && index < 4 ? "animate-pulse" : ""} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${isCompleted ? 'text-orange-600' : 'text-gray-400'}`}>
                        {step.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
             <div className="text-center p-4 bg-red-50 text-red-600 font-black rounded-2xl mb-8 border border-red-100 uppercase tracking-widest">
               Order Cancelled
             </div>
          )}

          {/* Status Tracker */}
          <div className="bg-gray-50 p-4 rounded-2xl mb-8 flex justify-between items-center border border-gray-100">
            <span className="font-bold text-gray-600 uppercase tracking-wider text-sm">Current Status</span>
            <span className={`px-4 py-2 font-black rounded-xl uppercase tracking-widest text-sm shadow-sm transition-colors duration-300 ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          
          {['Accepted', 'Preparing', 'Ready'].includes(order.status) && order.vendor && (
            <button 
              onClick={() => navigate(`/track/${order.vendor._id}`)} // Make sure this matches your App.js route for the map!
              className="w-full mb-8 bg-gray-900 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-black transition-transform active:scale-95 text-lg flex justify-center items-center gap-3 uppercase tracking-widest"
            >
              <FontAwesomeIcon icon={faLocationCrosshairs} className="animate-pulse text-orange-500" />
              Track Vendor Live
            </button>
          )}

          {/* Vendor Info */}
          <div className="mb-8">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
               <FontAwesomeIcon icon={faStore} className="text-gray-400" /> Vendor Details
            </h3>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="font-bold text-gray-800 text-lg">{order.vendor?.shopName}</p>
              <p className="text-sm text-gray-500">{order.vendor?.category}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-8">
            <h3 className="text-lg font-black text-gray-900 mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center font-bold text-sm">
                      {item.quantity || item.qty}x
                    </span>
                    <span className="font-bold text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.price * (item.quantity || item.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <span className="text-gray-500 font-bold uppercase tracking-wider">Grand Total</span>
            <span className="text-3xl font-black text-orange-500">₹{order.totalAmount}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetail;