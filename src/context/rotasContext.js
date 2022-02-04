import React, { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

const RotasContext = createContext()

function RotasProvider(props) {
  const [currentRoute, setCurrentRoute] = useState('/')
  const location = useLocation()
  
    return (
        <RotasContext.Provider value={{currentRoute, setCurrentRoute, location}}>
            {props.children}
        </RotasContext.Provider>
    )
}

export default RotasProvider

export const useRotas = () => {
    return useContext(RotasContext)
}