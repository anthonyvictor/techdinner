import React, { createContext, useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWaveAlt, faCreditCard, faGlobe, 
    faExchangeAlt, faCalendarCheck, faQuestion, 
    faCommentDollar, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { formatReal } from '../../../../util/Format';
import { isNEU, join } from "../../../../util/misc";
import styled from "styled-components";
import * as cores from '../../../../util/cores'
import { useContextMenu } from '../../../../components/ContextMenu';
import { getDataPagamentoDescrito } from '../../../../util/pedidoUtil';

const PagamentoContext = createContext()

export const Pagamento = ({pagamento}) => {
    const [pagamentoState] = useState(pagamento)
    return (
        <PagamentoContext.Provider value={{
            pagamento: pagamentoState
        }}>
            <Pagamento2 />
        </PagamentoContext.Provider>
    )
}

const usePagamento = () => {
    return useContext(PagamentoContext)
}

const Icone = () => {

    const {pagamento} = usePagamento()

    if (pagamento.tipo === 0) return <FontAwesomeIcon icon={faMoneyBillWaveAlt} /> 
    if (pagamento.tipo === 1) return <FontAwesomeIcon icon={faCreditCard} />
    if (pagamento.tipo === 2) return <FontAwesomeIcon icon={faGlobe} />
    if (pagamento.tipo === 3) return <FontAwesomeIcon icon={faExchangeAlt} /> 
    if (pagamento.tipo === 4) return <FontAwesomeIcon icon={faCalendarCheck} /> 
    if (pagamento.tipo === 5) return <FontAwesomeIcon icon={faQuestion} /> 

    return <FontAwesomeIcon icon={faCommentDollar} /> 

}

export const Pagamento2 = () => {

    const {pagamento} = usePagamento()

    const {contextMenu} = useContextMenu()

    function getTitulo() {

        const val = `${formatReal(pagamento.valorPago)} - ` 

        const esp = pagamento.tipo === 0 ? 'EM ESPÉCIE' : ''
        const car = pagamento.tipo === 1 ? 'NO CARTÃO' : ''
        const onl = pagamento.tipo === 2 ? 'VIA PIX' : ''
        const tra =  pagamento.tipo === 3 ? 'TRANSFERÊNCIA BANCÁRIA' : ''
        const pro =  pagamento.tipo === 4 ? `AGENDADO P/ ${pagamento.progr.data}` : ''
        const des =  pagamento.tipo === 5 ? 'NÃO INFORMADO' : ''

        const stt = pagamento.status === 1 ? ' (PAGO)' : ' (PENDENTE)'

        const res = join([esp, car, onl, tra, pro, des], '')

        return isNEU(res) ? 'DESCONHECIDO PELO SISTEMA' : val + res + stt

    }

    function getInfoSecundarias() {
        
        const cod = `Cód.${pagamento.id}`
        const add = `Add ${getDataPagamentoDescrito(pagamento.dataAdicionado)}`
        const rcb = (pagamento.status === 1 && pagamento.dataRecebido) 
        ? `Receb. ${getDataPagamentoDescrito(pagamento.dataRecebido)}` : ''

        return join([cod, add, rcb], ' ')

    }

    function getInfoSecundariasBottom() {
        
        const trocoPara = `Troco p/${formatReal(pagamento.valorRecebido)} `
        const deTroco = `(${formatReal(pagamento.valorRecebido - pagamento.valorPago)} de troco)`

        return trocoPara + deTroco

    }

    function editar(){
        alert('não implementado')
    }
    
    function togglePagoPendente(){
        alert('não implementado')
    }

    function excluir(){
        alert('não implementado')
    }

    function openContextMenu(){
        contextMenu([
          {title:'Editar', click:() => editar()},
          {title:'Pago/Pendente', click: () => togglePagoPendente()},
          {title:'Excluir', click:() => excluir()},
        ])
      }

      function getStatus(){
        return pagamento.status === 1 ? 'pago' : 'pendente'
      }

      return (
        <Container key={pagamento.id} className={getStatus()}
        onDoubleClick={() => togglePagoPendente()}
        onContextMenu={(e) => {
          e.preventDefault()
          openContextMenu()
        }}>

        <div className='inicio'>
            <Icone />
        </div>

        <div className='centro'>

            <div className='info-secundarias'>{getInfoSecundarias()}</div>
            <label className='titulo'>{getTitulo()}</label>
            {pagamento.valorRecebido && pagamento.valorPago < pagamento.valorRecebido && (
                <div className='info-secundarias bottom'>{getInfoSecundariasBottom()}</div>
            )}

        </div>

        <div className='fim'>

            <button className='opcoes'
            onClick={() => openContextMenu()}>
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>

        </div>
    </Container>
      )
}

const Container = styled.li`
 display: flex;
          gap: 5px;
          padding: 5px;
          flex-shrink:0;
          flex-basis: 50px;
          border-bottom: 1px solid black;
          *{pointer-events: none;}
          &:hover{ 
              background-color: ${cores.branco}; 
            }
          .inicio{
            display: flex;
            align-items: center;
            gap: 5px;
            svg{
              width: 30px;
              height: 30px;
              margin: 0 5px 0 5px;
            }
          }
          .centro{
            flex-grow: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .info-secundarias{
              display: flex;
              gap: 5px;

              p{
                font-size: 10px;
                font-style: italic;
                :not(:last-child){
                  &::after{
                    content: ' | '
                  }
                }
              }
              @media (max-width: 550px){ 
                &:not(.bottom){
                  display: none;
                }          
              }
            }
            .titulo{
              font-weight: bolder;
              @media (max-width: 550px){
                font-size: 14px;
              }
            }
          }
          .fim{
            display: flex;
            gap: 10px;
            align-items: center;
            label{
              font-weight: 600;
              font-size: 18px;
            }
            button{
              font-size: 20px;
              height: 100% ;
              background-color: transparent;
              border: none;
              cursor: pointer;
              pointer-events: all;
              width: 40px;
              *{color: black!important;}
            }
          }
          &.pago{
            *{color: ${cores.verdeEscuro}}
          }
          &.pendente{
            *{color: ${cores.vermelhoDark}}
          }

`