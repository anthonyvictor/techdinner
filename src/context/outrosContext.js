import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '../api';

const OutrosContext = createContext()

function OutrosProvider({children}) {
    const [outros, setOutros] = useState([])
    const [atualizar, setAtualizar] = useState(0)
    const {api} = useApi()

    
    useEffect(() => {         
        let montado = true
        async function getAll(){
            api().get('outros').then(r=>
                {if(montado) {
                    setOutros(r.data)
                }}
            )
        }   
        getAll()
        return () => {montado = false}
    },[atualizar, ]) 

    function refresh(){
        setAtualizar(prev => prev + 1)
    }

  return (
      <OutrosContext.Provider value={{
          outros, setOutros,
          refresh
          }} >
          {children}
      </OutrosContext.Provider>
  )
}

export default OutrosProvider;

export const useOutros = () => {
    return useContext(OutrosContext)
}