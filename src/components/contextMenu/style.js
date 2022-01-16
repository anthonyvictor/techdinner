import styled from "styled-components";
import * as cores from '../../context/cores'

export const Container = styled.div`
    left: 0;
    top: 0;
    position: absolute;
    width: 100%;
    height: 100% ;
    background-color: transparent;
    animation: Abrir .2s linear;

    @media(max-width: 400px){
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,.7);
    }
    
    @keyframes Abrir{
        from{height: 0};
        to{height: 100%}
    }

    ul{
    @media(min-width: 401px){
    left: calc(${(props) => props.pos.left}px + ${(props) => props.pos.width}px);
    top: calc(${(props) => props.pos.top}px + 2%);
    height: auto;
    width: max-content;
    min-width: 150px;
    max-height: 350px;
    }
    overflow: hidden;
    position: absolute;
    list-style: none;
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 3px;
    
    height: 50%;
    width: 80%;
    min-width: 150px;
    max-height: 80%;

    box-shadow: 2px 2px 10px rgba(0,0,0,.5);
    padding: 10px 5px;

    label{
        width: 100%;
        text-align: center;
        margin-bottom: 15px;
        color: gray;
    }

    li{
        
        border-bottom: .1px solid gray;
        width: 100%;
        padding: 5px;
        color: black;
        user-select: none;
        

        @media(max-width: 400px){
            flex-grow: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;

            *{font-size: 1.3rem;}
        }

        &:not(.disabled):hover{
            background-color: ${cores.cinzaClaro};
            cursor: pointer;
        }

        &.disabled{
            color: darkgrey;
            pointer-events: none;
        }

        &.hidden{
            display: none;
        }
    }
    }

`