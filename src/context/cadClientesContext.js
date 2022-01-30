import React, { createContext, useContext, useState } from 'react';

const CadCliContext = createContext()

function CadCliProvider({ children }) {
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
  const [curr, setCurr] = useState(Empty)

  
  // const [id, setId] = useState(0)

  // const [imagem, setImagem] = useState("");
  // const [nome, setNome] = useState("")

  // //Valor dos input
  // const [contato, setContato] = useState("")
  // const [tag, setTag] = useState("")

  // //Arrays de tags
  // const [tags, setTags] = useState([])
  // const [contatos, setContatos] = useState([])

  // const [endereco, setEndereco] = useState({})

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
      {children}
    </CadCliContext.Provider>
  )
}



export default CadCliProvider;


export const useCadCli = () => {
  return useContext(CadCliContext)
}