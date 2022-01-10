import React from "react";
import Estilo from "./style";
import PedidoProvider from "../../context/pedidos";
import Lista from "./lista";
import Rodape from "./rodape";
import Topo from "./topo";
import FloatButton from "../../components/FloatButton";
import { isConnected } from "../../util/misc";

const Home = () => {
  return (
    <PedidoProvider>
      <Estilo>
        <FloatButton/>
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
