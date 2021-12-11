import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Estilo from "./style";
import PedidoProvider from "../../context/pedidos";
import Lista from "./lista";
import Rodape from "./rodape";

const Home = () => {
  return (
    <PedidoProvider>
      <Estilo>
        <button className="float-button">+</button>
        <div className="lista">
          <div className="topo">
            <span>
              <button className="botao-novo">Novo pedido</button>
              <button className="botao-opcoes">
                <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
              </button>
            </span>
            <select>
              <option selected>Todos</option>
              <option>Caixa</option>
              <option>Entrega</option>
              <option>Aplicativo</option>
              <option>Arquivados</option>
            </select>
          </div>
          <div className="meio">
            <Lista />
          </div>
          <div className="rodape">
            <Rodape />
          </div>
        </div>
        <div className="pedidos"></div>
      </Estilo>
    </PedidoProvider>
  );
};

export default Home;
