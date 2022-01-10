import React, { useEffect, useState } from "react";
import reactDom from "react-dom";
import ClientesProvider from "../../../context/clientes";
import Lista from "./lista";
import Cadastro from "./cadastro";
import { Estilo } from "./style";
import FloatButton from "../../../components/FloatButton";


const Clientes = (tabInicial) => {
  const [tab, setTab] = useState(tabInicial)
  function tabClick(e){
    let tgt = e.target
    if(tgt.innerText === '+'){
      setTab('Cadastro')
      tgt.innerText = '<'
    }else if(tgt.innerText === '<'){
      setTab('Lista')
      tgt.innerText = '+'
    }else if(tgt.classList.contains('ativo') === false){    
        for(let bt of tgt.parentElement.children){

          let igual = bt.innerHTML === tgt.innerHTML
    
          if (!(igual)) {
            bt.classList.remove('ativo')
          }
          tgt.classList.add('ativo')
          setTab(tgt.innerHTML)
        }
      }
    }

  const [tabContent, setTabContent] = useState(switchTab())

  function switchTab(){
    const tabb =  tab.toString().toUpperCase()
     switch(tabb){
       case 'LISTA': 
         return (<Lista />)
       case 'CADASTRO':
         return (<Cadastro />)
       default:
         return (<Lista />)
     }
  }

useEffect(() => {
   setTabContent(switchTab())
  },[tab])

  return (
    <Estilo>
      <ClientesProvider>
        <div className="tab">
          <button onClick={e => {tabClick(e)}}>Lista</button>
          <button onClick={e => {tabClick(e)}}>Cadastro</button>
        </div>
        <FloatButton clique={tabClick} />
        {
          tabContent
        }
      </ClientesProvider>
    </Estilo>
  );
};

export default Clientes;
