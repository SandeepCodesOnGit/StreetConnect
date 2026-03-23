import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faUtensils, faEdit, faTrash, faTimes, faBowlFood, faBan, faPizzaSlice } from '@fortawesome/free-solid-svg-icons';

const MenuList = ({ vendorId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({name: "", description: "", price: "", imageUrl: ""});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get(`/vendors/${vendorId}`);
        if (res.data.success && res.data.vendor) {
          setMenuItems(res.data.vendor.menu || []);
        }
      } catch (err) {
        console.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [vendorId]);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await api.delete(`/vendors/${vendorId}/menu/${itemId}`);
      if (res.data.success) {
        setMenuItems(res.data.menu);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete item");
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      // Send the opposite of whatever the current status is
      const res = await api.put(`/vendors/${vendorId}/menu/${item._id}`, {
        isAvailable: !item.isAvailable 
      });
      if (res.data.success) {
        setMenuItems(res.data.menu); 
      }
    } catch (error) {
      alert("Failed to update availability.");
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item._id);
    setEditForm({
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl || ""
    });
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await api.put(`/vendors/${vendorId}/menu/${editingItem}`, editForm);
      if (res.data.success) {
        setMenuItems(res.data.menu); // Instantly update UI
        setEditingItem(null); // Close modal
      }
    } catch (error) {
      alert("Failed to update item.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="py-20 text-center"><FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-orange-500" /></div>;

  return (
   <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 relative animate-fade-in">
      <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <FontAwesomeIcon icon={faUtensils} className="text-orange-500" /> My Listed Products
      </h2>
      
      {menuItems.length === 0 ? (
        <div className="text-center py-12 bg-orange-50 rounded-2xl border-2 border-dashed border-orange-100">
          <p className="text-gray-600 font-bold">Your menu is empty.</p>
          <p className="text-sm text-gray-400">Add your first product in the next tab!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            // 🚨 Revised Card: Better structure, full width image on top
            <div key={item._id} className={`flex flex-col overflow-hidden rounded-3xl transition duration-300 group ${item.isAvailable !== false ? 'bg-white shadow-sm hover:shadow-xl' : 'bg-gray-100 border border-gray-200'}`}>
              
              {/* 🚨 1. Image Bigger - Full Width Top Placement */}
              <div className="w-full h-56 relative overflow-hidden shrink-0">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${item.isAvailable === false ? 'grayscale' : ''}`} 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-orange-50">
                    <FontAwesomeIcon icon={faBowlFood} className="text-5xl" />
                    <p className="text-xs mt-2">No photo available</p>
                  </div>
                )}
                
                {/* Out of Stock Overlay */}
                {item.isAvailable === false && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                     <FontAwesomeIcon icon={faBan} className="text-4xl mb-2" />
                     <span className="font-black uppercase text-sm tracking-widest">Currently Unavailable</span>
                  </div>
                )}
              </div>
              
              {/* 🚨 2. "Delicious" Text Layout - Prominent and readable */}
              <div className="flex-1 p-6 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h4 className={`text-2xl font-black leading-tight ${item.isAvailable === false ? 'text-gray-500 line-through decoration-red-500' : 'text-gray-950'}`}>
                      {item.name}
                    </h4>
                    {/* Refined Price Badge */}
                    <div className="text-right shrink-0">
                      <span className="text-2xl font-black text-orange-500">₹{item.price}</span>
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Buttons container (keep separate flex for actions and toggle) */}
                <div className="space-y-4 pt-4 mt-auto">
                  {/* Status Toggle remains clean */}
                  <div className="flex items-center justify-between bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 mb-3">
                    <span className={`text-xs font-black uppercase tracking-widest ${item.isAvailable !== false ? 'text-green-600' : 'text-red-500'}`}>
                      {item.isAvailable !== false ? '🟢 In Stock' : '🔴 Sold Out'}
                    </span>
                    <button 
                      onClick={() => handleToggleAvailability(item)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shadow-inner ${item.isAvailable !== false ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${item.isAvailable !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Revised Actions: Distinct colors */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => openEditModal(item)} className="flex-1 bg-white border border-gray-200 text-blue-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 font-bold py-3 rounded-2xl text-sm transition shadow-sm active:scale-95">
                      <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit Details
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="px-5 bg-white border border-gray-200 text-red-400 hover:text-red-700 hover:border-red-300 hover:bg-red-50 font-bold py-3 rounded-2xl text-sm transition shadow-sm active:scale-95">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- EDIT MODAL (Unchanged functionality, updated titles) --- */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-fade-in border border-gray-100">
            <button onClick={() => setEditingItem(null)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition active:scale-90">
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
            <h3 className="text-3xl font-black text-gray-950 mb-8 flex items-center gap-3">
               <FontAwesomeIcon icon={faPizzaSlice} className="text-orange-500" /> Update Details
            </h3>
            <form onSubmit={handleUpdateItem} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Item Name</label>
                <input type="text" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 text-lg font-bold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 leading-relaxed" rows="3"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" required value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 text-lg font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                  <input type="url" value={editForm.image} onChange={(e) => setEditForm({...editForm, image: e.target.value})} className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500" />
                </div>
              </div>
              <button type="submit" disabled={isUpdating} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition mt-6 shadow-md active:scale-95 disabled:opacity-50">
                {isUpdating ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> Saving...</> : "Apply Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;