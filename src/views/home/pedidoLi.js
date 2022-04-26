import React, {useEffect, useState} from "react";
// import { usePedidos } from "../../context/pedidosContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import { convertFileToBase64, convertImageToBase64, formatReal } from "../../util/Format";
import * as cores from "../../util/cores";
// import { useHome } from "../../context/homeContext";
import { CorHora, CorImpr, CorTipo, CorValor, getDuracao, getValorPendente, IcoTipo } from '../../util/pedidoUtil';
import { useApi } from "../../api";

export const Pedido = ({pedido, atual, abrir}) => {

    // const {curr, setCurr} = useHome() 
  
    const [duracao, setDuracao] = useState(getDuracao(pedido.dataInic))

    const {getLocalUrl} = useApi()
  
    

  useEffect(() => {
    const timer = setInterval(
      () => {setDuracao(getDuracao(pedido.dataInic))}, 1000);
    return() => clearInterval(timer)
  },[])
  
    return (
      <ItemContainer className={(atual && pedido && pedido.id && atual.id === pedido.id) ? 'active' : undefined}
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
        {pedido?.cliente?.imagem
        ? <img src={getLocalUrl(pedido.cliente.imagem)} alt="Imagem do cliente" />
        : pedido.cliente.nome
        ? <FontAwesomeIcon className="icon" icon={icons.faUser} />
        : <FontAwesomeIcon className="icon" icon={icons.faTimes} /> }
        <div className="informacoes">
          <p className="nome-cliente">{pedido.cliente.nome ?? '* SEM CLIENTE *'}</p>
          <div className="info-secundarias">
            <span className="tipo" title={pedido.tipo}>
              <FontAwesomeIcon className="ico" icon={IcoTipo(pedido.tipo)} />
            </span>
            <span className="tempo">
              <FontAwesomeIcon className="ico" icon={icons.faClock} />
              <p>{duracao}</p>
            </span>
            <span className="valor">
              <FontAwesomeIcon className="ico" icon={icons.faMoneyBillWaveAlt} />
              <p>{formatReal(pedido.valor)}</p>
            </span>
            <span className="impr">
              <FontAwesomeIcon className="ico" icon={icons.faPrint} />
              <p>{pedido.impr}</p>
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
  
    &.active{
      background-color: ${cores.cinzaDark};
      img{border-color: white;}
      > .icon{color: white;}
      .informacoes .nome-cliente{color: white;}
      &:hover{
        background-color: black;
      }
      
    }
  
    > .icon{
      font-size: 30px;
      width: 30px;
      flex-shrink: 0;
      @media (max-width: 760px){
        font-size: 40px;
        width: 40px;
        
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
  
    .informacoes {
      user-select: none;
      /* pointer-events: none; */
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1px;
      width: 100%;
      height: 100%;
  
      .nome-cliente {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 600;
      }
      .info-secundarias {
        display: flex;
        justify-content: stretch;
        gap: 3px;
  
        span {
          flex-grow: 2;
          justify-content: center;
          padding: 3px;
          gap: 3px;
          font-size: 11px;
          display: flex;
          align-items: center;
          border: 0.1px solid black;
          border-radius: 10px;
          background-color: white;
        }
  
        .tipo {
          width: 20px;
          .ico {
            width: 20px;
            color: ${(props) => props.pedido.cortipo};
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
          width: 80px;
          .ico {
            color: ${(props) => props.pedido.corvalor};
          }
        }
  
        .impr {
          .ico {
            color: ${(props) => props.pedido.corimpr};
          }
        }
      }
    }
  
    &:hover {
      background-color: ${cores.cinzaEscuro};
      color: white;
  
      span {
        color: black;
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
  
      .info-secundarias {
          margin-top: 5px;
          padding: 0 10px;
          gap: 10px;
        }
  
      img {
        width: 40px;
        height: 40px;
      }
  
      .informacoes {
        .nome-cliente {
          font-size: 18px;
        }
  
        .info-secundarias {
          span {
            font-size: 15px;
          }
  
          .tipo {
            width: 30px;
          }
  
          .tempo {
            width: 70px;
          }
  
          .valor {
            width: 100px;
          }
        }
      }
    }
  
  `;