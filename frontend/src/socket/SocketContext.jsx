import { createContext, useState, useEffect, useContext } from "react";
import socket from "./socket";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            setConnected(true);
        });
        socket.on("disconnect", () => {
            console.log("Socket disconnected:");
            setConnected(false);
        });

        return () => {
            socket.off("connection");
            socket.off("disconnect");
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    )
};

export const useSocketContext = () => useContext(SocketContext);