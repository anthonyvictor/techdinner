import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faFilter } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { useClientes } from "../../../context/clientes";
import { Estilo } from "./listaStyle";
import * as format from "../../../util/Format";

export default function Lista() {

  const { clientes } = useClientes();
  return (
    <Estilo className="">
      <div className="pesquisa">
          <button className="bt-id">
            <input id="bt-id" type="checkbox" />
            <label htmlFor="bt-id"> Pelo iD</label>
          </button>

            <input type="text" placeholder="Procure um cliente..." autoFocus={true}></input>
            <button className="filtro">
              <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
            </button>
          </div>

      {clientes &&
        clientes.map((cliente) => (
          <li key={cliente.id}>
            <div className="container">
              <div className="img-id">
                {cliente.img && (<img src={cliente.img} />)}
                <label className="id">{cliente.id}</label>
              </div>
              <div className="info">
                <label className="nome">{cliente.nome}</label>
                <span className="contato">
                  , {cliente.contato.join(", ")}
                </span>
                <span className="tags">
                  {cliente.tags.map((tag) => (
                    <span>, {tag}</span>
                  ))}
                </span>

                <p className="endereco">{cliente.endereco}</p>

                <div className="bottom-info">
                  {cliente.pedidos > 0 ? (
                    <span>Pedidos: {cliente.pedidos}</span>
                  ) : (
                    <span>Nenhum pedido</span>
                  )}

                  {cliente.valorGasto > 0 && (
                    <span>{format.formatReal(cliente.valorGasto)}</span>
                  )}

                  {cliente.ultPedido && (
                    <span>Últ. pedido: {cliente.ultPedido}</span>
                  )}
                </div>
              </div>
              <button className="botao">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </div>
          </li>
        ))}
    </Estilo>
  );
}
