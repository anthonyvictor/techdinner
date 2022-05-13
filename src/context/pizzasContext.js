import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '../api';
import { arrayer } from '../util/misc';

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
        async function getAll(){

            const response = await api().get('pizzas')

            if(montado) {
                setTipos(arrayer( response.data.tipos))
                setIngredientes(arrayer(response.data.ingredientes))
                setSabores(arrayer(response.data.sabores))
                setTamanhos(arrayer(response.data.tamanhos))
                setValores(arrayer(response.data.valores))
                setBordas(arrayer(response.data.bordas))
            }
        }   
        getAll()
        return () => {montado = false}
    },[atualizar, ]) 


    function refresh(){
        setAtualizar(prev => prev + 1)
    }
    async function refreshTamanhos(){
        const response = await api().get('pizzas/tamanhos')
        setTamanhos(arrayer(response.data))
        refreshValores()
        refreshBordas()
    }
    async function refreshSabores(){
        const response = await api().get('pizzas/sabores')
        setSabores(arrayer(response.data))
        refreshValores()
    }
    async function refreshIngredientes(){
        const response = await api().get('pizzas/ingredientes')
        setIngredientes(arrayer(response.data))
    }
    async function refreshValores(){
        const response = await api().get('pizzas/valores')
        setValores(arrayer(response.data))
    }
    async function refreshBordas(){
        const response = await api().get('pizzas/bordas')
        setBordas(arrayer(response.data))
    }

  return (
      <PizzasContext.Provider value={{
          sabores, setSabores,
          tamanhos, setTamanhos,
          ingredientes, setIngredientes,
          tipos, setTipos,
          valores, setValores,
          bordas, setBordas,
          refresh, refreshTamanhos,
          refreshSabores, refreshIngredientes,
        }}>
            {children}
        </PizzasContext.Provider>
  )
}

export default PizzasProvider;

export const usePizzas = () => {
    return useContext(PizzasContext)
}