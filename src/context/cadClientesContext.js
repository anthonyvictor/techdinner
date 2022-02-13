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
  const [lista, setLista] = useState(false)
  const [curr, setCurr] = useState(props.cliente ?? Empty)
  const [images, setImages] = useState([])
  const [imagem, setImagem] = useState(null)

  function limpar(confirm) {
    const res = confirm && window.confirm("Limpar formulário?")
    if(res) {
      setCurr(Empty)
    }
  }

  return (
    <CadCliContext.Provider value={{
     curr, setCurr, limpar, lista, setLista, 
     images, setImages, imagem, setImagem
    }}>
      {props.children}
    </CadCliContext.Provider>
  )
}



export default CadCliProvider;


export const useCadCli = () => {
  return useContext(CadCliContext)
}