import React from 'react';
import styled from 'styled-components';
import { useMainMenu } from '../../context/mainMenuContext';
import * as cores from '../../util/cores'

function SubMenu(props) {
    const { changeRoute } = useMainMenu()

function fechar(e){
    if (e.target === e.currentTarget){
        props.setSubMenu(null)
    }
}

function click(link){
    changeRoute(link)
    props.setSubMenu(null)
}
  return (
        <Container posi={props.posi} onClick={fechar}>
            
            <div className='sub-menu'>
            {props.arr.views.map((item) => (
                <button key={item.link} type='button' onClick={e => click(item.link)}>
                    {item.titulo}
                </button>
            ))}
            </div>

        </Container>
    )
}

export default SubMenu;

const Container = styled.div`
    background-color: transparent;
    width: calc(100vw - ${props => props.posi.left}px);
    left: ${props => props.posi.left}px;
    height: 100vh;
    position: absolute;
    overflow: hidden;
    z-index: 999;

    .sub-menu{
    background-color: ${cores.cinzaDark};
    min-width: 150px;
    position: absolute;
    left: 0;
    top: ${props => props.posi.top}px;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    animation: descer linear 0.2s;
    overflow-y: hidden;
    box-sizing: border-box;

    @keyframes descer{
        from{
            height: 0;
        }
        to{
            height: 110px;
        }
    }

    button{
        cursor: pointer;
        color: white;
        padding: 15px 10px;
        background-color: transparent;
        border: none;
        border-bottom: 1px solid ${cores.brancoEscuro};

        &:hover{
            color: ${cores.amarelo};
        }
    }
    }

    @media (max-width: 400px){
        background-color: rgba(0,0,0,.8);
        width: 100vw;
        left: 0;
        top: 0;
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;

        .sub-menu{
            position: relative;
            top: 0;
            width: 70%;
            height: 60%;
            display: flex;
            flex-direction: column;
            padding: 20px 10px;

            button{
                flex-grow: 2;
                font-size: 25px;
            }
        }    
    }
`