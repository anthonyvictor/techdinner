import React, { createContext, useContext, useState } from 'react';

const RotasContext = createContext()

function RotasProvider(props) {
  const [currentRoute, setCurrentRoute] = useState('/')
  
    return (
        <RotasContext.Provider value={{currentRoute, setCurrentRoute}}>
            {props.children}
        </RotasContext.Provider>
    )
}

export default RotasProvider

export const useRotas = () => {
    return useContext(RotasContext)
}