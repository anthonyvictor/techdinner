import React, { createContext, useContext, useState } from 'react';
import { TabControl, useTabControl } from '../../../components/TabControl';

import PizzasProvider from '../../../context/pizzasContext';

import Ingredientes from './ingredientes';
import Sabores from './sabores';
import Tamanhos from './tamanhos';
import Bordas from './bordas';


export default function Pizzas() {
    const tabs = [
        { title: "Sabores", component: <Sabores /> },
        { title: "Tamanhos", component: <Tamanhos /> },
        { title: "Ingredientes", component: <Ingredientes /> },
        { title: "Bordas", component: <Bordas /> },
      ];
  return (
        <PizzasProvider>
              <TabControl tabs={tabs}>
                <Pizzas2 />

              </TabControl>
        </PizzasProvider>
  )
}


const CadPizzasContext = createContext()

function Pizzas2() {
    const [searchSab, setSearchSab] = useState('')
    const [listaSab, setListaSab] = useState(<></>)
    const [currSab, setCurrSab] = useState(null)

    const [searchIngr, setSearchIngr] = useState('')
    const [listaIngr, setListaIngr] = useState(null)
    const [currIngr, setCurrIngr] = useState(null)

    const [searchTam, setSearchTam] = useState('')
    const [listaTam, setListaTam] = useState(null)
    const [currTam, setCurrTam] = useState(null)

    const {currentTab} = useTabControl()
    
    return (
        <CadPizzasContext.Provider value={{
            searchSab, setSearchSab,
            listaSab, setListaSab,
            currSab, setCurrSab,

            searchIngr, setSearchIngr,
            listaIngr, setListaIngr,
            currIngr, setCurrIngr,

            searchTam, setSearchTam,
            listaTam, setListaTam,
            currTam, setCurrTam
        }}>
            {currentTab.component}
        </CadPizzasContext.Provider>
    )
}

export const useCadPizzas = () => {
    return useContext(CadPizzasContext)
} 

