import React, { createContext, useContext, useState, useEffect } from 'react';
import Axios from "axios";

const OutrosContext = createContext()

function OutrosProvider({children}) {
    const [outros, setOutros] = useState([])
    const [atualizar, setAtualizar] = useState(0)
    console.log('outros')

    useEffect(() => {            
        let montado = true
        async function getAll(){
            Axios.get(`${process.env.REACT_APP_API_URL}/outros`).then(r=>
                {if(montado) {
                    setOutros(r.data)
                }}
            )
        }   
        getAll()
        return () => {montado = false}
    },[atualizar, ]) 

  return (
      <OutrosContext.Provider value={{
          outros, setOutros,
          atualizar, setAtualizar}} >
          {children}
      </OutrosContext.Provider>
  )
}

export default OutrosProvider;

export const useOutros = () => {
    return useContext(OutrosContext)
}