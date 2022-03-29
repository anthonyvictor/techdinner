import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '../api';

const BebidasContext = createContext()
function BebidasProvider({children}) {
    const [bebidas, setBebidas] = useState([])
    const [atualizar, setAtualizar] = useState(0)
    const {api} = useApi()

    useEffect(() => {            
        let montado = true
        console.log('bebidas')
        async function getAll(){
            api().get('bebidas').then(r=>
                {if(montado) {
                    setBebidas(r.data.map(e => {return{
                        ...e, 
                        tamanho: (e.tamanho < 80 ? e.tamanho * 1000 : e.tamanho)
                    }}))
                } }
            )
        }   
        getAll()
        return () => {montado = false}
    },[atualizar, ]) 

    function refresh(){
        setAtualizar(prev => prev + 1)
    }

  return (
      <BebidasContext.Provider value={{
          bebidas, setBebidas,
          refresh,
      }} >
          {children}
      </BebidasContext.Provider>
  )
}

export default BebidasProvider;

export const useBebidas = () => {
    return useContext(BebidasContext)
}