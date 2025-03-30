import { createContext, useEffect, useState } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(false)

    const logout = () => {
        setToken('')
        setUser(null)
        localStorage.removeItem('token')
    }
    
    const value = {
        user, setUser,
        token, setToken,
        logout,
        loading, setLoading
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider