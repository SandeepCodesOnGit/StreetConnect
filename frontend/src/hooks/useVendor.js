import { useEffect, useState } from "react"
import api from "../api/axios";

import { useSocketContext } from "../socket/SocketContext";

export const useVendor = (id) => {
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { socket } = useSocketContext();

    useEffect(() => {
        if(!id) {
            setLoading(false)
            return;
        }

        const fetchVendorData = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/vendors/${id}`);
                setVendor(res.data.vendor);
                setError(null);
            } catch (err) {
                console.error("Error fetching vendor: ", err);
                setError(err.response?.data?.message || "Failed to fetch vendor");
            } finally {
                setLoading(false);
            }
        };

        fetchVendorData();
    }, [id]);

    useEffect(() => {
        if(!socket) return;

        socket.emit("joinVendorRoom", id);

        const handleStatusChange = (data) => {
            if(data.vendorId === id) {
                setVendor((prevVendor) => {
                    if(!prevVendor) return null;
                    return {...prevVendor, isLive: data.isLive };
                });
            }
        };

        socket.on("vendorStatusChanged", handleStatusChange);

        return () => {
            socket.emit("leaveVendorRoom", id);
            socket.off("vendorStatusChanged", handleStatusChange);
        };

    }, [socket, id]);

    return { vendor, loading, error};
};