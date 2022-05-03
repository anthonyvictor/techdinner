import React, { createContext, useContext, useState } from 'react';
import styled from "styled-components";

//CONTEXT
import ClientesProvider from "../../../context/clientesContext";

//COMPONENTS
import { TabControl, useTabControl } from "../../../components/TabControl";
import { ListaCli } from "./lista";
import { CadastroCli } from "./cadastro";

import { isNEU, joinObj } from '../../../util/misc';
import { cores } from '../../../util/cores';

export default function Clientes({defaultCliente, callback}){
  //{defaultCliente, tabs, defaultTab, callback, children}
  const tabs = 
  [
    {title: 'Lista', component: <ListaCli />}, 
    {title: 'Cadastro', component: <CadastroCli />}
  ]
  
  return (
    <Container>
      <ClientesProvider>
        <TabControl tabs={tabs} index={defaultCliente ? 1 : 0} >
          <Clientes2 defaultCliente={defaultCliente} callback={callback} />
        </TabControl>
      </ClientesProvider>
    </Container>
  );
}


const CadListaClientesContext = createContext()

function Clientes2({defaultCliente, callback}) {

  const [currentCliente, setCurrentCliente] = useState(defaultCliente)
  const {currentTab, setCurrentTab, tabs} = useTabControl()
  const [contato, setContato] = useState('')
  const [tag, setTag] = useState('')

  function getTab(title){
    return tabs.find(e => e.title.toLowerCase() === title.toLowerCase())
  }
  
  function gotoTab(tab){
    setCurrentTab(getTab(tab))
  }

  function clearForm(confirm) {
    const res = !confirm || window.confirm("Limpar formulário?")
    if(res) {
      setCurrentCliente(null)
    }
  }

  function select(cliente) {
    if (callback) {
        callback(cliente)
    } else if(currentTab?.title?.toLowerCase() === 'lista') {
      edit(cliente)
    } else if(currentTab?.title?.toLowerCase() === 'cadastro') {
      list()
    }
}
  
  function edit(cliente) {
    const isFormFilled = !isNEU(joinObj(currentCliente))
    if (
      (!isFormFilled) ||
      (currentCliente?.id === cliente.id) ||
      (isFormFilled && window.confirm("Deseja cancelar a edição atual?"))
      ){
      setCurrentCliente(cliente)
      gotoTab('cadastro')
    }
  }

  function list() {
    clearForm()
    gotoTab('lista')
  }


  return (
    <CadListaClientesContext.Provider value={{
      currentCliente, setCurrentCliente,
      clearForm, edit, list, select,
      callback, gotoTab,
      contato, setContato,
      tag, setTag
    }}>
      {currentTab.component}
      
    </CadListaClientesContext.Provider>
  )
}

export const useCadListaClientes = () => {
  return useContext(CadListaClientesContext)
}

const Container = styled.div`
    height: calc(100% - 50px);
    width: 100%;
    /* position: relative; */
    display: flex;
    flex-direction: column;
    background-color: ${cores.branco};
`
