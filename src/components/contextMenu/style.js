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
    
    @keyframes Abrir{
        from{height: 0};
        to{height: 100%}
    }

    ul{
    left: calc(${(props) => props.pos.left}px + ${(props) => props.pos.width}px);
    top: calc(${(props) => props.pos.top}px + 2%);
    position: absolute;
    list-style: none;
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 3px;
    height: auto;
    width: max-content;
    min-width: 150px;
    max-height: 350px;
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
        cursor: pointer;
        padding: 5px;

        &:hover{
            background-color: ${cores.cinzaClaro};
        }
    }
    }

`