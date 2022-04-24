import React, { createContext, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as cores from '../util/cores'

const AskContext = createContext()

function AskProvider({children}) {
    const [obj, setObj] = useState(null)
    const [component, setComponent] = useState(<></>)

    function fechar(e){
        if(e === true || e.target === e.currentTarget){
            setObj(null)
        }
    }

    /**
     * 
     * @param {object} obj 
     * Objeto precisa ter as keys:
     * @param 1 - title: 'Titulo da caixa'
     * @param 2 - buttons[]: Array contendo objetos com: {title: 'Nome do botão', click: função que o botão executará}
     * @param 3 - allowCancel: (true/false) Verifica se a caixa precisa ter um retorno válido ou não
     */
    function ask(_obj){
        setObj(_obj)
    }

    useEffect(() => {
            setComponent(obj ? <Ask /> : <></>);
    }, [obj])
    return (
        <AskContext.Provider value={{obj, ask, fechar}}>
            {children}
            {component}
        </AskContext.Provider>
    )
}

export default AskProvider;

export const useAsk = () => {
    return useContext(AskContext)
}


function Ask(){

    const {obj, fechar} = useAsk()

    if(!obj) return <></>
    return(
        <Container onMouseDown={(e) => {obj.allowCancel && fechar(e)}}>
            <div className='ask-container'>
                
                <div className='titulo'>
                    <h3>{obj.title}</h3>
                </div>
               
                <div className='botoes'>
                    {obj.buttons.map((e,i) => (
                        <button key={i} onClick={() => {
                            fechar(true)
                            e.click()
                        }}>{e.title}</button>
                    ))}
                </div>

                <p className='rodape'>TechDinner - Sistema de pedidos</p>
            </div>
        </Container>
    )
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 999;
    background-color: rgba(0,0,0,.6);
    display: flex;
    justify-content: center;
    align-items: center;

    @keyframes aparecer{
        from{opacity: 0}
        to{opacity: 1}
    } 

    .ask-container{
        width: min(90vw, 450px);
        min-height: 200px;
        display: flex;
        flex-direction: column;
        background-color: ${cores.branco};
        padding: 10px 20px;
        border-radius: 20px;
        box-shadow: 2px 2px 10px rgba(0,0,0,.8);
        animation: aparecer .2s linear;
        user-select: none;
        

        .titulo{
            width: 100% ;
            font-weight: 600;
            text-align: center;
            flex-grow: 2;
            display: flex;
            align-items: center;
            *{
                width: 100% ;
            }
        }

        .botoes{
            display: flex;
            width: 100% ;
            list-style: none;
            gap: 10px;
            margin-bottom: 10px;

            button{
                cursor: pointer;
                height: 40px;
                flex-grow: 2;
                background-color: ${cores.cinzaEscuro};
                color: white;
                outline: none;
                border: 1px solid black;
                border-radius: 5px;

                &:hover{
                    color: ${cores.amarelo};
                }
            }
        }

        .rodape{
            width: 100% ;
            padding: 10px;
            border-top: 1px solid gray;
            text-align: center;
            font-size: 10px;
            color: gray;
            padding: 0 10px;
        }
    }
`