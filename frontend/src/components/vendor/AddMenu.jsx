import React, { useState } from 'react';
import api from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AddMenu = ({ vendorId, setActiveTab }) => {
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', image: '' });
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await api.post(`/vendors/${vendorId}/menu`, newItem); 
      if (res.data.success) {
        alert("✅ Item added to menu!");
        setNewItem({ name: '', description: '', price: '', image: '' }); 
        navigate(`/vendor-dashboard/${vendorId}/menu`);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add item");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black text-gray-900 mb-6">Add New Menu Item</h2>
      <form onSubmit={handleAddItem} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Item Name</label>
          <input type="text" required value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="e.g., Paneer Tikka" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
          <textarea value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="Brief description..." rows="3"></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
            <input type="number" required value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="e.g., 120" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
            <input type="url" value={newItem.image} onChange={(e) => setNewItem({...newItem, image: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="https://..." />
          </div>
        </div>
        <button type="submit" disabled={isAdding} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl transition mt-4 active:scale-95">
          {isAdding ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> Adding...</> : "+ Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddMenu;