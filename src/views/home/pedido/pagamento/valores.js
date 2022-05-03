import React from 'react'
import styled from 'styled-components'
import { cores } from '../../../../util/cores'
import { formatReal } from '../../../../util/Format'
import { getValorPago, getValorPendente } from '../../../../util/pedidoUtil';

export const Valores = ({pedido}) => {
    
    if(!pedido) return <></>

    return (
        <Container>
            <span>
                <h3 className='pago'>{formatReal(getValorPago(pedido))}</h3>
                <h6>Valor Pago</h6>
            </span>
            <span>
                <h2 className='pendente'>{formatReal(getValorPendente(pedido))}</h2>
                <h6>Valor Pendente</h6>
            </span>
            <span>
                <h3 className='total'>{formatReal(pedido?.valor)}</h3>
                <h6>Valor Total</h6>
            </span>
        </Container>
    )
}

const Container = styled.div`
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6%;

    > span {
        display: flex;
        flex-direction: column;
        justify-content: center;
        * {
            text-align: center;
        }
    }

    .pago {
        color: ${cores.verdeEscuro};
    }
    .pendente {
        color: ${cores.vermelhoDark};
    }
    .total {
        color: ${cores.dark};
    }
`
