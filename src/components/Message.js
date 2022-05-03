import React, { createContext, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { cores } from '../util/cores'
import useSound from "use-sound";
import errorSound from '../sounds/error01.wav';
const MessageContext = createContext()

const tempo = 5 //segundos
export default function MessageProvider({children}){
    const [component, setComponent] = useState(null)
    const [playError] = useSound(errorSound)

    useEffect(() => {
        if(component){
            const timer = setTimeout(() => {
                setComponent(null)    
            }, tempo * 1000);
            return () => {
                clearTimeout(timer)
                setComponent(null)
            }
        }   
    }, [component])

    const message = (type, text) => {
        if(type && text){
            let icon = null
            if(type === 'ok'){
                icon = <FontAwesomeIcon className={`icone ${type}`} icon={faCheckCircle} />
            }else if(type === 'error'){
                icon = <FontAwesomeIcon className={`icone ${type}`} icon={faTimesCircle} />

            }else if(type === 'info'){
                icon = <FontAwesomeIcon className={`icone ${type}`} icon={faInfoCircle} />
            }else if(type === 'alert'){
                icon = <FontAwesomeIcon className={`icone ${type}`} icon={faExclamationTriangle} />
            }
            
            if(icon){
                setComponent(
                <Container>
                    <div>
                        {icon}
                    </div>
                    <div>
                        <h5 className='text'>{text}</h5>
                    </div>
                    <button onClick={() => message()} className='close-button'>
                        <FontAwesomeIcon className='close-icon' icon={faTimesCircle} />
                    </button>
                </Container>
                )
                if(type === 'error'){
                    playError()
                }
            }
        }else{
            setComponent(null)
        }
    }
    return (
        <MessageContext.Provider value={{message}}>
            {children}
            {component && component}
        </MessageContext.Provider>
    )
}

export const useMessage = () => {
    return useContext(MessageContext)
}


const Container = styled.div`
    background-color: white;
    border-radius: 10px;
    box-shadow: 2px 2px 10px rgba(0,0,0,.5);
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -110%);
    height: 50px;
    min-width: 80px;
    display: flex;
    
    animation: getinout ease-in-out ${tempo}s;
    gap: 5px;
    justify-content: center;
    align-items: center;
    padding: 5px;

    @media (max-width: 550px){
        height: auto;
        width: 80vw;
    }

    @keyframes getinout{
        0%{
            transform: translate(-50%, -110%);
        }
        10%{
            transform: translate(-50%, 5px);
        }
        90%{
            transform: translate(-50%, 5px);
        }
        100%{
            transform: translate(-50%, -110%);
        }
    }

    @keyframes getin{
        from{
            top: -51px;
        }

        to{
            top: 5px;
        }
    }

    .icone{
        width: 40px;
        height: 40px;
        font-size: 2em; 
        &.ok{
            color: ${cores.verdeDark};
        }
        &.error{
            color: ${cores.vermelhoDark};
        }
        &.info{
            color: ${cores.azulDark};
        }
        &.alert{
            color: ${cores.amareloDark};
        }
    }

    .text{
        flex-grow: 2;
        font-style: italic;
    }

    .close-button{
        background-color: ${cores.brancoEscuro};
        border-radius: 50%;
        border: none;
        width: 30px;
        height: 30px;
        transform: translateX(13px);
        display: flex;
        justify-content: center;
        align-items: center;

        .close-icon{
            margin: 1px 0 0 1px;
            font-size: 25px;
            /* stroke: black;
            stroke-width: 10px; */
            color: white;
            cursor: pointer;

            @media(hover: hover) and (pointer: fine){
                &:hover{
                    color: ${cores.dark};
                }
            }
        }
    }


`