import React, { createContext, useContext, useState } from "react";
import { useEnderecos } from "./enderecosContext";

const LocaisContext = createContext();

function LocaisProvider(props) {
  const [locais, setLocais] = useState([
    {
      id: 1,
      logradouro: 'Rua 1', 
      cep: "40195745",
      bairro: 'Bairro 1',
      taxa: 4,
      local: 'Hotel 1',
      numero: '1660'    
    },
    {
      id: 2,
      logradouro: 'Rua 2', 
      cep: "40195735",
      bairro: 'Bairro 1',
      taxa: 7,
      local: 'Condomínio 1',
      numero: '25A'    
    },
    {
      id: 3,
      logradouro: 'Rua 1', 
      cep: "40195745",
      bairro: 'Bairro 1',
      taxa: 6,
      local: 'Hospital 1',
      numero: '427'    
    }
  ]);
  return (
    <LocaisContext.Provider value={{ locais, setLocais }}>
      {props.children}
    </LocaisContext.Provider>
  );
}

export default LocaisProvider;

export const useLocais = () => {
    return useContext(LocaisContext)
}