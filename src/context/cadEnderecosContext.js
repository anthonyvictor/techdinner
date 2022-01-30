import React, { createContext, useContext, useState } from "react";

const CadEnderecoContext = createContext(null);

export default function CadEnderecoProvider(props) {
  const [currEL, setCurrEL] = useState(getDefaultEL());
  const [tiposEL] = useState(["Endereço", "Local"]);
  const [tipoEL, setTipoEL] = useState(tiposEL[0]);

  function getDefaultEL() {
    return {
      id: "",
      cep: "",
      logradouro: "",
      bairro: "",
      local: "",
      numero: "",
    };
  };

  function limparEL(confirm) {
    const res = confirm && window.confirm("Limpar formulário?");
    if (res) {
        setTipoEL(tiposEL[0])
        setCurrEL(getDefaultEL());
    }
  }


  const [currBai, setCurrBai] = useState(getDefaultBai())


  function getDefaultBai(){
      return{
          nome: '',
          taxa: ''
      }
  }

  function limparBai(confirm) {
    const res = confirm && window.confirm("Limpar formulário?");
    if (res) {
        setCurrBai(getDefaultBai());
    }
  }

  return (
    <CadEnderecoContext.Provider
      value={{
        currEL, setCurrEL,
        limparEL,
        tiposEL,
        tipoEL, setTipoEL, 
        currBai, setCurrBai,
        limparBai
      }}
    >
      {props.children}
    </CadEnderecoContext.Provider>
  );
}

export const useCadEndereco = () => {
  return useContext(CadEnderecoContext);
};
