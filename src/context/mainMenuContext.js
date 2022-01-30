import React, { createContext, useContext, useEffect, useState } from 'react';

//SOURCE
import logoComp from "../images/logo-compressed-white.svg"
import logoNorm from "../images/logo-extended-white.svg"

//CONTEXT
import { useRotas } from '../context/rotasContext'

const MainMenuContext = createContext()

function MainMenuProvider(props) {
  const [ativo, setAtivo] = useState(false)
  const [logo, setLogo] = useState(logoComp)
  const {setCurrentRoute} = useRotas()

  const toggleAtivo = (e) => {
    if(e.type === 'touchend'){
      e.preventDefault()
    }
      setAtivo(!ativo)
      
  }

  function changeRoute(txt){
    setAtivo(false)
    setCurrentRoute(txt)
}

  useEffect(() => {
    if(ativo === true){setLogo(logoNorm)}
      else{setLogo(logoComp)}
  }, [ativo])

  return (
    <MainMenuContext.Provider value={{ativo, setAtivo, logo, setLogo, toggleAtivo, changeRoute}}>
        {props.children}
    </MainMenuContext.Provider>
  )
}

export default MainMenuProvider;

export const useMainMenu = () => {
    return useContext(MainMenuContext)
} 