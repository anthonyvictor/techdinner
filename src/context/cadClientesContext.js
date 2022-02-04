import React, { createContext, useContext, useState } from 'react';

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
  const [lista, setLista] = useState(<></>)
  const [curr, setCurr] = useState(props.cliente ?? Empty)

  function limpar(confirm) {
    const res = confirm && window.confirm("Limpar formulário?")
    if(res) {
      setCurr(Empty)
    }
  }

  return (
    <CadCliContext.Provider value={{
     curr, setCurr, limpar, lista, setLista
    }}>
      {props.children}
    </CadCliContext.Provider>
  )
}



export default CadCliProvider;


export const useCadCli = () => {
  return useContext(CadCliContext)
}