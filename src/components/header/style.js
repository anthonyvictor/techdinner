import styled from "styled-components";
import { cores } from '../../util/cores'
export default styled.div`
    height: 50px;
    max-height: 50px;
    background-color: ${cores.cinzaDark};
    width: 100%;
    
    flex-shrink: 0;
    flex-grow: 0;

    box-sizing: border-box;
    overflow: hidden;
    color: ${cores.brancoEscuro}; 
    display: flex;
    align-items:center;
    padding: 0px 20px 0px 20px;
    justify-content: space-between;

    @media print{
        display: none;
    }

    h2{
        user-select: none;
        pointer-events: none;
    }

    .hamb{
            display: none;
        }

    .icone{
            font-size: 25px;
            cursor: pointer;
            &:hover{
                color: ${cores.amarelo};
            }
        }

    div{

        
    }

    @media(max-width: 760px){
        flex-direction: row-reverse;
        .hamb{
            display: block;
        }
    }

`