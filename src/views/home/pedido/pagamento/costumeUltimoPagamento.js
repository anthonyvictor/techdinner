import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useApi } from '../../../../api'

const CostumeUltimoPagamento2 = ({ clienteId }) => {
    const { api } = useApi()
    const [costumeUltimoPagamento, setCostumeUltimoPagamento] = useState(null)

    useEffect(() => {
        getCostumeUltimoPagamento().then(data => {
            setCostumeUltimoPagamento(data)
        })
    }, [])

    async function getCostumeUltimoPagamento() {
        if (clienteId) {
            const payload = {
                cliente: { id: clienteId },
            }
            const res = await api().get('clientes/pagamento/costumeultimo', { params: payload })
            return res?.data ?? ''
        }
        return ''
    }

    if (!clienteId) return <></>

    return (
        <Container className='costume'>
            {costumeUltimoPagamento?.costume && (
                <span>
                    <label>Costuma pagar </label>
                    <label>{costumeUltimoPagamento.costume}</label>
                </span>
            )}
            {costumeUltimoPagamento?.ultimo && (
                <span>
                    <label> | Ult. pagamento foi </label>
                    <label>{costumeUltimoPagamento.ultimo}</label>
                </span>
            )}
        </Container>
    )
}

export const CostumeUltimoPagamento = React.memo(CostumeUltimoPagamento2)

const Container = styled.div`
    * {
        font-size: 12px;
        font-style: italic;
    }
`
