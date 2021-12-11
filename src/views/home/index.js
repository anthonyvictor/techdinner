import React from "react";
import Estilo from "./style";
import PedidoProvider from "../../context/pedidos";
import Lista from "./lista";
import Rodape from "./rodape";
import Topo from "./topo";

const Home = () => {
  return (
    <PedidoProvider>
      <Estilo>
        <button className="float-button">+</button>
        <div className="esquerda">
        <Topo />
        <Lista />
        <Rodape />
        </div>
        <div className="direita">

        </div>
      </Estilo>
    </PedidoProvider>
  );
};

export default Home;
