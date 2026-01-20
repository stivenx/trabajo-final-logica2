
import { useState,createContext } from "react";
import { useNavigate } from "react-router-dom";


export const LogoutContext = createContext();



export const LogoutProvider = ({children}) => {
    const [logout, setLogout] = useState(false);
    const navigate = useNavigate();

    const close =()=>{
        setLogout(false);
    }

    const open =()=>{
        setLogout(true)
    }

    const logoutSystem =()=>{
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
        setLogout(false);

    }
    return (
        <LogoutContext.Provider value={{logout, open, close, logoutSystem }}>
            {children}
        </LogoutContext.Provider>
    )
}