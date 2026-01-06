import { useEffect,useRef,useCallback } from "react";


export const useStatusSocket = (setTables)=>{
    const socketRef = useRef(null)
    const WS_URL = import.meta.env.VITE_WS_URL;

    useEffect(()=>{
        const socket = new WebSocket(
            `${WS_URL}/ws/tables/`
        )
        socketRef.current = socket


        socket.onopen = ()=>{
            console.log("connected");
            
        }
        socket.onerror = (error)=>{
            console.error("webSocket error", error);
            
        }
        socket.onclose = (event) =>{
            console.log("websocket closed",event);
            
        }
        socket.onmessage = (event) => {
            console.log("message from server:", event.data);
            const payload = JSON.parse(event.data)

            setTables((prevTables) =>
                prevTables.map((t) =>
                t.id === payload.table_id
                    ? { ...t, status: payload.status }
                    : t
                            )
            );
            };

        return () => {
    socket.onclose = null
      socket.close();
    };
    },[setTables,WS_URL])
    

    return { socket:socketRef.current };
    
}