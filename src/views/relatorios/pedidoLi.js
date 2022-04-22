import React from "react";
// import { usePedidos } from "../../context/pedidosContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import { convertFileToBase64, convertImageToBase64, formatReal } from "../../util/Format";
import * as cores from "../../util/cores";
// import { useHome } from "../../context/homeContext";
import { CorHora, CorImpr, CorTipo, CorValor, getValorPendente, IcoTipo } from '../../util/pedidoUtil';

export const Pedido = ({pedido, abrir}) => {

    return (
      <ItemContainer
        pedido={{
          ...pedido,
          cortipo: CorTipo(pedido.tipo),
          corhora: CorHora(pedido.dataInic),
          corvalor: CorValor(pedido),
          corimpr: CorImpr(pedido.impr),
        }}
        onClick={() => {
        abrir && abrir()
        }}
      >

        <div className="img-id">
          {pedido?.cliente?.imagem
          ? <img src={pedido.cliente.imagem} alt="Imagem do cliente" />
          : pedido.cliente.nome
          ? <FontAwesomeIcon className="icon" icon={icons.faUser} />
          : <FontAwesomeIcon className="icon" icon={icons.faTimes} /> }
          {pedido?.cliente?.id && (
            <small>{pedido.cliente.id}</small>
          )}

        </div>

        <div className="informacoes">
          <p className="nome-cliente">{pedido.cliente.nome ?? '* SEM CLIENTE *'}</p>
          <div className="info-secundarias">
            
            <span className="id">
              <p>#{pedido.id}</p>
            </span>

            <span className={`status ${pedido.status}`} title={pedido.status} />
          
            <span className="tipo" title={pedido.tipo}>
              <FontAwesomeIcon className="ico" icon={IcoTipo(pedido.tipo)} />
              <p>{pedido.tipo}</p>
              {pedido?.status !== 'CANCELADO' && pedido?.endereco?.entregador?.nome &&
                <p>{pedido.endereco.entregador.nome}</p>
              }
              {pedido?.status !== 'CANCELADO' && pedido?.endereco?.taxa &&
                <p>{formatReal(pedido.endereco.taxa)}</p>
              }
            </span>

            <span className="tempo">
              <FontAwesomeIcon className="ico" icon={icons.faClock} />
              <p>{new Date(pedido.dataInic).toLocaleString('pt-BR')}</p>
            </span>
          
            <span className="valor">
              <FontAwesomeIcon className="ico" icon={icons.faMoneyBillWaveAlt} />
              <p>{formatReal(pedido.valor)}</p>
            </span>
          
          </div>
        </div>
      </ItemContainer>
    );
  }
  
  const ItemContainer = styled.li`
    width: 100% ;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: ${cores.brancoEscuro};
    height: 50px;
    border: 1px solid black;
    padding: 0 5px;
    cursor: pointer;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
  
    &.active{
      background-color: ${cores.cinzaDark};
      .img-id{
        img{border-color: white;}
        .icon{color: white;}
      }
      .informacoes .nome-cliente{color: white;}
      &:hover{
        background-color: black;
      }
      
    }
  
    .img-id{
      width: 40px;
      flex-grow: 0;
      flex-shrink: 0;
      /* height: 100%; */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .icon{
        font-size: 30px;
        width: 30px;
        flex-shrink: 0;
        @media (max-width: 760px){
          font-size: 30px;
          width: 30px;
          
        }
    
      }
    
      img {
        user-select: none;
        pointer-events: none;
        border: 2px solid black;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        flex-grow: 0;
        flex-shrink: 0;
        object-fit: cover;
      }
      small{
        font-size: .5rem;
      }
    }

    .informacoes {
      user-select: none;
      /* pointer-events: none; */
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1px;
      /* width: 100%; */
      flex-grow: 1;
      height: 100%;
  
      .nome-cliente {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 600;
      }
      .info-secundarias {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        gap: 3px;
        overflow-x: auto;
  
        span {
          justify-content: center;
          padding: 4px 15px;
          gap: 3px;
          font-size: 11px;
          display: flex;
          align-items: center;
          border: 0.1px solid black;
          border-radius: 10px;
          background-color: white;
          flex-shrink: 0;
          p{
            line-height: 10px;
          }
          /* *{line-height: 100%;} */
        }

        .status{
          border-radius: 50%;
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          flex-grow: 0;
          background-color: black;
          padding: 0;
          margin: auto 5px;

            &.FINALIZADO{
              background-color: ${cores.verde};

            }
            &.PENDENTE{
              background-color:  ${cores.vermelho};
            }
            &.CANCELADO{
              background-color: ${cores.roxo};
            }
        }
  
        .tipo {
          /* width: 20px; */
          .ico {
            width: 20px;
            color: ${(props) => props.pedido.cortipo};
          }
          p:not(:first-child, :last-child):after{
            content: ' | ';
          }
  
        }
  
        .tempo {
          min-width: 50px;
          .ico {
            border: 1px solid black;
            border-radius: 50%;
            color: ${(props) => props.pedido.corhora};
          }
        }
  
        .valor {
          .ico {
            color: ${(props) => props.pedido.corvalor};
          }
        }
  
      }
    }
  
    &:hover {
      background-color: ${cores.cinzaEscuro};
      color: white;
  
      span {
        color: black;
        border: .5px solid white!important;
      }
    }
  
    &:not(:last-child) {
      margin-bottom: 6px;
    }
  
    @media (max-width: 760px) {
      height: 80px;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
  
      .img-id{
        img {
          width: 40px;
          height: 40px;
        }
        small{
          display: none;
        }
      }
  
      .informacoes {
        width: 80%;
        .nome-cliente {
          font-size: 18px;
        }
  
        .info-secundarias {
          margin-top: 5px;
          padding: 6px 10px;
          gap: 3px;

          span {
            font-size: 15px;
          }

          .id{
            display: none;
          }

        }
      }
    }
  
  `;