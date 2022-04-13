import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPrint, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import * as cores from '../../../../util/cores'
import { useHome } from "../../../../context/homeContext";
import { usePedido } from "..";
import { useAsk } from "../../../../components/Ask";
import { getValorPagamentosPagosOuNao, getValorPendente } from "../../../../util/pedidoUtil";
import { useMessage } from "../../../../components/Message";
import { useOrderNote } from "../../../../components/OrderNote";

export const Bottom = () => {
    const {curr} = useHome()
    const {cancelar, finalizar} = usePedido()
    const {ask} = useAsk()
    const {message} = useMessage()
    const {orderNote} = useOrderNote()

    function handleCancelar(event){
      event && event.preventDefault()
      ask({
        title: 'Deseja realmente cancelar este pedido?',
        buttons: [
          {title: 'SIM', click: sim},
          {title: 'NÃO', click:() => {}}
      ],
      allowCancel: true
      })

      function sim(){
        //verificar se for app ele deve solicitar o codigo do pedido fornecido pelo app
        // const motivo = window.prompt('Insira o motivo do cancelamento:')
        // if(motivo.replace(/[\s]+/g, '') === ''){
        //   sim()
        // }else if(motivo !== null){
          cancelar() //motivo
        // }
      }
    }

    function handleFinalizar(event){
      event && event.preventDefault()
      try{
        if (!curr.cliente || (!curr.cliente.id && !curr.cliente.nome)) {
            throw new Error('Escolha um cliente!')
        }
        if (curr.tipo === 'TIPO') {
          throw new Error('Selecione o tipo do pedido (Caixa, Entrega, etc...)!')
        }
        if (!curr || !curr.itens.length > 0) {
          throw new Error('Insira ao menos um item!')
        }
        if (getValorPagamentosPagosOuNao(curr) > curr.valor) {
          throw new Error('Há pagamentos que excedem o valor do pedido!')
        }
        if (curr.tipo === 'APLICATIVO' && !curr?.aplicativo?.codigo) {
            throw new Error('Insira o código do pedido gerado pelo app de delivery!')
        }
        if (curr.tipo === 'ENTREGA' && !curr?.endereco?.cep) {
            throw new Error('Insira o edereço da entrega!')
        }
        if (curr?.pagamentos?.length > 0 && curr.pagamentos.some(e => e.tipo === 5)) {
            throw new Error('Há pagamentos sem confirmação. Confirme-os antes de finalizar')
        }

        ask({
          title: 'Finalizar pedido?',
          buttons: [
            {title: 'SIM', click: sim},
            {title: 'NÃO', click:() => {}}
        ],
        allowCancel: true
        })
  
        function sim(){
          finalizar()
        }
      }catch(err){
          console.error(err, err.stack)
          message('error', err.message)
      }
    }

    function handleImprimir(event){
      event && event.preventDefault()
      try{
        if (!curr?.id) {
          throw new Error('Inicie o pedido!')
        }
        if (!curr.cliente || (!curr.cliente.id && !curr.cliente.nome)) {
            throw new Error('Escolha um cliente!')
        }
        if (curr.tipo === 'TIPO') {
          throw new Error('Selecione o tipo do pedido (Caixa, Entrega, etc...)!')
        }
        if (!curr || !curr.itens.length > 0) {
          throw new Error('Insira ao menos um item!')
        }
        if (getValorPagamentosPagosOuNao(curr) > curr.valor) {
            throw new Error('Há pagamentos que excedem o valor do pedido!')
        }
        if (curr.tipo === 'APLICATIVO' && !curr?.aplicativo?.codigo) {
            throw new Error('Insira o código do pedido gerado pelo app de delivery!')
        }
        if (curr.tipo === 'ENTREGA' && !curr?.endereco?.cep) {
            throw new Error('Insira o edereço da entrega!')
        }
        if (curr.tipo === 'ENTREGA' && getValorPendente(curr, true) > 0) {
            throw new Error('Pedidos para entrega, necessitam dos pagamentos antes de imprimir!')
        }
        orderNote(curr)
      }catch(err){
          console.error(err, err.stack)
          message('error', err.message)
      }
    }

    return (
        <BottomContainer className='bottom-container'>
                
            <button className='bot-button cancelar' onClick={handleCancelar}>
                <FontAwesomeIcon className='icon' icon={faTrash} />
                <div className='info-botao'>
                    <label>Cancelar</label>
                </div>
                </button>

                <button className='bot-button imprimir' onClick={handleImprimir}>
                <FontAwesomeIcon className='icon' icon={faPrint} />
                <div className='info-botao'>
                    <label>Imprimir</label>
                    {curr.impr > 0 
                    && <label className='bottom'>
                    {` (${curr.impr + 1}º vez)`}</label>}
                </div>
                </button>


                <button className='bot-button finalizar' onClick={handleFinalizar}>
                <FontAwesomeIcon className='icon' icon={faClipboardCheck} />
                <div className='info-botao'>
                    <label>Finalizar</label>
                </div>
                </button>

        </BottomContainer>
    )
}

const BottomContainer = styled.div`


  flex-basis: 60px;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: whitesmoke;
  display: flex;
  gap: 10px;
  padding: 5px 10px;

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