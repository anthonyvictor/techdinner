import React, { createContext, useContext, useState, useEffect } from "react";
import { useApi } from "../api";

const EntregadoresContext = createContext();

function EntregadoresProvider(props) {
  const [entregadores, setEntregadores] = useState([])
  const {api} = useApi()

  useEffect(() => {            
    let montado = true
    async function getAll(){
        api().get('entregadores').then(r=>
            {if(montado) {
              setEntregadores(r.data)
            } }
        )
    }   
    getAll()
    return () => {montado = false}
},[])     

  return (
    <EntregadoresContext.Provider value={{ 
      entregadores, setEntregadores,
    }}>
      {props.children}
    </EntregadoresContext.Provider>
  );
}

export default EntregadoresProvider;

export const useEntregadores = () => {
    return useContext(EntregadoresContext)
}