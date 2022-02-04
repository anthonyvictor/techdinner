import React, { useState } from "react";
import PedidosProvider from "../../context/pedidosContext";
import Lista from "./lista";
import Rodape from "./rodape";
import Topo from "./topo";
import HomeProvider, { useHome } from "../../context/homeContext";
import styled from "styled-components";
import * as cores from "../../util/cores";
import Pedido from "./pedido";
import ClientesProvider from "../../context/clientesContext";
import EnderecosProvider from "../../context/enderecosContext";

const Home = () => {
  return (
    <EnderecosProvider>
        <PedidosProvider>
          <HomeProvider>
            <HomeElement />
          </HomeProvider>
        </PedidosProvider>
    </EnderecosProvider>
  );
};

const HomeElement = () => {
  const { curr } = useHome();
  return (
    <Container curr={curr}>
      <div className="esquerda">
        <Topo />
        <Lista />
        <Rodape />
      </div>
      <div className="direita">
        <Pedido />
      </div>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  display: flex;
  background-color: whitesmoke;
  overflow: hidden;
  height: 100%;

  > .esquerda {
    width: 300px;
    border-right: 1px solid ${cores.cinzaDark};
    padding: 0 5px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  > .direita {
    width: 100%;
    flex-shrink: 2;
  }

  @media (max-width: 760px) {
    .esquerda {
      width: 100%;
      ${(props) => !props.curr} {
        display: none;
      }
    }

    .direita {
      ${(props) => !(props.curr === null)} {
        display: none;
      }
    }
  }
`;
