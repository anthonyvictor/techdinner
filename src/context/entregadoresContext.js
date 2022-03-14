import React, { createContext, useContext, useState, useEffect } from "react";
import Axios from "axios";

const EntregadoresContext = createContext();

function EntregadoresProvider(props) {
  const [entregadores, setEntregadores] = useState([])

  useEffect(() => {            
    let montado = true
    console.log('entregadores')
    async function getAll(){
        Axios.get(`${process.env.REACT_APP_API_URL}/entregadores`).then(r=>
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