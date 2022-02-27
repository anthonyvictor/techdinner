import React, { createContext, useContext, useState, useEffect } from 'react';
import Axios from "axios";

const PizzasContext = createContext()

function PizzasProvider({children}) {
    const [tipos, setTipos] = useState([])
    const [ingredientes, setIngredientes] = useState([])
    const [sabores, setSabores] = useState([])
    const [tamanhos, setTamanhos] = useState([])
    const [valores, setValores] = useState([])
    const [bordas, setBordas] = useState([])
    const [atualizar, setAtualizar] = useState(0)

    useEffect(() => {            
        let montado = true
        console.log('pizzas')
        async function getAll(){
            Axios.get(`${process.env.REACT_APP_API_URL}/pizzas`).then(r=>
                {if(montado) {
                    setTipos(r.data.tipos)
                    setIngredientes(r.data.ingredientes)
                    setSabores(r.data.sabores)
                    setTamanhos(r.data.tamanhos)
                    setValores(r.data.valores)
                    setBordas(r.data.bordas)
                } }
            )
        }   
        getAll()
        return () => {montado = false}
    },[atualizar, ]) 

  return (
      <PizzasContext.Provider value={{
          sabores, setSabores,
          tamanhos, setTamanhos,
          ingredientes, setIngredientes,
          tipos, setTipos,
          valores, setValores,
          bordas, setBordas,
          atualizar, setAtualizar
        }}>
            {children}
        </PizzasContext.Provider>
  )
}

export default PizzasProvider;

export const usePizzas = () => {
    return useContext(PizzasContext)
}