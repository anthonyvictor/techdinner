import React, { createContext, useContext, useState } from "react";

const EnderecosContext = createContext();

function EnderecosProvider(props) {
  const [enderecos, setEnderecos] = useState([]);
  return (
    <EnderecosContext.Provider value={{ enderecos, setEnderecos }}>
      {props.children}
    </EnderecosContext.Provider>
  );
}

export default EnderecosProvider;

export const useEnderecos = () => {
    return useContext(EnderecosContext)
}