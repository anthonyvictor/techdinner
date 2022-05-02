import React from "react";
import styled from "styled-components";

//VIEWS
import {ListaCli} from "./lista";
import Cadastro from "./cadastro";

//CONTEXT
import ClientesProvider from "../../../context/clientesContext";
import CadCliProvider from "../../../context/cadClientesContext";
import TabControlProvider from "../../../context/tabControlContext";

//COMPONENTS
import { TabControl } from "../../../components/TabControl";

const Clientes = () => {
  const links = ['/cad/clientes/lista', '/cad/clientes/cad']
  const tabs = [
    { link: links[0], titulo: "Lista", elemento: <ListaCli tabs={links} /> },
    { link: links[1], titulo: "Cadastro", elemento: <Cadastro tabs={links} /> }
  ]
  return (
    <Container>
      <ClientesProvider>
        <CadCliProvider >
          <TabControlProvider tabs={tabs}>
            <TabControl />
          </TabControlProvider>
        </CadCliProvider>
      </ClientesProvider>
    </Container>
  );
};

export default Clientes;


const Container = styled.div`
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    background-color: white;
`
