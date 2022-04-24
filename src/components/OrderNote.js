import React, { createContext, useContext, useState } from 'react'
import styled from 'styled-components'
import { useApi } from '../api'
import * as cores from '../util/cores'
import { formatCNPJ, formatEndereco, formatLitro, formatPhoneNumber, formatReal } from '../util/Format'
import { isNEU, join } from '../util/misc'
import { getInfoSecundarias, getItensAgrupados, getSaboresDescritos, getTituloPagamento } from '../util/pedidoUtil'
import { FecharButton } from './FecharButton'

const OrderNoteContext = createContext()
export const OrderNoteProvider = ({ children }) => {
    const [component, setComponent] = useState(<></>)

    function orderNote(pedido) {
        try {
            if (!pedido) throw new Error()
            setComponent(<OrderNote pedido={pedido} fechar={orderNote} />)
        } catch {
            setComponent(<></>)
            return null
        }
    }

    return (
        <OrderNoteContext.Provider value={{ orderNote }}>
            {children}
            {component}
        </OrderNoteContext.Provider>
    )
}

export const useOrderNote = () => {
    return useContext(OrderNoteContext)
}

const OrderNote = props => {
    const { pedido, fechar } = props
    const { user } = useApi()

    const [itensAgrupados] = useState(getItensAgrupados(pedido))

    function getReimpressao() {
        if (pedido.impr > 0) {
            return (
                <div className='reimpressao-container'>
                    <h5>**Reimpressão Nº {pedido.impr + 1}**</h5>
                    <strong>-----</strong>
                </div>
            )
        }
        return <></>
    }

    function getInfoEstabelecimento() {
        if (user.enterprise) {
            return (
                <div className='estabelecimento-container'>
                    <i className='estabelecimento-nome'>{user.enterprise?.name}</i>
                    <br />
                    <small className='super-super-small'>{user.enterprise?.address}</small>
                    <section className='cnpj-tel-container'>
                        <small className='super-small'>CNPJ: {formatCNPJ(user.enterprise?.cnpj)}, </small>
                        <small className='super-small'>
                            TEL: {formatPhoneNumber(user.enterprise?.phoneNumber, false)}
                        </small>
                    </section>
                </div>
            )
        }
        return <></>
    }

    function getInfoPedido() {
        return (
            <div className='pedido-container'>
                <section className='sessao id-data-section'>
                    <h5>
                        PED#{pedido.id},{' '}
                        {new Date(pedido.dataInic).toLocaleString('pt-BR', {
                            day: 'numeric',
                            month: 'numeric',
                            year: '2-digit',
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </h5>
                </section>
                <section className='cliente-container super-small'>
                    <p>
                        Cliente: {pedido.cliente.nome}
                        {!pedido.cliente.id && <b> (s/cadastro)</b>}
                    </p>
                    {pedido.cliente?.contato && (
                        <p>Contato: {pedido.cliente.contato.map(e => formatPhoneNumber(e, false, false)).join(', ')}</p>
                    )}
                </section>
            </div>
        )
    }

    function getInfoTipo() {
        if (pedido.tipo === 'CAIXA') {
            return (
                <section className='tipo-container'>
                    <h3>PARA RETIRAR NO CAIXA</h3>
                </section>
            )
        } else if (pedido.tipo === 'ENTREGA') {
            return (
                <section className='tipo-container'>
                    <h5>
                        {'>'} PARA ENTREGA ({formatReal(pedido.endereco.taxa)})
                    </h5>
                    <p className='super-small'>{formatEndereco(pedido.endereco, false, true, false)}</p>
                </section>
            )
        } else if (pedido.tipo === 'APLICATIVO') {
            return (
                <section className='tipo-container'>
                    <h3>TIPO: APLICATIVO</h3>
                </section>
            )
        } else {
            return (
                <div>
                    <h3>TIPO NÃO RECONHECIDO</h3>
                </div>
            )
        }
    }

    function getTitulo(item) {
        const x = item.ids ? `* ${item.ids.length} * ` : ''

        const pizza =
            item.tipo === 0
                ? `PIZZA${item.ids ? 'S TAM.' : ''} ${item.pizza.tamanho.nome} | 
                        ${item.pizza.sabores.length} 
                        SABOR${item.pizza.sabores.length > 1 ? 'ES' : ''}`
                : ''

        const bebida =
            item.tipo === 1
                ? join([item.bebida.nome, item.bebida.sabor ?? '', formatLitro(item.bebida.tamanho)], ' ')
                : ''

        const hamburguer = item.tipo === 2 ? 'HAMBURGUER' : ''
        const outro = item.tipo === 3 ? item.outro.nome : ''

        const res = join([pizza, bebida, hamburguer, outro], '')

        return isNEU(res) ? 'ITEM DESCONHECIDO' : x + res
    }

    function getInfoPizzas() {
        const pizzas = itensAgrupados.filter(e => e.tipo === 0) || []
        if (pizzas.length > 0) {
            return (
                <div className='pizzas-container'>
                    <section className='sessao pizzas-section'>
                        <h5>PIZZAS</h5>
                    </section>
                    <ul className='lista-pizzas'>
                        {pizzas.map(e => (
                            <li key={e.id ?? e.ids.join(',')} className={'pizza'}>
                                <h5>{getTitulo(e)}</h5>
                                {getInfoSecundarias(e) && <i>{getInfoSecundarias(e)}</i>}
                                {e.observacoes && <b>*** Obs: {e.observacoes}</b>}
                                <small>{formatReal(e.valor)}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        } else {
            return <></>
        }
    }

    function getInfoBebidasOutros() {
        const bebidas = itensAgrupados.filter(e => e.tipo === 1) || []
        const outros = itensAgrupados.filter(e => e.tipo === 3) || []
        const arr = [...bebidas, ...outros]
        if (arr.length > 0) {
            return (
                <div className='bebidas-outros-container'>
                    <section className='sessao bebidas-outros-section'>
                        <h5>BEBIDAS / OUTROS</h5>
                    </section>
                    <ul className='lista-bebidas-outros'>
                        {arr.map(e => (
                            <li key={e.id ?? e.ids.join(',')} className={'bebida-outro'}>
                                <h5>{getTitulo(e)}</h5>
                                <small>
                                    {getInfoSecundarias({
                                        ...e,
                                        bebida: { ...e.bebida, tipo: '' },
                                    })}
                                </small>
                                <small className='super-small'>{formatReal(e.valor)}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        } else {
            return <></>
        }
    }

    function getInfoTotal() {
        return (
            <div className='total-container'>
                <b>---------------------------------</b>
                <b>TOTAL: {formatReal(pedido.valor)}</b>
                <b>---------------------------------</b>
            </div>
        )
    }

    function getInfoPagamentos() {
        function getInfoSecundariasBottom(pagamento) {
            const trocoPara = `Troco p/${formatReal(pagamento.valorRecebido)} `
            const deTroco = `(${formatReal(pagamento.valorRecebido - pagamento.valorPago)} de troco)`

            return trocoPara + deTroco
        }

        if (pedido?.pagamentos?.length > 0) {
            return (
                <div className='pagamentos-container'>
                    <section className='sessao pagamentos-section'>
                        <h5>PAGAMENTOS</h5>
                    </section>
                    <ul className='lista-pagamentos'>
                        {pedido.pagamentos.map(e => (
                            <li key={e.id ?? e.ids.join(',')} className={'pagamento'}>
                                <h5>{getTituloPagamento(e)}</h5>
                                {e.valorRecebido && e.valorPago < e.valorRecebido && (
                                    <p className='info-secundarias bottom'>{getInfoSecundariasBottom(e)}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )
        } else {
            return <></>
        }
    }

    function getInfoImpressao(){
        return(
            <div className='impressao-container'>
                <small className='super-super-small impresso-por'>
                    Operador: {user.name.split(' ')[0]} 
                </small>
                <small className='super-super-small data-impressao'>
                    {new Date().toLocaleString('pt-br')}
                </small>
            </div>
        )
    }

    return (
        <Container
            onClick={e => {
                if (e.target === e.currentTarget) {
                    fechar()
                }
            }}
        >
            <main>
                <div className='print-area'>
                    {getReimpressao()}
                    <div className='doc-fiscal-container'>
                        <small className='super-small doc-fiscal'>*Não é um documento fiscal válido*</small>
                    </div>
                    {getInfoEstabelecimento()}
                    {getInfoPedido()}
                    {getInfoTipo()}
                    {getInfoPizzas()}
                    {getInfoBebidasOutros()}
                    {getInfoTotal()}
                    {getInfoPagamentos()}
                    {getInfoImpressao()}
                </div>
                <button className='imprimir-button'
                onClick={() => window.print()}>
                    IMPRIMIR
                </button>
            </main>
            <FecharButton fechar={() => fechar()} />
        </Container>
    )
}

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;

    z-index: 999;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    /* justify-content: flex-start; */
    justify-content: center;
    align-items: center;

    .super-small {
        font-size: 0.8rem;
    }

    .super-super-small {
        font-size: 0.6rem;
    }

    .sessao {
        margin-top: 20px;
        font-style: italic;
        * {
            display: inline;
        }
        text-align: center;

        &::before {
            margin-right: 5px;
            display: inline;
            content: '***';
        }
        &::after {
            display: inline;
            margin-left: 5px;
            content: '***';
        }
    }

    > main {
        width: 9.9cm;
        height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: ${cores.brancoEscuro};
        padding: 10px 0.1cm;
        border-radius: 20px;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
        animation: aparecer 0.2s linear;
        gap: 5px;
        user-select: none;

        .print-area {
            overflow-y: auto;
            padding: 5px;
            width: 100%;
            height: 100%;
            background-color: #ffea8c;
            border: 1px solid black;

            > *{
                margin: 0 auto;
            }

            .reimpressao-container{
                text-align: center;
            }

            .doc-fiscal-container {
                text-align: center;
            }

            .estabelecimento-container {
                text-align: center;
                line-height: 15px;

                i {
                    margin-bottom: 3px;
                }
            }

            .tipo-container {
                text-align: center;
            }

            .pizzas-container,
            .bebidas-outros-container {
                * {
                    line-height: 15px;
                }
                small,
                b {
                    font-size: 0.75rem;
                }
            }

            .pizzas-container {
                .lista-pizzas {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin: 0 auto;

                    .pizza {
                        display: flex;
                        flex-direction: column;
                        gap: 1px;

                        .preco {
                            display: block;
                        }
                    }
                }
            }
            .bebidas-outros-container {
                .lista-bebidas-outros {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;

                    .bebida-outro {
                        display: flex;
                        flex-direction: column;
                        gap: 1px;

                        .preco {
                            display: block;
                        }
                    }
                }
            }

            .total-container {
                margin: 15px 0;
                display: flex;
                flex-direction: column;
                text-align: center;
                line-height: 15px;
                font-style: italic;
            }

            .pagamentos-container {
                .lista-pagamentos {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;

                    .pagamento {
                        display: flex;
                        flex-direction: column;
                        gap: 1px;
                    }
                }
            }

            .impressao-container{
                margin: 20px 0;
                justify-content: center;
                display: flex;
                gap: 5px;
            }
        }

        .imprimir-button{
            width: 90%;
            min-width: 100px;
            border: 2px solid black;
            background-color: ${cores.verde};
            cursor: pointer;
            font-size: 18px;
            font-weight: 600;
            transition: all .2s ease-in-out;
            margin: 5px;
            height: 60px;

            &:hover{
                background-color: ${cores.amarelo};
                font-size: 20px;
            }
        }

        @media print {

            width: 100%;
            height: 100%;
            box-shadow: none;
            justify-content: flex-start;
            padding: 0;
            border-radius: 0;
            align-items: flex-start;
            
            .print-area {
                padding: 0;
                width: min(100%, 75mm);
                height: fit-content;
                overflow-y: visible;
                display: block;
                position: absolute;
                z-index: 999;
                border: none;
            }

            .imprimir-button{
                display: none;
            }
        }

        @keyframes aparecer {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    }
`
