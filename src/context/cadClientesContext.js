import React, { createContext, useContext, useState } from 'react';
import { isNEU, joinObj } from '../util/misc';

const CadCliContext = createContext()

function CadCliProvider(props) {
  const Empty = {
    id: null, 
    nome: '',
        imagem: '',
        tags: [], 
        contato: [], 
        endereco: {
            logradouro: '',
            numero: '', 
            local: '',
            cep: "",
            bairro: "",
            taxa: null,
        },
        pedidos: null,
        ultPedido: '',
        valorGasto: null
  }
  const [lista, setLista] = useState(false)
  const [curr, setCurr] = useState(props.cliente ?? Empty)

  function limpar(confirm) {
    const res = confirm && window.confirm("Limpar formulário?")
    if(res) {
      setCurr(Empty)
    }
  }
  
  function editar(cliente) {
    let preenchido = !isNEU(joinObj(curr))
    const change = () => {props.changeTab ? props.changeTab() : setCurrentRoute(props.tabs[1])}
    if (curr && curr.id === cliente.id) {
      change()
    } else if ((preenchido && window.confirm("Deseja cancelar a edição atual?")) ||
      !preenchido) {
      setCurr(cliente)
      change()
    }
  }
  return (
    <CadCliContext.Provider value={{
     curr, setCurr, limpar, editar, lista, setLista, 
    }}>
      {props.children}
    </CadCliContext.Provider>
  )
}



export default CadCliProvider;

export const useCadCli = () => {
  return useContext(CadCliContext)
}