import React, {useState} from "react";
import { usePedidos } from "../../context/pedidosContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import { cores } from "../../util/cores";
import FloatButton from "../../components/FloatButton";
import { Pedido } from "./pedidoLi";
import { useHome } from "../../context/homeContext";

export default function Lista() {
  const { pedidos, semTipo, caixa, entrega, aplicativo, arquivados } = usePedidos();
  const {curr, setCurr, novoPedido, filtro} = useHome()

  return (
        <ListaContainer>
          <FloatButton clique={novoPedido} />
          {window.localStorage.getItem('exibicaoPedidos') === 'group' 
            ? (
              <>
                <ListGroup arr={semTipo} title='Desconhecido' />
                <ListGroup arr={caixa} title='Caixa' />
                <ListGroup arr={entrega} title='Entrega' />
                <ListGroup arr={aplicativo} title='Aplicativo' />
                <ListGroup arr={arquivados} title='Arquivados' aberto={false} />
              </>
            )

            : (  
              <ul className={`list`}>
                {pedidos
                .filter(filtro)
                .sort(ordem)
                .map(pedido => (
                  <Pedido key={pedido.id} 
                  pedido={pedido} atual={curr}
                  abrir={() => setCurr(pedido)} />
                ))}
              </ul>
            )
          }
          
          
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
  const {curr, setCurr} = useHome()
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
            {arr.sort(ordem).map(pedido => (
              <Pedido key={pedido.id} 
              pedido={pedido} atual={curr}
              abrir={() => setCurr(pedido)} />
            ))}
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

export const ListaContainer = styled.div`
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





