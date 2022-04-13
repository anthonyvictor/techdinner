import React from 'react'
import styled from 'styled-components'
import { usePagamentos } from './pagamentos'
import {Pagamento} from './pagamentoLi'

export const Lista = () => {
    const { fakePedido, setFakePedido } = usePagamentos()

    function mudarPagamentoInterno(newPagamentos, oldPagamento){
        const newPagamentosArray = newPagamentos.length === 0 
        
        ? fakePedido.pagamentos.filter(e => e.id !== oldPagamento.id)
        
        : [
            ...fakePedido.pagamentos.map(o => {
                const newPagamento = newPagamentos.find(n => n.id === o.id)
                return newPagamento ?? o
            })
        ]
        setFakePedido({ ...fakePedido, pagamentos: newPagamentosArray })
    }
    return (
        <Container>
            {fakePedido.pagamentos.map(e => (
                <Pagamento key={e.id} pagamento={e} setPagamento={mudarPagamentoInterno} />
            ))}
        </Container>
    )
}

const Container = styled.ul`
    min-height: 10px;
    display: flex;
    flex-direction: column;
    padding: 0 5px 5px 5px;
    overflow-y: auto;
    flex-grow: 2;
    width: 100%;
`
