import styled from "styled-components";
import * as cores from '../../../util/cores'


export const Estilo = styled.div`
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    background-color: white;

    .tab{
        height: 30px;
        max-height: 30px;
        min-height: 30px;
        background-color: ${cores.branco};
        display: flex;
        margin: 2px 2px 0 2px;
        border: 1px solid black;
        button{
            width: 180px;
            box-sizing: border-box;
            background-color: transparent;
            border: none;
            cursor: pointer;
            user-select: none;
            border-right: .2px solid black;

            &:hover{
                background-color: ${cores.cinzaClaro};
            }
            &.ativo{
                color: white;
                font-size: 15px;
                background-color: ${cores.cinza};
            }
        }
    }

    

    @media (max-width: 400px){   
            .tab{
                display: none;
            }         
            
            
        }
`