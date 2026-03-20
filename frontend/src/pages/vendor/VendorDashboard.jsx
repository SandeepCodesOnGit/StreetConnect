import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faSpinner, faCheckCircle, faClock, faUtensils, faTimes } from '@fortawesome/free-solid-svg-icons';

const VendorDashboard = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  
  // --- ORDERS STATE ---
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- MENU MANAGEMENT & SHOP STATE ---
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'menu'
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', image: '' });
  const [isAdding, setIsAdding] = useState(false);
  
  // 🚨 NEW: State to track if the shop is currently Live
  const [isLive, setIsLive] = useState(false); 

  useEffect(() => {
    fetchOrders();
    fetchVendorStatus(); // 🚨 Fetch the current status on load
  }, [vendorId]);

  // 🚨 NEW: Fetch the vendor's data to see if they are already live
  const fetchVendorStatus = async () => {
    try {
      const res = await api.get(`/vendors/${vendorId}`);
      if (res.data.success && res.data.vendor) {
        setIsLive(res.data.vendor.isLive);
      }
    } catch (err) {
      console.error("Failed to load vendor status");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders/vendor/${vendorId}`);
      setOrders(res.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load vendor orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      alert("Failed to update order status.");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await api.post(`/vendors/${vendorId}/menu`, newItem); 
      if (res.data.success) {
        alert("✅ Item added to menu!");
        setNewItem({ name: '', description: '', price: '', image: '' }); 
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add item");
    } finally {
      setIsAdding(false);
    }
  };

  // 🚨 NEW: The function that toggles the live status in the backend
  const handleToggleLive = async () => {
    try {
      // Optimistically update UI so it feels instant
      setIsLive(!isLive); 
      const res = await api.put(`/vendors/${vendorId}/status`);
      
      // Revert if backend fails
      if (!res.data.success) setIsLive(!isLive);
    } catch (error) {
      setIsLive(!isLive); // Revert on error
      alert("Failed to update status.");
    }
  };

  const renderActionButtons = (order) => {
    if (order.status === 'Pending') {
      return (
        <div className="flex gap-2 w-full mt-4">
          <button onClick={() => handleStatusUpdate(order._id, 'Accepted')} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition">Accept</button>
          <button onClick={() => handleStatusUpdate(order._id, 'Cancelled')} className="px-4 bg-red-100 text-red-600 hover:bg-red-200 font-bold rounded-lg transition"><FontAwesomeIcon icon={faTimes} /></button>
        </div>
      );
    }
    if (order.status === 'Accepted') {
      return <button onClick={() => handleStatusUpdate(order._id, 'Preparing')} className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg transition">Start Preparing</button>;
    }
    if (order.status === 'Preparing') {
      return <button onClick={() => handleStatusUpdate(order._id, 'Ready')} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition">Mark as Ready</button>;
    }
    if (order.status === 'Ready') {
      return <button onClick={() => handleStatusUpdate(order._id, 'Completed')} className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 rounded-lg transition">Handed to Customer</button>;
    }
    return null; 
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-orange-500" />
    </div>
  );

  return (
    <div className="pt-24 min-h-screen bg-gray-100 pb-32">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        
        {/* --- HEADER & TAB NAVIGATION --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <FontAwesomeIcon icon={faStore} className="text-orange-500" /> Vendor Dashboard
            </h1>
            
            <div className="flex items-center gap-5">
              
              {/* 🚨 THE NEW GO LIVE TOGGLE 🚨 */}
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                <span className={`font-black uppercase tracking-widest text-xs ${isLive ? 'text-green-500' : 'text-gray-400'}`}>
                  {isLive ? 'Online' : 'Offline'}
                </span>
                <button 
                  onClick={handleToggleLive}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${isLive ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isLive ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
              </div>

              {activeTab === 'orders' && (
                <button onClick={() => fetchOrders()} className="bg-orange-100 text-orange-600 hover:bg-orange-200 font-bold px-4 py-2 rounded-xl transition">
                  Refresh Orders
                </button>
              )}
            </div>
          </div>
          
          {/* TAB BUTTONS */}
          <div className="flex gap-6 border-b border-gray-100 pb-0">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`font-bold pb-3 px-2 transition border-b-2 ${activeTab === 'orders' ? 'text-orange-500 border-orange-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              Live Orders
            </button>
            <button 
              onClick={() => setActiveTab('menu')}
              className={`font-bold pb-3 px-2 transition border-b-2 ${activeTab === 'menu' ? 'text-orange-500 border-orange-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              Manage Menu
            </button>
          </div>
        </div>

        {/* --- TAB 1: LIVE ORDERS --- */}
        {activeTab === 'orders' && (
          <div>
            {error ? (
              <div className="text-center text-red-500 font-bold p-6 bg-red-50 rounded-2xl border border-red-100">{error}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet!</h3>
                <p className="text-gray-500">Waiting for customers to place an order...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <div key={order._id} className={`bg-white p-6 rounded-2xl shadow-md border-t-4 ${order.status === 'Pending' ? 'border-yellow-400' : order.status === 'Ready' ? 'border-green-500' : 'border-gray-200'} flex flex-col`}>
                    
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="font-black text-gray-900 text-lg">#{order._id.slice(-5).toUpperCase()}</h3>
                        <p className="text-sm text-gray-500 font-medium">{order.customer?.username || "Guest"}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest
                        ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          order.status === 'Preparing' ? 'bg-purple-100 text-purple-700' : 
                          order.status === 'Ready' ? 'bg-green-100 text-green-700' : 
                          'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm font-bold text-gray-700">
                          <span>{item.qty}x {item.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-400 font-medium">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xl font-black text-gray-900">₹{order.totalAmount}</div>
                    </div>

                    {renderActionButtons(order)}

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: MANAGE MENU --- */}
        {activeTab === 'menu' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 max-w-2xl">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Add New Menu Item</h2>
            <form onSubmit={handleAddItem} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Item Name</label>
                <input type="text" required value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="e.g., Paneer Tikka" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="Brief description of the dish..." rows="3"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" required value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="e.g., 120" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Image URL <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="url" value={newItem.image} onChange={(e) => setNewItem({...newItem, image: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="https://..." />
                </div>
              </div>
              <button type="submit" disabled={isAdding} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl transition mt-4 active:scale-95">
                {isAdding ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> Adding...</> : "+ Add to Menu"}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default VendorDashboard;