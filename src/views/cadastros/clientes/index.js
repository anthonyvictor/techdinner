import React from "react";
import styled from "styled-components";

//VIEWS
import Lista from "./lista";
import Cadastro from "./cadastro";

//CONTEXT
import ClientesProvider from "../../../context/clientesContext";
import CadCliProvider from "../../../context/cadClientesContext";
import TabControlProvider from "../../../context/tabControlContext";

//COMPONENTS
import { TabControl } from "../../../components/TabControl";

const Clientes = () => {
  const tabs = [
    { link: '/cad/cli/lista', titulo: "Lista", elemento: <Lista /> },
    { link: '/cad/cli/cad', titulo: "Cadastro", elemento: <Cadastro /> }
  ];

  return (
    <Container>
      <ClientesProvider>
        <CadCliProvider>
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
