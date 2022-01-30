import React, {useState} from "react";
import PedidosProvider from "../../context/pedidosContext";
import Lista from "./lista";
import Rodape from "./rodape";
import Topo from "./topo";
import HomeProvider, { useHome } from "../../context/homeContext";
import styled from "styled-components";
import * as cores from "../../util/cores";
import Pedido from "./pedido";
import ClientesProvider from "../../context/clientesContext";

const Home =() => {
  return(
    <ClientesProvider>
      <PedidosProvider>
      <HomeProvider>
        <HomeElement />
      </HomeProvider>
    </PedidosProvider>
    </ClientesProvider>
  )
}

const HomeElement = () => {
  const {curr} = useHome()
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
  )
};

export default Home;

const Container = styled.div`
display: flex;
  background-color: whitesmoke;
  overflow: hidden;

 > .esquerda {
    width: 250px;
    border-right: 1px solid ${cores.cinzaDark};
    padding: 0 5px;
  }

  > .direita{ 
    width: 100% ;
    /* max-height: 92vh;//100%; //92vh */
  }

  @media (max-width: 760px){
    .esquerda{
      width: 100% ;
      ${(props) => !props.curr}{
        display: none;
      }
    }
  }
`;
