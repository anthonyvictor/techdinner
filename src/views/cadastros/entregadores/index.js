import React, { createContext, useContext, useState } from "react";
import EntregadoresProvider from '../../../context/entregadoresContext';
import {Lista} from './lista';
import {Cadastro} from './cadastro';

const CadEntregadoresContext = createContext();

function CadEntregadoresProvider(props) {
  const [curr, setCurr] = useState(null)  

  return (
    <CadEntregadoresContext.Provider value={{ 
      curr, setCurr,
    }}>
      {props.children}
    </CadEntregadoresContext.Provider>
  );
}

export const useCadEntregadores = () => {
    return useContext(CadEntregadoresContext)
}

function Entregadores(){
    return (
        <EntregadoresProvider>
            <CadEntregadoresProvider>
                <Cadastro />
                <Lista />
            </CadEntregadoresProvider>
        </EntregadoresProvider>
    )
}

export default Entregadores;