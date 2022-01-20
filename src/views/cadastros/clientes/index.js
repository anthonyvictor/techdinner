import React, { useEffect, useRef, useState } from "react";
import ClientesProvider from "../../../context/clientesContext";
import Lista from "./lista";
import Cadastro from "./cadastro";
import { Estilo } from "./style";
import TabControl from "../../../components/TabControl";
import CadCliProvider from "../../../context/cadClientesContext";
import TabControlProvider from "../../../context/tabControlContext";

const Clientes = (props) => {
  const tabs = [
    { titulo: "Lista", elemento: <Lista /> },
    { titulo: "Cadastro", elemento: <Cadastro /> }
  ];

  return (
    <Estilo>
      <ClientesProvider>
        <CadCliProvider>
          <TabControlProvider tabs={tabs} tabInicial={props.tabInicial}>
            <TabControl />
          </TabControlProvider>
        </CadCliProvider>
      </ClientesProvider>
    </Estilo>
  );
};

export default Clientes;
