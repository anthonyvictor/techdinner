import React, { createContext, useContext, useState, useEffect } from 'react';
import Axios from "axios";

const BebidasContext = createContext()
function BebidasProvider({children}) {
    const [bebidas, setBebidas] = useState([])
    const [atualizar, setAtualizar] = useState(0)

    useEffect(() => {            
        let montado = true
        console.log('bebidas')
        async function getAll(){
            Axios.get(`${process.env.REACT_APP_API_URL}/bebidas`).then(r=>
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

  return (
      <BebidasContext.Provider value={{
          bebidas, setBebidas,
          atualizar, setAtualizar
      }} >
          {children}
      </BebidasContext.Provider>
  )
}

export default BebidasProvider;

export const useBebidas = () => {
    return useContext(BebidasContext)
}