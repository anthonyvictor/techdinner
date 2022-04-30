import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faTimes } from '@fortawesome/free-solid-svg-icons'
import { CorTipo, IcoTipo } from '../../../../util/pedidoUtil'
import { isNEU, isMobile } from '../../../../util/misc'
import { useHome } from '../../../../context/homeContext'
import { usePedido } from '..'
import * as cores from '../../../../util/cores'

export const Topo = () => {
    const { curr, fecharPedido, openSelectBox } = useHome()
    const { mudarTipo } = usePedido()

    function openSelectBoxTipo() {
        openSelectBox(
            <div className='container tipo'>
                <h4>Selecione o tipo:</h4>
                <ul className='tipo-lista'>
                    <li
                        className={`caixa${curr.tipo === 'CAIXA' ? ' disabled' : ''}`}
                        key={0}
                        onClick={() => mudarTipo(0)}
                    >
                        CAIXA
                    </li>
                    <li
                        className={`entrega${
                            !(Number(curr?.cliente?.id) > 0) || curr.tipo === 'ENTREGA' ? ' disabled' : ''
                        }`}
                        key={1}
                        onClick={() => mudarTipo(1)}
                    >
                        ENTREGA
                    </li>
                </ul>
                <p className='rodape'>TechDinner - Sistema de pedidos</p>
            </div>
        )
    }

    function getTipoBackColor() {
        return !isNEU(curr.tipo) ? CorTipo(curr.tipo) : 'transparent'
    }
    function getDateTime(){
        const convert = (d) => new Date(d).toLocaleString('pt-BR')
        const convertShort = (d) => new Date(d).toLocaleDateString('pt-BR', {dateStyle: 'short'})
        if(isMobile()){
            return convertShort(curr?.dataInic)
        }else{
            return `Data: ${convert(curr?.dataInic)}`
        }
    }
    return (
        <Container corTipo={getTipoBackColor()}>
            <div className='id'>
            {
            curr.id > 0 ? 
            (
                <>
                    <span className='noMobile'>
                        Pedido
                    </span>
                <span>#{curr.id}</span>
                </>
            ) : 'Pedido Novo!'
            }
            </div>
            <div className='data'>
                {getDateTime()}
            </div>
            <div className='tipo'>
                {!isMobile() && <label>Tipo:</label>}
                <button
                    className='tipo-botao'
                    style={curr?.tipo && { backColor: CorTipo(curr.tipo) }}
                    onClick={() => openSelectBoxTipo()}
                >
                    <>
                        <FontAwesomeIcon icon={IcoTipo(curr?.tipo)} />
                        <label>{curr?.tipo ?? 'ALTERAR'}</label>
                    </>
                </button>
            </div>
            <div className='botoes'>
                {!isMobile() && (
                    <button className='opcoes'>
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                )}
                <button className='close' onClick={() => fecharPedido(curr)}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        </Container>
    )
}

const Container = styled.div`
    overflow: hidden;
    display: flex;
    background-color: whitesmoke;
    border-bottom: 1px solid gray;
    padding: 2px;
    flex-shrink: 0;
    * {
        color: ${cores.cinzaEscuro};
    }
    align-items: center;
    & > div {
        display: flex;
        justify-content: center;
        user-select: none;
        gap: 5px;
        padding: 0 5px;
    }
    .id {
        flex-grow: 1;
    }
    .data {
        flex-grow: 2;
    }
    .tipo {
        flex-grow: 3;
        align-items: center;
        display: flex;
        justify-content: center;

        .tipo-botao {
            border: none;
            background-color: transparent;
            margin-left: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            padding: 5px;
            cursor: pointer;

            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    * {
                        color: black;
                    }
                }
            }

            * {
                pointer-events: none;
                color: ${props => props.corTipo};
                font-size: 15px;
                font-weight: 600;
            }
        }
    }
    > .botoes {
        flex-grow: 0;
        width: 120px;
        display: flex;
        gap: 2px;

        @media (max-width: 760px) {
            width: 60px;
        }

        button {
            border: none;
            background-color: transparent;
            cursor: pointer;
            flex-grow: 2;
            * {
                pointer-events: none;
            }
            &:hover {
                * {
                    color: black;
                }
            }
        }
    }

    @media (max-width: 550px) {
        padding: 10px 2px;
        > div {
            font-size: 0.8rem;
        }
    }
`
