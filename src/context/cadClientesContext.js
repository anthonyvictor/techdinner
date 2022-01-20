import React, { createContext, useContext, useState } from 'react';

const CadCliContext = createContext()

function CadCliProvider({ children }) {

  const [id, setId] = useState(0)

  const [imagem, setImagem] = useState(
    "https://exame.com/wp-content/uploads/2016/09/size_960_16_9_zuckerberg-sorriso-460-jpg.jpg"
  );
  const [nome, setNome] = useState("João Goularte")

  //Valor dos input
  const [contato, setContato] = useState("")
  const [tag, setTag] = useState("")

  //Arrays de tags
  const [tags, setTags] = useState(["Paulinha Abelha"])
  const [contatos, setContatos] = useState(["988554455", "988885555"])

  const [endereco, setEndereco] = useState({
    logradouro: "Ladeira do Jardim Zoológico Ladeira do Jardim Zoológico",
    local: "Pizzaria Delicia da Bahia",
    numero: 427,
    cep: "40170720",
    bairro: "Ondina",
    referencia: "Na pracinha do Zoológico, prox. a igreja Maanaim",
    taxa: 2,
  })

  function limpar(confirm) {
    const res = confirm && window.confirm("Limpar formulário?")
    if(res) {
      setId('')
      setImagem('');
      setNome("");
      setContato("");
      setTag("");
      setTags([]);
      setContatos([]);
      setEndereco({});
    }
  }

  return (
    <CadCliContext.Provider value={{
      id, setId,
      imagem, setImagem,
      nome, setNome,
      contato, setContato,
      tag, setTag,
      contatos, setContatos,
      tags, setTags,
      endereco, setEndereco,
      limpar
    }}>
      {children}
    </CadCliContext.Provider>
  )
}



export default CadCliProvider;


export const useCadCli = () => {
  return useContext(CadCliContext)
}