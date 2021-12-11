import React from "react";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Estilo } from "./topoStyle";

export default function Topo(){
    return(
        <Estilo>
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
          </Estilo>
    )
}