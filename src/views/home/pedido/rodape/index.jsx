import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPrint, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { usePedido } from "..";
import { useHome } from "../../../../context/homeContext";
import * as cores from '../../../../util/cores'

export const Rodape = () => {
    const { curr } = useHome()
    const {mudarObservacoes} = usePedido()

    function openObservacoes(){
        const resp = window.prompt('Digite a observação do pedido', curr.observacoes)
        mudarObservacoes(resp)
    }


    const Observacoes = () => {

        return (
            <ObservacoesContainer className={`observacoes-container${!curr.observacoes ? ' collapsed': ''}`}
            type='button' 
            onClick={() => openObservacoes()}>
                <label>Observações:</label>
                <p className='observacoes'>{curr.observacoes ?? 'Adicionar observação.'}</p>
            </ObservacoesContainer>
        )
    }

    const Bottom = () => {

        return (
            <BottomContainer className='bottom-container'>
                    
                <button className='bot-button cancelar'>
                    <FontAwesomeIcon className='icon' icon={faTrash} />
                    <div className='info-botao'>
                        <label>Cancelar</label>
                    </div>
                    </button>

                    <button className='bot-button imprimir'>
                    <FontAwesomeIcon className='icon' icon={faPrint} />
                    <div className='info-botao'>
                        <label>Imprimir</label>
                        {curr.impr > 0 
                        && <label className='bottom'>
                        {` (${curr.impr + 1}º vez)`}</label>}
                    </div>
                    </button>


                    <button className='bot-button finalizar'>
                    <FontAwesomeIcon className='icon' icon={faClipboardCheck} />
                    <div className='info-botao'>
                        <label>Finalizar</label>
                    </div>
                    </button>

            </BottomContainer>
        )
    }

    return(
        <>
            <Observacoes />
            <Bottom />      
        </>
    )
}

const ObservacoesContainer = styled.button`
    display: flex;
  flex-direction: column;
  padding: 3px;
  border: none;
  border-top: 1px solid black;
  gap: 5px;
  height: 80px;
  overflow: auto;
  cursor: pointer;
  font-weight: 600;
  color: red;
  background-color: whitesmoke;

  &.collapsed{
    color: black;
    font-weight: normal;
    height: 65px;
  }

  *{
    width: 100%;
    pointer-events: none;
    text-align:  center;
  }
  &:hover{
      color: darkblue;
      font-weight: 600;
    }
  label{
    font-size: 10px;
  }
  .observacoes{
    flex-grow: 2;
    font-size: 14px;
    @media (max-width: 550px){font-size: 12px;}
  }
    `


const BottomContainer = styled.div`


  flex-basis: 60px;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: whitesmoke;
  display: flex;
  gap: 10px;
  padding: 5px 10px;

  @media print{
    display: none;
  }

  .bot-button{
    height: 100% ;
    flex-grow: 1;
    border: 2px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    *{pointer-events: none;}
    .icon{
      font-size: 18px;
    }
    .info-botao{
      display: flex;
      flex-direction: column;
      .bottom{
        font-size: 10px;
        font-weight: 600;
      }
    }
    &.cancelar{
      background-color: ${cores.vermelho};
    }
    &.imprimir{
      background-color: ${cores.amarelo};
    }
    &.finalizar{
      background-color: ${cores.verde};
    }
    &:hover{
      color: white;
      &.cancelar{
      background-color: ${cores.vermelhoDark};
    }
    &.imprimir{
      background-color: ${cores.amareloDark};
    }
    &.finalizar{
      background-color: ${cores.verdeDark};
    }
    }
  }

`