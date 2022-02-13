import React from "react";

//VIEWS
import ELList from "./endlocLista";
import ELCad from "./endlocCad";
import Bairros from "./bairros";

//CONTEXT
import CadEnderecoProvider from "../../../context/cadEnderecosContext";
import TabControlProvider from "../../../context/tabControlContext";

//COMPONENTS
import { TabControl } from "../../../components/TabControl";
import EnderecosProvider from "../../../context/enderecosContext";

function Enderecos(props) {
  const tabs = [
    { link: "/cad/endloc/lista", titulo: "E/L Lista", elemento: <ELList /> },
    { link: "/cad/endloc/cad", titulo: "E/L Cadastro", elemento: <ELCad /> },
    { link: "/cad/endloc/bairros", titulo: "Bairros", elemento: <Bairros /> },
  ];

  return (
    <TabControlProvider tabs={tabs} tabInicial={props.tabInicial}>
        <EnderecosProvider>
            <CadEnderecoProvider>
              <TabControl />
            </CadEnderecoProvider>
        </EnderecosProvider>
    </TabControlProvider>
  );
}

export default Enderecos;
