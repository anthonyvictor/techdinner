import React, { useEffect, useState } from "react";
import ClientesProvider from "../../../context/clientes";
import Lista from "./lista";
import Cadastro from "./cadastro";
import { Estilo } from "./style";
import FloatButton from "../../../components/FloatButton";


const Clientes = (props) => {
  var tab = props.tabInicial

  useEffect(() => {switchTab()}, [])
  function tabClick(e){
    let tgt = e.target
    if(tgt.innerText === '+'){
      tab = 'Cadastro'
      tgt.innerText = '<'
    }else if(tgt.innerText === '<'){
      tab = 'Lista'
      tgt.innerText = '+'
    }else if(tgt.classList.contains('ativo') === false){    
        for(let bt of tgt.parentElement.children){

          let igual = bt.innerHTML === tgt.innerHTML
    
          if (!(igual)) {
            bt.classList.remove('ativo')
          }
          tgt.classList.add('ativo')
          tab = tgt.innerHTML
        }
      }
    }

  const [tabContent, setTabContent] = useState(<></>)

  function switchTab(){
    const tabb =  tab.toUpperCase()
     switch(tabb){
       case 'LISTA': 
         setTabContent(<Lista />)
         break
       case 'CADASTRO':
         setTabContent(<Cadastro />)
         break
       default:
         setTabContent(<Lista />)
         break
     }
  }

  return (
    <Estilo>
      <ClientesProvider>
        <div className="tab">
          <button onClick={e => {tabClick(e)}}>Lista</button>
          <button onClick={e => {tabClick(e)}}>Cadastro</button>
        </div>
        <FloatButton clique={tabClick} />

        {tabContent}

      </ClientesProvider>
    </Estilo>
  );
};

export default Clientes;
