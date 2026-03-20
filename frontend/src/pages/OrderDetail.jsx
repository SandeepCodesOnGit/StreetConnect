import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner, faReceipt, faStore } from '@fortawesome/free-solid-svg-icons';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-orange-500" />
    </div>
  );

  if (error || !order) return <div className="mt-32 text-center text-xl font-bold text-red-500">{error || "Order not found."}</div>;

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

          {/* Status Tracker */}
          <div className="bg-gray-50 p-4 rounded-2xl mb-8 flex justify-between items-center border border-gray-100">
            <span className="font-bold text-gray-600 uppercase tracking-wider text-sm">Current Status</span>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 font-black rounded-xl uppercase tracking-widest text-sm shadow-sm">
              {order.status}
            </span>
          </div>

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
                      {item.quantity}x
                    </span>
                    <span className="font-bold text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
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