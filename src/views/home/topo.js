import React, { useState } from "react";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useHome } from "../../context/homeContext";
import { usePedidos } from "../../context/pedidosContext";
import * as cores from '../../util/cores'

export default function Topo(){
  const {novoPedido, filtroExibicao, setFiltroExibicao} = useHome()
  const {arquivados} = usePedidos()
  const modoExibicao =  window.localStorage.getItem('exibicaoPedidos')

    return(
        <Estilo>
            <span className="botoes">
              <button className="botao-novo" onClick={novoPedido}>Novo pedido</button>
              <button className="botao-opcoes">
                <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
              </button>
            </span>

            <select value={filtroExibicao} onChange={e => setFiltroExibicao(e.target.value)}
            style={{
              display: (modoExibicao === 'all' ? 'block' : 'none')
              }}>
              <option value={''}>Todos</option>
              <option value={'CAIXA'}>Caixa</option>
              <option value={'ENTREGA'}>Entrega</option>
              <option value={'APLICATIVO'}>Aplicativo</option>
              <option value={'ARQUIVADO'}>Arquivados</option>
            </select>

            <button className="arq-button" 
            onClick={() => setFiltroExibicao('ARQUIVADO')}
            style={{
              display: ((arquivados.length > 0 && modoExibicao === 'all' && filtroExibicao !== 'ARQUIVADO') ? 'block' : 'none')
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

      >.botoes {
        display: flex;
        padding: 3px 0;
        flex-grow: 2;
        gap: 5px;
        height: 50px;
        border: solid 1px;
        border-radius: 5px; 
        background-color: ${cores.brancoEscuro};
        margin: 5px 0;

        button {
          cursor: pointer;
          border: none;
          background-color: transparent;
          transition: all .1s linear;

          &:hover{
            font-size: 15px;
            font-weight: 600;
          }
        }
        
        .botao-novo {
          flex-grow: 2;
        }

        .botao-opcoes {
          width: 40px;
        }
      }

      select {
        width: 100%;
        padding: 5px;
        border-radius: 5px;
        display: block;
        user-select: none;
      }

      .arq-button{
        background-color: transparent;
        border: none;
        height: 25px;
        cursor: pointer;
        color: red;
        transition: all .1s linear;
        font-size: .8rem;
        vertical-align: middle;
        &:hover{
          font-size: 1rem;
        }
      }

      @media (max-width: 550px) {
        >.botoes{
          display: none;
        }
        >select{
          font-size: 1.5rem;
          margin-top: 5px;
        }

  }

`