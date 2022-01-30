import React, { createContext, useContext, useState } from "react";

const BairrosContext = createContext();

function BairrosProvider(props) {
  const [bairros, setBairros] = useState([
    {id: 1, nome: 'Ondina', taxa: 5},
    {id: 2, nome: 'Brejo', taxa: 4.5},
    {id: 3, nome: 'Rio Vermelho', taxa: 6},
    {id: 4, nome: 'Pituba', taxa: 8},
    {id: 5, nome: 'Barra', taxa: 8},
  ]);
  return (
    <BairrosContext.Provider value={{ bairros, setBairros }}>
      {props.children}
    </BairrosContext.Provider>
  );
}

export default BairrosProvider;

export const useBairros = () => {
    return useContext(BairrosContext)
}