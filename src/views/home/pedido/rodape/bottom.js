import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPrint, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { cores } from '../../../../util/cores'
import { useHome } from "../../../../context/homeContext";
import { usePedido } from "..";
import { useAsk } from "../../../../components/Ask";
import { getValorPagamentosPagosOuNao, getValorPago, getValorPendente } from "../../../../util/pedidoUtil";
import { useMessage } from "../../../../components/Message";
import { useOrderNote } from "../../../../components/OrderNote";
import { Entregadores } from "../endereco/entregadores";

export const Bottom = () => {
    const {curr, openSelectBox} = useHome()
    const {cancelar, finalizar, acrescentarImpressao} = usePedido()
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
            throw new Error('noLog Escolha um cliente!')
        }
        if (curr.tipo === 'TIPO') {
          throw new Error('noLog Selecione o tipo do pedido (Caixa, Entrega, etc...)!')
        }
        if (!curr || !curr.itens.length > 0) {
          throw new Error('noLog Insira ao menos um item!')
        }
        if (getValorPagamentosPagosOuNao(curr) > curr.valor) {
          throw new Error('noLog Há pagamentos que excedem o valor do pedido!')
        }
        if (curr.tipo === 'APLICATIVO' && !curr?.aplicativo?.codigo) {
            throw new Error('noLog Insira o código do pedido gerado pelo app de delivery!')
        }
        if (curr.tipo === 'ENTREGA' && !curr?.endereco?.cep) {
            throw new Error('noLog Insira o edereço da entrega!')
        }
        if (curr?.pagamentos?.length > 0 && curr.pagamentos.some(e => e.tipo === 5)) {
            throw new Error('noLog Há pagamentos sem confirmação. Confirme-os antes de finalizar')
        }

        ask({
          title: 'Finalizar pedido?',
          buttons: [
            {title: 'SIM', click: verificarPago},
            {title: 'NÃO', click:() => {}}
        ],
        allowCancel: true
        })

        function verificarPago(){
          if(getValorPago(curr) < curr.valor) {
            
            ask({
              title: 'O pedido não foi pago completamente, deseja finalizar mesmo assim? O cliente ficará na lista de devedores.',
              buttons: [
                {title: 'SIM', click: verificarEntregador},
                {title: 'NÃO', click:() => {}}
            ],
            allowCancel: true
            })
          }else{
            verificarEntregador()
          }
        }

        function verificarEntregador(){
          if(curr.tipo === 'ENTREGA'){
              openSelectBox(<Entregadores callback={(entregador) => {
                finalizar(entregador)
              }} />)
          }else{
            finalizar()
          }
        }
      }catch(err){
          !err.message.startsWith('noLog ') && console.error(err, err.stack)
          message('error', err.message.replace('noLog ', ''))
      }
    }

    function handleImprimir(event){
      event && event.preventDefault()
      try{
        if (!curr?.id) {
          throw new Error('noLog Inicie o pedido!')
        }
        if (!curr.cliente || (!curr.cliente.id && !curr.cliente.nome)) {
            throw new Error('noLog Escolha um cliente!')
        }
        if (curr.tipo === 'TIPO') {
          throw new Error('noLog Selecione o tipo do pedido (Caixa, Entrega, etc...)!')
        }
        if (!curr || !curr.itens.length > 0) {
          throw new Error('noLog Insira ao menos um item!')
        }
        if (getValorPagamentosPagosOuNao(curr) > curr.valor) {
            throw new Error('noLog Há pagamentos que excedem o valor do pedido!')
        }
        if (curr.tipo === 'APLICATIVO' && !curr?.aplicativo?.codigo) {
            throw new Error('noLog Insira o código do pedido gerado pelo app de delivery!')
        }
        if (curr.tipo === 'ENTREGA' && !curr?.endereco?.cep) {
            throw new Error('noLog Insira o edereço da entrega!')
        }
        if (curr.tipo === 'ENTREGA' && getValorPendente(curr, true) > 0) {
            throw new Error('noLog Pedidos para entrega necessitam dos pagamentos antes de imprimir!')
        }
        if(orderNote(curr)){
          acrescentarImpressao(curr)
        }
      }catch(err){
          !err.message.startsWith('noLog ') && console.error(err, err.stack)
          message('error', err.message.replace('noLog ', ''))
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