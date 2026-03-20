import { useState, useEffect } from 'react';
import api from '../api/axios';
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

export const useNearbyVendors = (lat, lng) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lng) {
      setLoading(false);
      return;
    }

    const fetchVendors = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/vendors/nearby?lat=${lat}&lng=${lng}`);
        
        const fetchedVendors = res.data.vendors || res.data.data || res.data.count || [];
        setVendors(fetchedVendors);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch nearby vendors:", err);
        setError(err.response?.data?.message || "Could not load vendors in your area.");
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();

    socket.on("vendorStatusChanged", (data) => {

      setVendors((prevVendors) => 
        prevVendors.map((v) => 
          v._id === data.vendorId ? {...v, isLive: data.isLive} : v
        )
      );
    });

    return () => {
      socket.off("vendorStatusChanged");
    }
  }, [lat, lng]);

  return { vendors, loading, error };
};