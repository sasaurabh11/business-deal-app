import { createContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(false)
    const [socket, setSocket] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
          withCredentials: true,
        });
        setSocket(newSocket);
    
        return () => newSocket.disconnect();
      }, []);

    const logout = () => {
        setToken('')
        setUser(null)
        localStorage.removeItem('token')
    }
    
    const value = {
        user, setUser,
        token, setToken,
        logout,
        loading, setLoading,
        socket, currentChat, setCurrentChat, unreadCounts, setUnreadCounts
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider