import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Rotas from "./Rotas";
import Menu from "./components/menu";
import Header from "./components/header";
import Estilo from "./StyledBase";
import logoComp from "./images/logo-compressed-white.svg"
import logoNorm from"./images/logo-extended-white.svg"

export default function Base() {
  const [ativo, setAtivo] = useState(false)
  const [logo, setLogo] = useState(logoComp)

  const toggleAtivo = (e) => {
    e.preventDefault()
      setAtivo(!ativo)
      if(ativo === true){setLogo(logoComp)}
      else{setLogo(logoNorm)}
  }

        const [rotaPrinc, setrotaPrinc] = useState('/')

        function openMenu(e){
          setAtivo(false)
          setLogo(logoComp)
          setrotaPrinc('/' + e.target.getAttribute('name'))
      }

  return (
    <Estilo>
      <Menu openMenu={openMenu} logo={logo} ativo={ativo} toggleAtivo={toggleAtivo} className="sidebar invisivel" />
      <div className="TopoBase">
        <Header toggleAtivo={toggleAtivo} />
        <BrowserRouter className="meio">
          <Rotas rotaPrinc={rotaPrinc} />
      </BrowserRouter>
      </div>
    </Estilo>
  );
};
