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


  const links = ["/cad/endloc/lista", "/cad/endloc/cad", "/cad/endloc/bairros"]
  const tabs = [
    { link: links[0], titulo: "E/L Lista", elemento: <ELList tabs={links} /> },
    { link: links[1], titulo: "E/L Cadastro", elemento: <ELCad /> },
    { link: links[2], titulo: "Bairros", elemento: <Bairros /> },
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
