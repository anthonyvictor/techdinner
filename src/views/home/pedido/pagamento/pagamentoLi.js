import React, { createContext, useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWaveAlt, faCreditCard, faGlobe, 
    faExchangeAlt, faCalendarCheck, faQuestion, 
    faCommentDollar, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { formatReal } from '../../../../util/Format';
import { join } from "../../../../util/misc";
import styled from "styled-components";
import { cores } from '../../../../util/cores'
import { useContextMenu } from '../../../../components/ContextMenu';
import { getDataPagamentoDescrito, getTituloPagamento } from '../../../../util/pedidoUtil';
import { usePayer } from "./payer";

const PagamentoContext = createContext()

export const Pagamento = ({pagamento, setPagamento, readOnly}) => {

    return (
        <PagamentoContext.Provider value={{
            pagamento, setPagamento, readOnly
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
  
  const Pagamento2 = () => {
    
    const {pagamento, setPagamento, readOnly} = usePagamento()
    const [pagamentosEditor] = useState(<></>)
    const {payer} = usePayer()

    const {contextMenu} = useContextMenu()

    function getInfoSecundarias() {
        
        const cod = !isNaN(pagamento.id) ? `Cód.${pagamento.id}` : ''
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

    async function editar(){
      await payer({pedido: null, pagamento: pagamento, callback: setPagamento})
    }
    
    async function togglePagoPendente(){
      if(pagamento.tipo === 5){//n info
        await payer({pedido: null, pagamento: pagamento, callback: setPagamento})
      }else{
        const newPagamento = {...pagamento, status: pagamento.status === 0 ? 1 : 0}
        setPagamento([newPagamento], pagamento)
      }
    }

    function excluir(){
        setPagamento([], pagamento)
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
        onDoubleClick={() => !readOnly && togglePagoPendente()}
        onContextMenu={(e) => {
          e.preventDefault()
          !readOnly && openContextMenu()
        }}>

        <div className='inicio'>
            <Icone />
        </div>

        <div className='centro'>

            <p className='info-secundarias'>{getInfoSecundarias()}</p>
            <label className='titulo'>{getTituloPagamento(pagamento)}</label>
            {pagamento.valorRecebido && pagamento.valorPago < pagamento.valorRecebido && (
                <p className='info-secundarias bottom'>{getInfoSecundariasBottom()}</p>
            )}

        </div>

        <div className='fim'>

            {!readOnly && (
              <button className='opcoes'
              onClick={() => openContextMenu()}>
                  <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            )}

        </div>
        {pagamentosEditor}
    </Container>
      )
}

const Container = styled.li`
          min-height: 60px;
          width: 100%;
          display: flex;
          gap: 5px;
          padding: 5px;
          flex-shrink:0;
          flex-basis: 50px;
          border-bottom: 1px solid black;
          *{pointer-events: none;}
          &:hover{ 
              background-color: ${cores.brancoDark}; 
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

              
                font-size: 10px;
                font-style: italic;
            
              @media (max-width: 550px){ 
                &:not(.bottom){
                  display: none;
                }          
              }

              /* &.bottom{
                font-size:
              } */
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
