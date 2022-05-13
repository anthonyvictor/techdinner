import React, { createContext, useContext, useState, useEffect } from "react";
import { useApi } from "../api";
import { arrayer } from "../util/misc";

const EnderecosContext = createContext();

function EnderecosProvider(props) {
  const [enderecos, setEnderecos] = useState([])
  const [locais, setLocais] = useState([])
  const [bairros, setBairros] = useState([])
  const [atualizar, setAtualizar] = useState(0)
  const {api} = useApi()

  useEffect(() => {            
    let montado = true
    async function getAll(){
        api().get('enderecos').then(r=>
            {if(montado) {
              setBairros(arrayer(r.data.bairros))
              setEnderecos(arrayer(r.data.enderecos))
              setLocais(arrayer(r.data.locais))
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