import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useContextMenu } from '../../components/ContextMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import * as Format from '../../util/Format'
import * as misc from '../../util/misc'
import * as cores from '../../util/cores'
import * as pedidoUtil from '../../util/pedidoUtil'

function getCostume(){
 return ' em ?'
}
function getUltPag(){
    return ' em ?'
}
export default function Pagamento({pedido, pagamento}) {
  return (
      <Container className='container'>
          {pedido.cliente && (
              <div className='costume'>
                  <span>
                      <label>Costuma pagar</label>
                      <label>{getCostume()}</label>
                  </span>
                  <span>
                      <label> | Ult. pagamento foi</label>
                      <label>{getUltPag()}</label>
                  </span>
              </div>
          )}

          <div className='top'>
              <div className='valor'>
                <input type={'number'} 
                max={pedido.valor - pedido.pagamentos.reduce((a,b) => a+b.valor,0)} />
                <button>
                    <FontAwesomeIcon icon={icons.faEllipsisV} />
                </button>
              </div>

              <div className='formas'>
                  <button 
                  style={{color: cores.verde, borderColor: cores.verde}}>
                      <FontAwesomeIcon icon={icons.faMoneyBillWaveAlt} />
                      <label>Especie</label>
                  </button>
                  <button 
                  style={{color: cores.azul, borderColor: cores.azul}}>
                      <FontAwesomeIcon icon={icons.faCreditCard} />
                      <label>Cartão</label>
                  </button>
                  <button 
                  style={{color: cores.roxoDark, borderColor: cores.roxoDark}}>
                      <FontAwesomeIcon icon={icons.faGlobe} />
                      <label>PIX</label>
                  </button>
                  <button 
                  style={{color: cores.laranjaDark, borderColor: cores.laranjaDark}}>
                      <FontAwesomeIcon icon={icons.faExchangeAlt} />
                      <label>Transf.</label>
                  </button>
                  <button 
                  style={{color: cores.roxo, borderColor: cores.roxo}}>
                      <FontAwesomeIcon icon={icons.faCalendarCheck} />
                      <label>Agend.</label>
                  </button>
                  <button 
                  style={{color: cores.vermelho, borderColor: cores.vermelho}}>
                      <FontAwesomeIcon icon={icons.faQuestion} />
                      <label>N/Info.</label>
                  </button>
              </div>

              <div className='valores'>
              <span>
                <h3 className='pago'>{Format.formatReal(pedido.valorPago)}</h3>
                <h6>Valor Pago</h6>
              </span>
              <span>
              <h2 className='pendente'>{Format.formatReal(pedido.valor - pedido.valorPago)}</h2>
                <h6>Valor Pendente</h6>
              </span>
              <span>
                <h3 className='total'>{Format.formatReal(pedido.valor)}</h3>
                <h6>Valor Total</h6>
              </span>
            </div>

          </div>

          <div className='middle'>
          <ul className='pagamentos-ul'>
                {pedido.pagamentos && pedido.pagamentos.map(e => 
                  <li key={e.id} className={e.status === 1 ? 'pago' : 'pendente'} >
                    <div className='inicio'>
                        {
                        e.tipo === 0 
                        ? <FontAwesomeIcon icon={icons.faMoneyBillWaveAlt} />
                        : e.tipo === 1 
                        ? <FontAwesomeIcon icon={icons.faCreditCard} />
                        : e.tipo === 2
                        ? <FontAwesomeIcon icon={icons.faGlobe} />
                        : e.tipo === 3
                        ? <FontAwesomeIcon icon={icons.faExchangeAlt} />
                        : e.tipo === 4
                        ? <FontAwesomeIcon icon={icons.faCalendarCheck} />
                        : e.tipo === 5
                        ? <FontAwesomeIcon icon={icons.faQuestion} />
                        : <FontAwesomeIcon icon={icons.faCommentDollar} /> 
                        }
                    </div>
                    <div className='centro'>
                        <div className='info-secundarias'>
                          <p>Cód.{e.id}</p>
                          <p>{`Add ${pedidoUtil.getDataPagamentoDescrito(e.dataAdicionado)}`}</p>
                          {e.dataRecebido && <p>{`Receb. ${pedidoUtil.getDataPagamentoDescrito(e.dataRecebido)}`}</p>}
                        </div>
                        <label className='titulo'>
                          {`${Format.formatReal(e.valorPago)} - ${
                            e.tipo === 0 
                            ? 'EM ESPÉCIE'
                            : e.tipo === 1 
                            ? 'NO CARTÃO'
                            : e.tipo === 2
                            ? 'VIA PIX'
                            : e.tipo === 3
                            ? 'TRANSFERÊNCIA BANCÁRIA'
                            : e.tipo === 4
                            ? `AGENDADO P/ ${e.progr.data}` 
                            : e.tipo === 5
                            ? 'NÃO INFORMADO'
                            : 'DESCONHECIDO PELO SISTEMA'} ${
                              e.status === 0
                              ? '(PAGO)'
                              : '(PENDENTE)'
                            }`
                          }
                        </label>
                        {e.valorRecebido && e.valorPago < e.valorRecebido && 
                        <div className='info-secundarias bottom'>
                          <p>{`Troco para ${Format.formatReal(e.valorRecebido)}`}</p>
                          <p>{`(${Format.formatReal(e.valorRecebido - e.valorPago)} de troco)`}</p>
                        </div>}
                    </div>
                    <div className='fim'>
                      <button className='opcoes-item'>
                        <FontAwesomeIcon icon={icons.faEllipsisV} />
                      </button>
                    </div>
                  </li>
                  )}
            </ul>
          </div>
      </Container>
  )
}


