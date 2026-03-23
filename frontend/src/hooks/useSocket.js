import { useEffect } from "react";
import { useSocketContext } from "../socket/SocketContext"

const useSocket = (event, callback) => {
    const { socket } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        socket.on(event, callback);

        return () => {
            socket.off(event, callback);
        };
    }, [socket, event, callback]);
};
export default useSocket;