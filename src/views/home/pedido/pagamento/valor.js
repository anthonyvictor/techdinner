import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { getValorPendente } from '../../../../util/pedidoUtil'
import { usePagamentos } from './pagamentos'
import { formatReal } from '../../../../util/Format'
import { useContextMenu } from '../../../../components/ContextMenu'
import { UltimosPagamentos } from './ultimosPagamentos'

export const Valor = () => {
    const { fakePedido, valorInputRef, inputValue, setInputValue,
        divisor, setDivisor, frozenValue, setFrozenValue, 
        dividedValueCount, setDividedValueCount, } = usePagamentos()
    const {contextMenu} = useContextMenu()
    const [ultimosPagamentos, setUltimosPagamentos] = useState(<></>)

    useEffect(() => {
        if(divisor > 1 && dividedValueCount > divisor){
            setDivisor(1)
            setDividedValueCount(0)
        }
    }, [dividedValueCount])

    function handleBlur(event) {
        event.preventDefault()
        const valorPendente = getValorPendente(fakePedido)
        if(event.target.value > valorPendente) setInputValue(valorPendente)  
    }

    function openMenu(){

        contextMenu([
            {title: 'Dividir..', click: openMenuDividir, enabled: inputValue > 0},
            {title: 'Últimos pagamentos', click: openUltimosPagamentos, enabled: fakePedido?.cliente?.id > 0},
        ])

    }

    function openMenuDividir(){
        const opcoes = [2,3,4,5,6].map(e => { return {
            title: `Por ${e} (${formatReal((inputValue / e).toFixed(2))} cada)`, 
            click: () => dividir(e)
        }})
        contextMenu(opcoes)
    }

    function dividir(x){
        setDividedValueCount(1)
        setFrozenValue((inputValue / x).toFixed(2))
        setDivisor(x)
    }

    function openUltimosPagamentos(){
        setUltimosPagamentos(<UltimosPagamentos clienteId={fakePedido?.cliente?.id} fechar={() => setUltimosPagamentos(<></>)} />)
    }

    return (
        <Container>
            <input
                type={'number'}
                autoFocus
                ref={valorInputRef}
                onBlur={handleBlur}
                disabled={divisor > 1}
                max={divisor > 1 ? frozenValue : getValorPendente(fakePedido, true)}
                min={0}
                step={.5}
                value={divisor > 1 ? frozenValue : inputValue} //Number(inputValue).toFixed(2)
                pattern={/[0-9]*[,]{0,1}[0-9]{0,2}/}
                onChange={e => setInputValue(e.target.value)}
                onWheel={e => {
                    const pendente = getValorPendente(fakePedido, true)
                    const direcao = e.deltaY > 0 ? 'down' : 'up'
                    const proximo = Number(e.target.value) + 0.5
                    const anterior = Number(e.target.value) - 0.5
                    if(direcao === 'up' && proximo > pendente){
                        setInputValue(pendente.toFixed(2))
                    }else if(direcao === 'down' && anterior >= 0){
                        setInputValue(anterior.toFixed(2))
                    }else if(direcao === 'down'){
                        setInputValue(0)
                    }
                }}
            />
            <button onClick={openMenu}>
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            {ultimosPagamentos}
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    gap: 5px;
    padding: 5px;
    input {
        font-size: 30px;
        flex-grow: 1;
        text-align: center;
    }
    button {
        width: 70px;
    }
`
