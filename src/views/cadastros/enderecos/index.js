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
  const [currentEndereco, setCurrentEndereco] = useState(getDefaultEL());
  const [tiposEndereco] = useState(["Endereço", "Local"]);
  const [currBai, setCurrBai] = useState(getDefaultBai())
  const [tipoEndereco, setTipoEndereco] = useState(tiposEndereco[0]);

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
        setTipoEndereco(tiposEndereco[0])
        setCurrentEndereco(getDefaultEL());
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
        currentEndereco, setCurrentEndereco,
        limparEL,
        tiposEndereco,
        tipoEndereco, setTipoEndereco, 
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
