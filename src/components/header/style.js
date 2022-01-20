import styled from "styled-components";
import * as cores from '../../util/cores'
export default styled.div`
    height: 50px;
    max-height: 50px;
    background-color: ${cores.preto};
    width: 100%;
    
    box-sizing: border-box;
    overflow: hidden;
    color: ${cores.branco}; 
    display: flex;
    align-items:center;
    padding: 0px 20px 0px 20px;
    justify-content: space-between;

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

    @media(max-width: 400px){
        flex-direction: row-reverse;
        .hamb{
            display: block;
        }
    }

`