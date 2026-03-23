import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// 🚨 Added faSync and faClock for the new balanced header
import {
  faSpinner,
  faTimes,
  faSync,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

import { useSocketContext } from "../../socket/SocketContext";

const LiveOrders = ({ vendorId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocketContext();
  const audioRef = useRef(new Audio("../assets/fahhh.wav"))

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/vendor/${vendorId}`);
      console.log(res)
      const activeOrders = res.data.orders.filter(
        (order) => !["Completed", "Cancelled"].includes(order.status)
      );
      setOrders(activeOrders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [vendorId]);

  useEffect(() => {
    if(!socket) return;

    const handleNewOrder = (data) => {
      if (data.vendorId === vendorId) {
        setOrders((prevOrders) => [data.order, ...prevOrders]);
        audioRef.current.play().catch(e => console.log("Audio blocked by browser:", e)); 
      }
    };
    socket.on("newOrderPlaced", handleNewOrder);

    return () => socket.off("newOrderPlaced", handleNewOrder);
  }, [vendorId, socket]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (newStatus === "Completed" || newStatus === "Cancelled") {
        setTimeout(() => {
          setOrders((prevOrders) => prevOrders.filter((o) => o._id !== orderId));
        }, 1500);
      }
    } catch (error) {
      alert("Failed to update order status.");
    }
  };

  const renderActionButtons = (order) => {
    if (order.status === "Pending") {
      return (
        <div className="flex gap-2 w-full mt-4">
          <button
            onClick={() => handleStatusUpdate(order._id, "Accepted")}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
          >
            Accept
          </button>
          <button
            onClick={() => handleStatusUpdate(order._id, "Cancelled")}
            className="px-4 bg-red-100 text-red-600 hover:bg-red-200 font-bold rounded-lg transition"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      );
    }
    if (order.status === "Accepted")
      return (
        <button
          onClick={() => handleStatusUpdate(order._id, "Preparing")}
          className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg transition"
        >
          Start Preparing
        </button>
      );
    if (order.status === "Preparing")
      return (
        <button
          onClick={() => handleStatusUpdate(order._id, "Ready")}
          className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition"
        >
          Mark as Ready
        </button>
      );
    if (order.status === "Ready")
      return (
        <button
          onClick={() => handleStatusUpdate(order._id, "Completed")}
          className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 rounded-lg transition"
        >
          Handed to Customer
        </button>
      );
    return null;
  };

  if (loading && orders.length === 0)
    return (
      <div className="py-20 text-center">
        <FontAwesomeIcon
          icon={faSpinner}
          className="animate-spin text-4xl text-orange-500"
        />
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 font-bold p-6 bg-red-50 rounded-2xl">
        {error}
      </div>
    );

  return (
    <div className="w-full animate-fade-in">
      {/* 🚨 THE NEW SYMMETRICAL HEADER ROW */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <FontAwesomeIcon icon={faClock} className="text-orange-500" /> Live
          Orders
        </h2>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-300 font-bold px-4 py-2 rounded-xl transition shadow-sm active:scale-95 disabled:opacity-50"
        >
          <FontAwesomeIcon
            icon={faSync}
            className={loading ? "animate-spin" : ""}
          />
          {loading ? "Syncing..." : "Refresh"}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No orders right now
          </h3>
          <p className="text-gray-500 font-medium">
            When a customer places an order, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border-t-4 ${order.status === "Pending" ? "border-yellow-400" : order.status === "Ready" ? "border-green-500" : "border-gray-200"} flex flex-col`}
            >
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">
                    #{order._id.slice(-5).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {order.customer?.username || "Guest"}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-700">
                  {order.status}
                </span>
              </div>
              <div className="flex-1 space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm font-bold text-gray-700"
                  >
                    <span>
                      {item.qty}x {item.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                <div className="text-xl font-black text-gray-900">
                  ₹{order.totalAmount}
                </div>
              </div>
              {renderActionButtons(order)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveOrders;
