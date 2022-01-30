import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRotas } from './rotasContext';

const HomeContext = createContext()

function HomeProvider(props) {
    const [curr, setCurr] = useState(null)
    const [tabs, setTabs] = useState([])
    const {setCurrentRoute} = useRotas()

    useEffect(() => {
        // console.log('VERIFICA SE JÁ TEM ALGUMA TAB COM O CLICADO SE N TIVER ELE ADICIONA',curr)
        if(curr){
            if(tabs.length === 0 || !tabs.some(e => e.id === curr.id)){
                //se n tiver tabs ou se nenhuma tab for a current
                setTabs(prev => [...prev, curr]) //adiciona a current nas tabs
            }
            setCurrentRoute('/pedido/' + curr.id)
        }else{
            setCurrentRoute('/home')
        }
    }, [curr])

    function fechar(tab){
        if(curr && curr.id === tab.id){
            if(tabs.length >= 2){
                setCurr(prev => tabs[tabs.map(e => e.id).indexOf(prev.id) - 1])
            }else{
                setCurr(null)
            }
            
        }
        setTabs(prev => prev.filter(e => e.id !== tab.id))
    }

  return (
      <HomeContext.Provider value={{
          curr, setCurr,
          tabs, setTabs,
          showLista: props.showLista, setShowLista: props.setShowLista,
          fechar
      }}>
          {props.children}
      </HomeContext.Provider>
  )
}

export default HomeProvider;

export const useHome = () => {
    return useContext(HomeContext)
}