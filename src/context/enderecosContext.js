import React, { createContext, useContext, useState } from "react";

const EnderecosContext = createContext();

function EnderecosProvider(props) {
  const [enderecos, setEnderecos] = useState([
    {
      id: 1,
      logradouro: 'Avenida Penetração Norte-Sul',
      cep: "40195745",
      bairro: 'Fortaleza',
      taxa: 2
    },
    {
      id: 2,
      logradouro: 'Travessa Maravilha Tristeza',
      cep: "40195735",
      bairro: 'Ondina',
      taxa: 3
    },
    {
      id: 3,
      logradouro: 'Ladeira dos Enfartados',
      cep: "40195745",
      bairro: 'Bairro Duro',
      taxa: 5
    }
  ]);
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