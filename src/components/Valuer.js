import { faBackspace } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { createContext, useContext, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import * as cores from '../util/cores'
import { AvancarButton } from './AvancarButton'
import { FecharButton } from './FecharButton'
import { RodapeTechDinner } from './RodapeTechDinner'

const ValuerContext = createContext()

export const ValuerProvider = ({children}) => {
    const [component, setComponent] = useState(<></>)

    async function valuer(value){
        if(!isNaN(value)){
            const p = new Promise((resolve, reject) => {
                setComponent(
                    <Valuer value={value} callback={resolve} cancel={reject}  />
                )
            })
            const res = await p
            valuer()
            return res
        }else{
            setComponent(<></>)
            return null
        }        
    }
    
    return (
        <ValuerContext.Provider value={{valuer}} >
            {children}
            {component}
        </ValuerContext.Provider>
    )
}

export const useValuer = () => {
    return useContext(ValuerContext)
}

const Valuer = (props) => {

    const [initialValue] = useState(Number(props.value) || 0)    
    const [value, setValue] = useState(initialValue)    
    const {callback} = props
    const inputRef = useRef()
    const [hasToken, setHasToken] = useState(false)
    const {valuer} = useValuer()

    function handleAvancar(event){
        event && event.preventDefault()
        avancar()
    }

    function avancar(finalValue){
        if(finalValue){
            callback(finalValue)
        }else{
            callback(value)
        }
    }

    function fechar(event){
        if(!event || (event && event.target === event.currentTarget)){
            valuer()
        }
      }

    function digito(key, next){
        const selected = window.getSelection().toString()
        if(next){
            avancar(key)
        }else if(key === 'Limpar'){
            setValue(0)
            setHasToken(false)
        }else if(key === ','){
            setHasToken(true)
        }else{
            if(selected.replace(',','.') === value.toString().replace(',','.')) {
                setValue(key)
            }else{
                const previous = hasToken ? String(value).replace('.', '') : String(value)
                const token = hasToken ? previous.length > 0 ? '.' : '0.' : ''
                const resp = `${previous}${token}${key}`
                setValue(Number(resp))
            }
            
            setHasToken(false)
        }
    }
    
    const DigitButton = ({myKey}) => {
        const style = {backgroundColor: (['Limpar',','].includes(myKey) ? cores.brancoEscuro : cores.brancoDark)}
        return (
            <button className='button-digito' type='button' style={style} onClick={() => digito(myKey)}>{myKey}</button>
            )
        }
        
        const SuggestionButton = ({myKey}) => {
            const imgSrc = require(`../images/${myKey}.jpg`) ?? ''
            return (
                <button className='button-suggestion' type='button' onClick={() => digito(myKey, true)}>
                <img src={imgSrc} alt={`${myKey}_reais`} />
            </button>
        )
    }
    
    function backspace(){
        const selected = window.getSelection().toString()

        if(selected === value.toString()) {
            digito('Limpar')
        }else{
            setValue(prev => Number(String(prev).substring(0, String(prev).length - 1)) )
        }

    }

    function inputOnChange(event){
        let txt = event.target.value.replace(/[^0-9.,]/,'')
        setValue(Number(txt))
    }
    const memoValue = useMemo(() => {
        let txt = String(value).replace(/^[0](.+)/,/$1/).replace('/','').replace('/','')
        if(txt.match(/^[.]/)) txt = `0${txt}`
        return txt
    }, [value])

    return (
        <Container 
        onClick={fechar}>
            <main className='container'>
                <h2>Digite o valor</h2>
                <div className='top'>
                    <input ref={inputRef} type={'number'} min={initialValue} placeholder={'R$ 0,00'} 
                    value={memoValue} autoFocus
                    onFocus={e => e.target.select()}
                    onChange={inputOnChange}
                    />
                    <button type='button' onClick={backspace}>
                        <FontAwesomeIcon icon={faBackspace} />
                    </button>
                </div>

                <div className='center'>
                    <aside className='buttons'>
                        {[1,2,3,4,5,6,7,8,9,'Limpar',0,','].map(e => (
                        <DigitButton key={e} myKey={e} />
                        ))}
                    </aside>
                    <aside className='suggestions'>
                        {[2, 5, 10, 20, 50, 100, 200].filter(e => e >= initialValue).slice(0, 4).map(e => (
                                <SuggestionButton key={e} myKey={e} />
                            )
                        )}
                    </aside>
                </div>

                <AvancarButton avancar={handleAvancar} disabled={value < initialValue || value - initialValue > 200} />

                <RodapeTechDinner />
            </main>
            <FecharButton fechar={() => fechar} />
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
    background-color: rgba(0,0,0,.6);
    display: flex;
    justify-content: center;
    align-items: center;

    > main{
        width: min(80vw, 500px);
        min-height: 100px;
        max-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: ${cores.branco};
        padding: 10px 20px;
        border-radius: 20px;
        box-shadow: 2px 2px 10px rgba(0,0,0,.8);
        animation: aparecer .2s linear;
        gap: 5px;
        user-select: none;
        overflow: hidden;


        @keyframes aparecer{
            from{opacity: 0}
            to{opacity: 1}
        } 

        .top{
            display: flex;
            gap: 5px;
            input{
                display: inline-block;
                font-size: 2rem;
                flex-grow: 1;
            }

            button{
                display: inline-block;
                font-size: 2rem;
                cursor: pointer;
                border: none;
                background-color: transparent;

                @media (hover: hover) and (pointer: fine){
                    &:hover{
                        color: ${cores.amareloDark};
                    }
                }
            }
        }

        .center{
            display: flex;
            width: 100%;
            gap: 10px;

            .buttons{
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(4, 1fr);
                grid-gap: 5px;
                flex-grow: 1;

                .button-digito{
                    border-radius: 10px;
                    border: 1px solid ${cores.cinzaDark};
                    font-size: 1.2rem;
                    font-weight: 600;
                    flex-grow: 1;
                    padding: 10px;
                    cursor: pointer;
                    transition: transform .2s;

                    @media (hover: hover) and (pointer: fine){

                        &:hover{
                            transform: scale(.95);
                            /* background-color: ${cores.cinza}; */
                        }
                    } 
                }
            }

            .suggestions{
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                gap: 5px;

                .button-suggestion{
                    width: 90px;
                    height: 40px;
                    cursor: pointer;
                    display: flex;
                    background-color: transparent;
                    border: none;
                    img{
                        border: 1px solid ${cores.cinzaDark};
                        width: 100%;
                        height: 100%;
                        object-fit: fill;
                        transition: transform .2s
                    }

                    &:hover{
                        img{
                            transform: scale(0.9)
                        }
                    }

                }
            }
        }
    }

`