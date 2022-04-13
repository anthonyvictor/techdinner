import React, {useEffect, useState} from "react";
import { usePedidos } from "../../context/pedidosContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import { convertFileToBase64, convertImageToBase64, formatReal } from "../../util/Format";
import * as cores from "../../util/cores";
import { useHome } from "../../context/homeContext";
import FloatButton from "../../components/FloatButton";
import { CorTipo, getValorPago, getValorPendente, IcoTipo } from '../../util/pedidoUtil';
import { isNEU } from "../../util/misc";

export default function Lista() {
  const { pedidos, semTipo, caixa, entrega, aplicativo, arquivados } = usePedidos();
  return (
        <ListaContainer>
          <FloatButton clique={()=> {}} />
          {window.localStorage.getItem('exibicaoPedidos') === 'all' 
          ? (  
                <ul className={`list`}>
                  {pedidos.sort(ordem).map(pedido => (<Item key={pedido.id} pedido={pedido} />))}
                </ul>
          )
          : (
            <>
              <ListGroup arr={semTipo} title='Desconhecido' />
              <ListGroup arr={caixa} title='Caixa' />
              <ListGroup arr={entrega} title='Entrega' />
              <ListGroup arr={aplicativo} title='Aplicativo' />
              <ListGroup arr={arquivados} title='Arquivados' aberto={false} />
            </>
          )}
          
          
        </ListaContainer>
  );
}

function ordem(a,b){
  if(a.dataInic > b.dataInic) return -1
  if(a.dataInic < b.dataInic) return 1
  if(a.dataInic === b.dataInic) return 0
}

function ListGroup({arr, title, aberto}){
  const [opened, setOpened] = useState(aberto !== undefined ? aberto : true)
    if(arr.length > 0 ){
      return (
        <ListGroupContainer opened={opened} className={`group ${title.toLowerCase()}`}>
          <button className="group-head"
          onClick={() => setOpened(prev => !prev)}>
            {title} - {arr.length} pedidos
            {opened 
            ? <FontAwesomeIcon icon={icons.faAngleDown} />
            : <FontAwesomeIcon icon={icons.faAngleLeft} />}
          </button>
          <ul className={`group-list ${opened}`}>
            {arr.sort(ordem).map(pedido => (<Item key={pedido.id} pedido={pedido} />))}
          </ul>
        </ListGroupContainer>
      )
    }else{
      return <></>
    }
}

const ListGroupContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex-shrink: 2;
    ${(props) => !(props.opened)}{
      min-height: 85px;
    }
    @media (max-width: 760px){
      ${(props) => !(props.opened)}{
        min-height: 140px;
      }
    }
    .group-head{
      text-align: left;
      background-color: ${cores.branco};
      border: none;
      padding: 5px;
      display: flex;
      align-items: center;
      vertical-align: center;
      justify-content: space-between;
      cursor: pointer;

      @media (hover: hover) and (pointer: fine) {
        &:hover {
          font-weight: 600;
        }
      }

    }
    .group-list{
      overflow-y: auto;
      flex-grow: 6;
      flex-shrink: 1;
      
      &.false{display: none;}
    }

    @media (max-width: 760px){
      /* .group-head{
        font-size: 25px;
      } */
      .group-list{
        padding: 5px;
      }
    }

    @media (max-width: 550px){
      .group-head{
        font-size: 25px;
      }
      .group-list{
        padding: 5px;
      }
    }

`

const ListaContainer = styled.div`
  overflow-y: auto;
  padding: 5px 0;
  border: none;
  flex-grow: 2;
  display:flex;
  flex-direction: column; 
  gap: 5px;
  height: 100%;

  @media (max-width: 760px){
    padding: 10px 10px;
  }

  @media (max-width: 550px){
      padding: 5px 10px 60px 10px;
  }
`;


function Item({pedido}) {

  const {curr, setCurr} = useHome() 
  const {getImagem}= usePedidos()
  const [duracao, setDuracao] = useState(getDuration())

  function getDuration() {
    let dataATUAL = new Date();

    let ms = dataATUAL - new Date(pedido.dataInic);

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
    // let totalPago = getValorPago()
    let diff = getValorPendente(pedido)
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
  
useEffect(() => {
  const timer = setInterval(
    () => {setDuracao(getDuration())}, 1000);
  return() => clearInterval(timer)
},[])

  return (
    <ItemContainer className={(curr && pedido && pedido.id && curr.id === pedido.id) ? 'active' : undefined}
      pedido={{
        ...pedido,
        cortipo: CorTipo(pedido.tipo),
        corhora: CorHora,
        corvalor: CorValor,
        corimpr: CorImpr,
      }}
      onClick={() => {
        setCurr(pedido)
      }}
    >
      {getImagem(pedido?.cliente?.id) 
      ? <img src={getImagem(pedido.cliente.id)} alt="Imagem do cliente" />
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


