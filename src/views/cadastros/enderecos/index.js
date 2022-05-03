import React, { createContext, useContext, useState } from "react";

//VIEWS
import ELList from "./endlocLista";
import ELCad from "./endlocCad";
import Bairros from "./bairros";

//COMPONENTS
import { TabControl, useTabControl } from "../../../components/TabControl";
import EnderecosProvider from "../../../context/enderecosContext";


export default function Enderecos({tabs, callback}) {
  const newTabs = tabs ?? [
    { title: "E/L Lista", component: <ELList /> },
    { title: "E/L Cadastro", component: <ELCad /> },
    { title: "Bairros", component: <Bairros /> },
  ];

  return (
        <EnderecosProvider>
              <TabControl tabs={newTabs} index={0}>
                <Enderecos2 callback={callback} />
              </TabControl>
        </EnderecosProvider>
  );
}

const CadEnderecoContext = createContext(null);

function Enderecos2({callback}) {
  const [currEL, setCurrEL] = useState(getDefaultEL());
  const [tiposEL] = useState(["Endereço", "Local"]);
  const [currBai, setCurrBai] = useState(getDefaultBai())
  const [tipoEL, setTipoEL] = useState(tiposEL[0]);

  const {currentTab} = useTabControl() 

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
        limparBai, callback
      }}
    >
      {currentTab.component}
    </CadEnderecoContext.Provider>
  );
}

export const useCadEndereco = () => {
  return useContext(CadEnderecoContext);
};
