import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Valores } from './valores'
import { getValorPendente } from '../../../../util/pedidoUtil'
import { Formas } from './formas'
import { AvancarButton } from '../../../../components/AvancarButton'
import { CostumeUltimoPagamento } from './costumeUltimoPagamento'
import { Valor } from './valor'
import { Lista } from './lista'

const PagamentosContext = createContext()

export const Pagamentos = ({ pedido, pagamento, callback, cancel }) => {
  
  const [fakePedido, setFakePedido] = useState(
    pedido || pagamento
    ? {
      cliente: pedido?.cliente,
      pagamentos: pagamento ? [] : pedido?.pagamentos ?? [],
      valor: pagamento ? pagamento.valorPago || 0 : pedido?.valor || 0,
    }
    : null
    )
    
    const [pagamentosCount, setPagamentosCount] = useState(fakePedido.pagamentos.length)
    const [inputValue, setInputValue] = useState(0)
    const [divisor, setDivisor] = useState(1)
    const [dividedValueCount, setDividedValueCount] = useState(1)
    const [frozenValue, setFrozenValue] = useState(0)

    const valorInputRef = useRef()
   
    function addPagamento(newPagamento) {
        if (newPagamento.valorPago > 0 && fakePedido.valor - getTotalPago() >= newPagamento.valorPago) {
            const newPagamentoArray = [...fakePedido.pagamentos, newPagamento]
            setFakePedido(prev => {
                return { ...prev, pagamentos: newPagamentoArray }
            })
            setPagamentosCount(prev => prev + 1)

            const valorNaLista = newPagamentoArray.reduce((max, current) => max + current.valorPago, 0)
            if (fakePedido.valor === valorNaLista) {
                callback(newPagamentoArray, pagamento)
            }else if(divisor > 1){
              setDividedValueCount(prev => prev + 1)
            }
        }
    }
    function removePagamento(pagamento) {
        setFakePedido(prev => {
            return { ...prev, pagamentos: prev.pagamentos.filter(e => e.id !== pagamento.id) }
        })
    }

    function getTotalPago() {
        return fakePedido.pagamentos.reduce((max, current) => max + current.valorPago, 0)
    }

    return (
        <PagamentosContext.Provider
            value={{
                getTotalPago,
                fakePedido, pedido,
                setFakePedido,
                pagamento,
                callback, cancel,
                valorInputRef,
                pagamentosCount,
                addPagamento,
                removePagamento,
                inputValue,
                setInputValue,

                divisor, setDivisor,
                frozenValue, setFrozenValue,
                dividedValueCount, setDividedValueCount,
            }}
        >
            <Pagamentos2 />
        </PagamentosContext.Provider>
    )
}

export const usePagamentos = () => {
    return useContext(PagamentosContext)
}

const Pagamentos2 = () => {
    const { fakePedido, pedido, callback, cancel, pagamento, setInputValue } = usePagamentos()

    useEffect(() => {
      const pendente = getValorPendente(fakePedido, true)
      //const sobra = pendente % 0.05
      // const faltaPraFixar = sobra > 0 ? 0.05 - sobra : 0
        // setInputValue((pendente + faltaPraFixar).toFixed(2))
        setInputValue((pendente).toFixed(2))
    }, [fakePedido])

    if (!fakePedido) return <></>
    return (
        <Container className='container'>
            <CostumeUltimoPagamento clienteId={fakePedido?.cliente?.id} />

            <div className='top'>
                <Valor />
                <Formas />
                <Valores pedido={fakePedido} />
            </div>

            <div className='middle'>
                <Lista />
            </div>

            <div className='bottom'>
                <AvancarButton avancar={() => {
                    console.log('aa')
                    const fakePagamento = 
                    fakePedido.pagamentos.some(e => String(e.id).includes('fake'))
                    
                    const ordem = (a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0
                    const getIds = (p) => p.sort(ordem).map(e => e.id).join()
                    const pagamentosMudados = 
                    getIds(fakePedido.pagamentos) !== getIds(pedido.pagamentos) 
                    
                    if(fakePagamento){
                        callback(fakePedido.pagamentos, pagamento)
                    }else if(pagamentosMudados){ 
                        callback(fakePedido.pagamentos)
                    }else{
                        cancel()
                    }
                }} />
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

    label,
    p,
    h2,
    h3,
    h4,
    h5,
    h6 {
        pointer-events: none;
        user-select: none;
    }

    .top {
        width: 100%;
    }

    .middle {
        flex-grow: 2;
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;
        flex-grow: 0;
    }

    > .bottom {
        width: 100%;
    }
`
