import React, { createContext, useContext, useState, useEffect } from 'react'
import { box } from '../box'
import { Pagamento } from './pagamentoLi'
import { Pagamentos } from './pagamentos'
import { formatReal } from '../../../../util/Format';
import styled from 'styled-components';
import { useHome } from '../../../../context/homeContext';
import * as cores from '../../../../util/cores'
import { join } from '../../../../util/misc';

import { Valores } from './valores';
import { usePedido } from '..';

const BoxPagamentosContext = createContext()

export const BoxPagamentos = () => {

    return (
        <BoxPagamentosContext.Provider value={{}}>
                <BoxPagamentos2 />
        </BoxPagamentosContext.Provider>
    )
}

export const useBoxPagamentos = () => {
    return useContext(BoxPagamentosContext)
}

const BoxPagamentos2 = () => {

    const {curr, openSelectBox, closeSelectBox} = useHome()
    const {mudarPagamento} = usePedido()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [fixedSize, setFixedSize] = useState('')
    const [myClassName, setMyClassName] = useState(undefined)

    useEffect(() => {
        getMyClassName()
    }, [isCollapsed, fixedSize])

    useEffect(() => {
        getFixedSize()
    }, [curr?.pagamentos])

    const toggleIsCollapsed = () => {
        setIsCollapsed(prev => !prev)
    } 

    const getFixedSize = () => {
        const pagamentosCount = curr?.pagamentos?.length || 0

        const newSize = 
        pagamentosCount > 5 ? 'superlarge'
        : pagamentosCount > 2 ? 'large'
        : pagamentosCount > 1 ? 'bigger'
        : pagamentosCount > 0 ? 'big' 
        : ''

        setFixedSize(newSize) 
    }

    function getMyClassName() {
        const base = 'box'
        const collapsed = isCollapsed ? 'collapsed' : ''
        const size = !isCollapsed ? fixedSize : ''
        setMyClassName(join([base, collapsed, size], ' '))
    }

    function openMenu(pagamento){
        openSelectBox(
          <Pagamentos pedido={curr} callback={mudarPagamento} cancel={closeSelectBox} pagamento={pagamento} />
        )
      }

    return (
        <Container className={myClassName}>

            <div className='top pagamento'>
                <button className='principal' onClick={() => openMenu()}>PAGAMENTO</button>
                <button className='secondary' onClick={() => toggleIsCollapsed()}>_</button>
            </div>

            <div className='content'>
                <Valores pedido={curr} />
                <ul className='pagamentos-ul'>
                    {curr?.pagamentos?.map(pagamento => 
                    <Pagamento key={pagamento.id} 
                    pagamento={pagamento} 
                    setPagamento={mudarPagamento} />)}
                </ul>
            </div>

            {curr?.pagamentos?.length > 0 && (
                <label className='bottom'>
                    Total de pagamentos: {curr.pagamentos.length} |{' '}
                    {formatReal(curr.pagamentos.reduce((a, b) => a + b.valorPago, 0))}
                </label>
            )}

        </Container>
    )
}


const Container = styled(box)`

>.top{background-color: ${cores.verde}}
display: flex; 
    min-height: 90px;
    &.big:not(.collapsed){
      min-height: 190px;
    }
    &.bigger:not(.collapsed){
      min-height: 250px;
    }
    &.large:not(.collapsed){
      min-height: 380px;
    }
    &.superlarge:not(.collapsed){
      min-height: 420px;
    }
    .content{
      display: flex;
      flex-direction: column;
      flex-grow: 2;
      overflow-y: auto;
      gap: 5px;

      .pagamentos-ul{
        display: flex;
        flex-direction: column;
        padding: 0 5px 5px 5px;
        overflow-y: auto;
        flex-grow: 2;
      }
    }

    > .bottom{
      display: flex;
      padding: 5px;
      background-color: ${cores.branco};
      border-top: 1px solid black;
      color: ${cores.cinzaDark};
    }`
