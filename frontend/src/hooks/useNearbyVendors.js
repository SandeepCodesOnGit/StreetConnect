import { useState, useEffect } from 'react';
import api from '../api/axios';

import { useSocketContext } from '../socket/SocketContext';

export const useNearbyVendors = (lat, lng) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { socket } = useSocketContext();

  useEffect(() => {
    if (!lat || !lng) {
      setLoading(false);
      return;
    }

    let fetchedVendorIds = [];

    const fetchVendors = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/vendors/nearby?lat=${lat}&lng=${lng}`);
        
        const fetchedVendors = res.data.vendors || res.data.data || res.data.count || [];
        setVendors(fetchedVendors);
        setError(null);

        if(socket) {
          fetchedVendors.forEach((vendor) => {
            socket.emit("joinVendorRoom", vendor._id);
            fetchedVendorIds.push(vendor._id);
          });
        }
      } catch (err) {
        console.error("Failed to fetch nearby vendors:", err);
        setError(err.response?.data?.message || "Could not load vendors in your area.");
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();

    return () => {
      if(socket) {
        fetchedVendorIds.forEach((vendorId) => 
          socket.emit("leaveVendorRoom", vendorId)
        );
      }
    };
  }, [lat, lng, socket]);

  useEffect(() => {
    if(!socket) return;

    const handleStatusChange = (data) => {
      console.log("Real-time update recieved:", data);

      setVendors((prevVendors) => 
        prevVendors.map((v) => 
          v._id === data.vendorId ? {...v, isLive: data.isLive} : v
        )
      );
    }

    const handleLocationChange = (data) => {
      console.log("Vendor moved:", data);

      setVendors((prevVendors) => 
        prevVendors.map((v) => {
          if(v._id === data.vendorId) {
            return {
              ...v,
              location: {
                ...v.location,
                coordinates: [data.lng, data.lat]
              }
            };
          }
          return v;
        })
      );
    };

    socket.on("vendorStatusChanged", handleStatusChange);
    socket.on("vendorLocationChanged", handleLocationChange);

    return () => {
      socket.off("vendorStatusChanged", handleStatusChange);
      socket.off("vendorLocationChanged", handleLocationChange);
    }
  }, [socket]);

  return { vendors, loading, error };
};