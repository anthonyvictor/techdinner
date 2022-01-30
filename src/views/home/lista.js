import React, {useEffect, useState} from "react";
import { usePedidos } from "../../context/pedidosContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import { formatReal } from "../../util/Format";
import * as cores from "../../util/cores";
import { useHome } from "../../context/homeContext";
import FloatButton from "../../components/FloatButton";
import * as pedidoUtil from '../../util/pedidoUtil'

export default function Lista() {
  const { pedidos } = usePedidos();
  return (
        <ListaContainer>
          <FloatButton clique={()=> {}} />
          {pedidos ? pedidos.map(pedido => 
            (<Item key={pedido.id} pedido={pedido} />)
          ):(<div></div>)}
        </ListaContainer>
  );
}

const ListaContainer = styled.ul`
  overflow-y: auto;
  width: 100%;
  height: calc(100vh - 140px); 
  padding: 5px 0;
  border: none;


  @media (max-width: 760px){
    padding: 10px 10px;
  }

  @media (max-width: 400px){
      height: calc(100vh - 90px);
      padding: 5px 10px 60px 10px;
  }
`;


function Item({pedido}) {

  const {curr, setCurr} = useHome() 
  const [duracao, setDuracao] = useState(getDuration())

  setInterval(function() {
    setDuracao(getDuration())
  }, 1000);

  function getDuration() {
    let dataATUAL = new Date();

    let ms = dataATUAL - pedido.dataInic;

    let m = ms / 1000 / 60;

    let h = m / 60;

    m = h % 1 * 60

    let d = h / 24;



    let dur = (d < 1 ? "" : Math.floor(d) + "d") 

    if(dur === ''){
      dur = (h < 1 ? "" : Math.floor(h) + "h")
      if(dur === ''){
        dur = Math.floor(m) + "m"
    }else{
      dur = dur + Math.floor(m)
    }
    }

    return dur;
  }

  

  function CorHora() {
    let data_atual = new Date();
    let diff = (data_atual - pedido.dataInic) / 1000 / 60 

    

    if (diff < 10) {
      return "#02fa3c";
    } else if (diff < 20) {
      return "#a3d609";
    } else if (diff < 30) {
      return '#fff700';
    } else if (diff < 40) {
      return "#fcb01e";
    } else if (diff < 50) {
      return "#fa5311";
    } else if (diff < 60) {
      return "#bf0f06";
    } else if (diff < 120) {
      return "#c20839";
    } else if (diff <= 150) {
      return "#8108c2";
    } else {
      return "#17091f";
    }
  }

  function CorValor() {
    let diff = pedido.valor - pedido.valorPago;

    if (diff === pedido.valor) {
      return "#bf0f06";
    } else if (diff > 0) {
      return "#bd7c00";
    } else if (diff === 0) {
      return "#126125";
    } else {
      return "#1e272e";
    }
  }

  function CorImpr() {
    if (pedido.impr === 0) {
      return "#bf0f06";
    } else {
      return "#126125";
    }
  }

  

  // let images = require.context('../../images', true);

  // let itemImg = images(`./${pedido.cli_img}`).default;
  
useEffect(() => {
  
  return() => { setInterval(null)}
},[])
  return (
    <ItemContainer className={(curr && pedido && pedido.id && curr.id === pedido.id) ? 'active' : undefined}
      pedido={{
        ...pedido,
        cortipo: cores.tipo(pedido.tipo),
        corhora: CorHora,
        corvalor: CorValor,
        corimpr: CorImpr,
      }}
      onTouchStart={() => {
        // setShowLista(false)
      }}
      onClick={() => {
        setCurr(pedido)
      }}
    >
      {pedido.cliente.imagem 
      ? <img src={pedido.cliente.imagem} alt="Imagem do cliente" />
      : pedido.cliente.nome 
      ? <FontAwesomeIcon className="icon" icon={icons.faUser} />
      : <FontAwesomeIcon className="icon" icon={icons.faTimes} /> }
      <div className="informacoes">
        <p className="nome-cliente">{pedido.cliente.nome ?? '* SEM CLIENTE *'}</p>
        <div className="info-secundarias">
          <span className="tipo" title={pedido.tipo}>
            <FontAwesomeIcon className="ico" icon={pedidoUtil.IcoTipo(pedido.tipo)} />
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

export const ItemContainer = styled.li`
  width: 100%;
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

      @media (max-width: 760px){
        margin-top: 5px;
        padding: 0 10px;
        gap: 10px;
      }
      span {
        flex-grow: 2;
        justify-content: center;
        padding: 3px;
        gap: 3px;
        font-size: 11px;
        display: flex;
        align-items: center;
        border: 0.1px solid black;
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
    @media (max-width: 760px){
      margin-bottom: 10px;
    }
  }

  /* @media (max-width: 760px){
    .esquerda{
      width: 100% ;
      ${(props) => !props.curr}{
        display: none;
      }
    }
  } */

  @media (max-width: 760px) {
    height: 70px;

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


