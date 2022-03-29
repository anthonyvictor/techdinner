import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '../api';

const PizzasContext = createContext()

function PizzasProvider({children}) {
    const [tipos, setTipos] = useState([])
    const [ingredientes, setIngredientes] = useState([])
    const [sabores, setSabores] = useState([])
    const [tamanhos, setTamanhos] = useState([])
    const [valores, setValores] = useState([])
    const [bordas, setBordas] = useState([])
    const [atualizar, setAtualizar] = useState(0)
    const {api} = useApi()

    useEffect(() => {            
        let montado = true
        console.log('pizzas')
        async function getAll(){

            const response = await api().get('pizzas')

            if(montado) {
                setTipos(response.data.tipos)
                setIngredientes(response.data.ingredientes)
                setSabores(response.data.sabores)
                setTamanhos(response.data.tamanhos)
                setValores(response.data.valores)
                setBordas(response.data.bordas)
            }
        }   
        getAll()
        return () => {montado = false}
    },[atualizar, ]) 


    function refresh(){
        setAtualizar(prev => prev + 1)
    }

  return (
      <PizzasContext.Provider value={{
          sabores, setSabores,
          tamanhos, setTamanhos,
          ingredientes, setIngredientes,
          tipos, setTipos,
          valores, setValores,
          bordas, setBordas,
          refresh
        }}>
            {children}
        </PizzasContext.Provider>
  )
}

export default PizzasProvider;

export const usePizzas = () => {
    return useContext(PizzasContext)
}