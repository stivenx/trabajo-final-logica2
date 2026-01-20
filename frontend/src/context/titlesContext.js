import React, { useEffect,useState,createContext } from "react";
import { useLocation } from "react-router-dom";
import titles from "./titles";

export const TitlesContext = createContext();


export const TitlesProvider = ({ children }) => {
    const location = useLocation();
    const titleInit = titles[location.pathname] || "Tienda tecnologica";
    const [title, setTitle] = useState(titleInit);
 
    useEffect(()=>{
      document.title = title
    },[title])


    useEffect(()=>{
        if(titles[location.pathname]){
            setTitle(titles[location.pathname])

        }
    },[location.pathname])

    return (
        <TitlesContext.Provider value={{setTitle}}>
            {children}
        </TitlesContext.Provider>
    )

}