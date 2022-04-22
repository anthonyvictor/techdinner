import React, {useEffect, useCallback, createContext, useContext} from 'react';
import BebidasProvider from '../../../../context/bebidasContext';
import { useHome } from '../../../../context/homeContext';
import OutrosProvider from '../../../../context/outrosContext';
import PizzasProvider from '../../../../context/pizzasContext';

import Bebida from './bebida';
import Outro from './outro';
import Pizza from './pizza';
import Recente from './recente';

const ItensContext = createContext()

export const Itens = ({item, callback}) => {

  return (
    <ItensContext.Provider value={{
      item,
      callback,
    }}>
      <Itens2 />
    </ItensContext.Provider>
  )
}

export const useItens = () => {
  return useContext(ItensContext)
}

const Itens2 = () => {

  const {item} = useItens()
  const {closeSelectBox} = useHome()

  useEffect(() => {
    addKeyPressEventHandler()
    return () => {
      removeKeyPressEventHandler()
    }
  }, []) //eslint-disable-line

    const addKeyPressEventHandler = useCallback(() => {
        document.addEventListener('keyup', onPressValidator)
    }, [])
    const removeKeyPressEventHandler = useCallback(() => {
            document.removeEventListener('keyup', onPressValidator)
    }, [])

    function askForExit(){
      if(window.confirm('Deseja realmente cancelar a adição/edição deste item?')){
        closeSelectBox()
       }
    }

  const onPressValidator = useCallback(event => {
      if (event.key === 'Escape') {
         askForExit()
      }
  }, [])

  switch(item.tipo){
    case 0:
     return <PizzasProvider>
       <Pizza />
     </PizzasProvider>

    case 1:
     return <BebidasProvider>
       <Bebida />
     </BebidasProvider>

    case 2:
      //hamburguer
      return (
        <></>
       )

    case 3:
      return <OutrosProvider>
        <Outro />  
      </OutrosProvider>

    case 4:
      //promocao
      return (
        <></>
       )

    case 5:
      return (
        <Recente />
      )
    
    default:
      return (
       <></>
      )
  }
}


