import { faBan, faCheck, faHandHoldingUsd, faTruck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { RelatoriosProvider, useRelatorios } from '../../context/relatoriosContext'
import { formatReal } from '../../util/Format'
import { Pedido } from './pedidoLi'
import { cores } from '../../util/cores'
import { Refreshing } from '../../components/refreshing'
import {OrderNoteProvider, useOrderNote} from '../../components/OrderNote'
export const Relatorios = () => {
    return (
        <RelatoriosProvider>
            <OrderNoteProvider>
                <RelatoriosElement />
            </OrderNoteProvider>
        </RelatoriosProvider>
    )
}

const InputDe = memo(({dataDe, mudar}) => {
    return (
        <>
            <label htmlFor='dataDe'>De:</label>
            <input 
            id='dataDe' 
            type={'date'} 
            value={dataDe} 
            max={new Date().toLocaleDateString('en-CA')} 
            onChange={e => mudar(e.target.value)} />
        </>
    )
})
const InputAte = memo(({dataDe, dataAte, mudar}) => {
    return (
        <>
            <label htmlFor='dataAte'>Até:</label>
            <input 
            id='dataAte' 
            type={'date'} 
            value={dataAte} 
            min={dataDe} 
            onChange={e => mudar(e.target.value)} />
        </>
    )
})

const RelatoriosElement = () => {
    const { relatorios, carregar, isRefreshing } = useRelatorios()

    const [dados, setDados] = useState({})
    const [dataDe, setDataDe] = useState(getDataDeInicial())
    const [dataAte, setDataAte] = useState(dataDe)
    
    const {orderNote} = useOrderNote()

    useEffect(() => {
        buildData()
    }, [relatorios])

    useEffect(() => {
        _carregar()
    }, [])

    function _carregar(){
        carregar({periodos: [{dataInic: dataDe, dataFim: dataAte}]})
    }

    function getDataDeInicial(){
        const dataAtual = new Date()

        if (dataAtual.getHours() >= 10) return dataAtual.toISOString().split('T')[0]

        dataAtual.setDate(dataAtual.getDate() - 1)
        return dataAtual.toISOString().split('T')[0]//.toLocaleDateString('en-CA')
    }


    function buildData(){
        const finalizados = relatorios.filter(e => e.status === 'FINALIZADO')
        const pendentes = relatorios.filter(e => e.status === 'PENDENTE')
        const cancelados = relatorios.filter(e => e.status === 'CANCELADO')
        const naoCancelados = [...finalizados, ...pendentes]
        const entregas = naoCancelados.filter(e => e.tipo === 'ENTREGA')

        setDados({
            naoCancelados: {
                count: naoCancelados.length,
                valorPago: naoCancelados.reduce(
                    (max, current) => max + current.pagamentos
                    .filter(e => e.status === 1)
                    .reduce((a, b) => a + b.valorPago, 0),
                    0
                ),
            },
            pendentes: {
                count: pendentes.length,
                valorFalta: pendentes.reduce(
                    (max, current) => max + (current.valor - current.pagamentos
                    .filter(e => e.status === 1)
                    .reduce((a, b) => a + b.valorPago, 0)),
                    0
                ),
            },

            cancelados: {
                count: cancelados.length,
                valor: cancelados.reduce(
                    (max, current) => max + current.valor, 0
                )
            },

            entregas: {
                count: entregas.length,
                taxas: entregas.reduce(
                    (max, current) => max + (isNaN(current.endereco?.taxa) ? 0 : current.endereco?.taxa), 0
                )
            }
        })
    }

    return (
        <Container>
            <section className='filtro-container'>
                
                <InputDe dataDe={dataDe} mudar={setDataDe} />
                <InputAte dataDe={dataDe} dataAte={dataAte} mudar={setDataAte} />
                
            
                <button onClick={() => _carregar()}>Filtrar</button>
            </section>
            <ul>
                {relatorios.sort((a, b) => new Date(a.dataInic) > new Date(b.dataInic) ? -1 : 1).map(pedido => (
                    <Pedido key={pedido.id} pedido={pedido} abrir={() => orderNote(pedido, false)} />
                    ))}
            </ul>
            <section className='info-container'>
                {dados?.naoCancelados?.count > 0 && (
                    <div className='info resultados' 
                    style={{ backgroundColor: cores.verde }}
                    title='Corresponde à todos os valores recebidos.'
                    >
                        <div className='esq'>
                            <FontAwesomeIcon icon={faCheck} />
                        </div>

                        <div className='dir'>
                            <h4>Resultados</h4>
                            <small>{dados.naoCancelados.count} Pedidos | </small>
                            <small>{formatReal(dados.naoCancelados.valorPago)}</small>
                        </div>
                    </div>
                )}

                {dados?.entregas?.count > 0 && (
                    <div className='info entregas' 
                    style={{ backgroundColor: cores.azul }}
                    title='Corresponde à todos os valores recebidos (incluindo de pedidos pendentes).'
                    >
                        <div className='esq'>
                            <FontAwesomeIcon icon={faTruck} />
                        </div>

                        <div className='dir'>
                            <h4>Entregas</h4>
                            <small>{dados.entregas.count} Pedidos | </small>
                            <small>{formatReal(dados.entregas.taxas)}</small>
                        </div>
                    </div>
                )}

                {dados?.pendentes?.count > 0 && (
                    <div className='info pendentes' 
                    style={{ backgroundColor: cores.vermelho, color: 'white' }}
                    title='Pedidos que contêm valores pendentes de pagamento.'
                    >
                        <div className='esq'>
                            <FontAwesomeIcon icon={faHandHoldingUsd} />
                        </div>

                        <div className='dir'>
                            <h4>Pendências</h4>
                            <small>{dados.pendentes.count} Pedidos | </small>
                            <small>{formatReal(dados.pendentes.valorFalta)}</small>
                        </div>
                    </div>
                )}

                {dados?.cancelados?.count > 0 && (
                    <div className='info cancelados' 
                    style={{ backgroundColor: cores.roxo, color: 'white' }}
                    title='Pedidos cancelados, não contabiliza em resultados e taxas de entrega.'
                    >
                        <div className='esq'>
                            <FontAwesomeIcon icon={faBan} />
                        </div>

                        <div className='dir'>
                            <h4>Cancelamentos</h4>
                            <small>{dados.cancelados.count} Pedidos | </small>
                            <small>{formatReal(dados.cancelados.valor)}</small>
                        </div>
                    </div>
                )}
            </section>
            {isRefreshing && (<Refreshing />)}
        </Container>
    )
}

const Container = styled.div`
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;

    .filtro-container{
        padding: 10px;
    }


    ul {
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px;

        li {
            min-height: 10px;
        }
    }

    .info-container {
        height: 80px;
        display: flex;
        gap: 5px;
        flex-shrink: 0;
        justify-content: flex-start;
        align-items: center;
        padding: 5px;
        overflow-x: auto;

        .info {
            display: flex;
            border: 1px solid black;
            border-radius: 15px;
            /* box-shadow: 1px 1px 5px rgba(0,0,0,.5); */
            padding: 10px;
            flex-shrink: 0;
            *{user-select: none;}
            cursor: pointer;
            transition: all .2s ease-out;
            &:hover{
                transform: scale(.9);
            }

            .esq {
                /* width: 30px; */
                padding: 0 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                svg {
                    font-size: 1.5rem;
                }
            }
            .dir {
                flex-grow: 1;
                *{line-height: 10px;}
            }
        }
    }
`
