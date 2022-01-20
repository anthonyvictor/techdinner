import React from "react";
import Estilo from "./style";
import PedidoProvider from "../../context/pedidosContext";
import Lista from "./lista";
import Rodape from "./rodape";
import Topo from "./topo";
import FloatButton from "../../components/FloatButton";

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