const Container = styled.div`
    width: min(90%, 800px);
    height: min(80%, 550px);
    display: flex;
    flex-direction: column;
    gap: 10px;
    label,p,h2,h3,h4,h5,h6{
        pointer-events: none;
        user-select: none;
    }
.costume{
    *{
        font-size: 12px;
        font-style: italic;
    }
}

    .top{
        width: 100%;
        
        .valor{
            display: flex;
            gap: 5px;
            padding: 5px;
            input{
                font-size: 16px;
                padding: 10px 0;
                flex-grow: 1;
            }
            button{
                width: 70px;
            }
        }
        .formas{
            width: 100%;
            height: 50px;
            display: flex;
            gap: 5px;
            flex-wrap: wrap;

            button{
                background-color: whitesmoke;
                border-radius: 25px;
                box-shadow: 1px 1px 5px rgba(0,0,0,.3);
                flex-grow: 1;
                width: 15%;
                border: 3px solid;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 3px;
                font-size: 16px;
                cursor: pointer;
                transition: font-size .1s linear;
                *{pointer-events: none;}
                svg{
                    font-size: 25px;
                }
                &:hover{
                    font-size: 18px;
                    font-weight: 600;
                }
            }
            @media (max-width: 760px){
                height: 100px;
                button{
                    width: 30%;
                }
            }
        }

        .valores{
        margin-top: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6% ;

        >span{
          display: flex;
          flex-direction: column;
          justify-content: center;
          *{text-align: center;}
        }

        .pago{color: ${cores.verdeEscuro}}
        .pendente{color: darkred}
        /* .total{color: ${cores.cinzaDark}} */
      }
    }

    .middle{
        flex-grow: 2;
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;
        flex-grow: 0;

        .pagamentos-ul{
        min-height: 10px;
        display: flex;
        flex-direction: column;
        padding: 0 5px 5px 5px;
        overflow-y: auto;
        flex-grow: 2;
        width: 100%;

        li{
            min-height: 60px;
          display: flex;
          gap: 5px;
          padding: 5px;
          flex-shrink:0;
          flex-basis: 50px;
          width: 100%;
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
        }
      }
    }
`