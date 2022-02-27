import React from "react";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useHome } from "../../context/homeContext";
import { usePedidos } from "../../context/pedidosContext";

export default function Topo(){
  const {setCurr} = useHome()
  const {arquivados} = usePedidos()
  const modoExibicao =  window.localStorage.getItem('exibicaoPedidos')
    return(
        <Estilo>
            <span>
              <button className="botao-novo" onClick={() => setCurr({id: 0})}>Novo pedido</button>
              <button className="botao-opcoes">
                <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
              </button>
            </span>
            <select defaultValue={{value: 'Todos', label: 'Todos'}}
            style={{
              display: (modoExibicao === 'all' ? 'block' : 'none')
              }}>
              <option >Todos</option>
              <option>Caixa</option>
              <option>Entrega</option>
              <option>Aplicativo</option>
              <option>Arquivados</option>
            </select>
            <button style={{
              display: ((arquivados.length > 0 && modoExibicao === 'all') ? 'block' : 'none')
            }}>Arquivados: {arquivados.length}</button>
          </Estilo>
    )
}

const Estilo = styled.div`
flex-shrink: 0;
      display: flex;
      flex-direction: column;
      width: 100%;
      /* height: 60px; */

      span {
        display: flex;
        padding: 3px 0;
        flex-grow: 2;
        gap: 5px;
        height: 50px;

        button {
          border: solid 1px;
          cursor: pointer;
        }

        .botao-novo {
          flex-grow: 2;
        }

        .botao-opcoes {
          width: 30px;
        }
      }

      select {
        width: 100%;
        display: block;
      }



      @media (max-width: 550px) {
        display: none;
  }

`