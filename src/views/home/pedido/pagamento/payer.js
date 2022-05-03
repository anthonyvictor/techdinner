import React, { createContext, useContext, useState } from 'react'
import styled from 'styled-components'
import { Pagamentos } from './pagamentos'
import { cores } from '../../../../util/cores'
import { FecharButton } from '../../../../components/FecharButton'

const PayerContext = createContext()

export function PayerProvider({children}) {
    const [component, setComponent] = useState(<></>)

    async function payer(props) {
        try{
            if(!props) throw new Error('fechando payer...')
            const {pedido, pagamento, callback} = props
            if ((pedido || pagamento) && callback) {
                const p = new Promise((resolve, reject) => {
                    setComponent(<Payer2 pedido={pedido} pagamento={pagamento} 
                        callback={(newPagamentos, oldPagamento) => {
                            callback(newPagamentos, oldPagamento)
                            resolve(newPagamentos)
                        }} cancel={reject} />)
                })
                const res = await p
                payer()
                return res
            } else {
                throw new Error('props não definidas corretamente ( (pedido ou pagamento) + callback )')
            }
        }catch(err){
            setComponent(<></>)
            return null
        }
    }

    return (
        <PayerContext.Provider value={{payer}}>
            {children}
            {component}
        </PayerContext.Provider>
    )
}

export const usePayer = () => {
    return useContext(PayerContext)
}

const Payer2 = (props) => {
    const { pedido, pagamento, callback } = props
    const {payer} = usePayer()

    function fechar(event){
        if(!event || event.target === event.currentTarget){
            payer()
        }
    }
    return (
        <PagamentosEditorContainer className='PAGAMENTOSEDITOR' onClick={fechar}>
            <Pagamentos pedido={pedido} pagamento={pagamento} callback={callback} cancel={() => fechar()} />
            <FecharButton fechar={() => fechar()} />
        </PagamentosEditorContainer>
    )
}

const PagamentosEditorContainer = styled.div`
    position: absolute;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    *{user-select: none;}

    @keyframes cima-baixo{
      from{
          transform: translateY(-100%);
          opacity: 0;
        }
        to{
          transform: translateY(0);
          opacity: 1;
      }
    }

    >.container{
        animation: cima-baixo 0.15s ease-out;
        background-color: ${cores.branco};
        padding: 10px;
        border-radius: 20px;
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2px;
    }

`
