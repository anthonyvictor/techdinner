import React, { createContext, useContext, useState } from 'react'
import styled from 'styled-components'
import { AvancarButton } from '../../../../components/AvancarButton'
import { FecharButton } from '../../../../components/FecharButton'
import { useMessage } from '../../../../components/Message'
import { cores } from '../../../../util/cores'

const HoraContext = createContext()

export const HoraProvider = ({children}) => {
    const [component, setComponent] = useState(<></>)

    async function hora(min) {
        try{
            if(!min) throw new Error('fechando hora...')
            const p = new Promise((resolve, reject) => {
                setComponent(<Hora min={min} callback={resolve} cancel={reject} />)
            })
            const res = await p
            hora()
            return res
        }catch(err){
            setComponent(<></>)
            return null
        }
    }

    return (
        <HoraContext.Provider value={{hora}}>
            {children}
            {component}
        </HoraContext.Provider>
    )
}

export const useHora = () => {
    return useContext(HoraContext)
}

const Hora = ({min, callback, cancel}) => {
    const [value, setValue] = useState(getMin())
    const {message} = useMessage()

    function getMin(){
            if(typeof min === 'object'){
                return min.toLocaleTimeString('pt-BR', {timeStyle: 'short'})
            }else{
                return min
            }
    }

    return(
        <Container onClick={e => {
            if(e.target === e.currentTarget){
                cancel()
            }
        }}>
            <form>
                <h2>Selecione a hora</h2>
                <input name={'hora'} min={getMin()} autoFocus type={'time'}
                value={value}
                onChange={e => setValue(e.target.value)}
                ></input>
                <AvancarButton type={'submit'} avancar={(e) => {
                    e.preventDefault()
                    if(value){
                        callback(value)
                    }else{
                        message('error', 'Digite uma hora válida!')
                    }
                    }} />
            </form>
            <FecharButton fechar={() => cancel()}/>
        </Container>
    )
}


const Container = styled.div`
    width: 100vw;
    height: 100%;
    position: absolute;
    z-index: 999;
    background-color: rgba(0,0,0,.6);
    display: flex;
    justify-content: center;
    align-items: center;

    @keyframes pequeno-normal{
        0%{
          transform: scale(0);
        }
        50%{
            transform: scale(0.3);
        }
        100%{
            transform: scale(1);
        }
    }

    > form{
        width: 300px;
        height: 150px;
        animation: pequeno-normal 0.2s ease-out;
        background-color: ${cores.branco};
        padding: 10px;
        border-radius: 20px;
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2px;

        input{
            
            font-size: 2rem;
        }

    }
`