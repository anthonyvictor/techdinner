import React, { createContext, useContext, useState, useEffect } from "react";
import Axios from "axios";

const EnderecosContext = createContext();

function EnderecosProvider(props) {
  const [enderecos, setEnderecos] = useState([])
  const [locais, setLocais] = useState([])
  const [bairros, setBairros] = useState([])
  const [atualizar, setAtualizar] = useState(0)

  useEffect(() => {            
    let montado = true
    async function getAll(){
        Axios.get(`${process.env.REACT_APP_API_URL}/enderecos`).then(r=>
            {if(montado) {
              setBairros(r.data.bairros)
              setEnderecos(r.data.enderecos)
              setLocais(r.data.locais)
            } }
        )
    }   
    getAll()
    return () => {montado = false}
},[atualizar, ])     

const refresh = () => {
    setAtualizar(prev => prev + 1)
}

  return (
    <EnderecosContext.Provider value={{ 
      enderecos, setEnderecos,
      locais, setLocais,
      bairros, setBairros, refresh
    
    }}>
      {props.children}
    </EnderecosContext.Provider>
  );
}

export default EnderecosProvider;

export const useEnderecos = () => {
    return useContext(EnderecosContext)
}