import styled from "styled-components";
import * as cores from '../../context/cores'

export const Sidebar = styled.div `
  height: 100vh;
  /* position: absolute; */
  width: 50px;
  background-color: ${cores.preto};
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  transition: 0.5s;

    *{
        margin: 0;
        padding: 0;
    }

    &.invisivel{
        display: none;
    }

    &.ativo {
        position: absolute;
        width: 300px;
        .topo{
            .botao{
                p {display: block;}
            }
        } 
        .meio .botao p{display: block;}
        .meio .botao{justify-content: flex-start;}
        
        .rodape{
            justify-content: stretch;
            padding: 5px 5px 5px 20px;
            div{display: block;}
        }

       .fundo{
           left: 300px;
           display: block;
           position: absolute;
           background-color: rgba(0,0,0,.5);
           width: calc(100vmax - 300px);
           height: 100vh;
           animation: Opacidade 1s ease-out
       }
    }

    .fundo{
        transition-delay: .4s;
        
    }

    @keyframes Opacidade{
        from {opacity: 0}
        to {opacity: 1}
    }

    .topo {
        height: 100px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        overflow: hidden;

        .botao {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            max-height: 50px;
            min-height: 50px;
            color: ${cores.branco};
            gap: 10px;
            box-sizing: border-box;
            overflow: hidden;

        .icone {font-size: 30px;}

        p {display: none;}

        &:hover {
            .icone {color: ${cores.amarelo};}

            p {color: ${cores.amarelo};}
        }
        }

        img{
            box-sizing: border-box;
            padding: 10px;
            object-fit:contain;
            height: 100%;
            width: 100%;
            overflow: hidden;
            user-select: none;
            pointer-events: none;
        }
    }

    .meio{
        margin-top: 10px;
        padding: 0 5px 0 5px;
        box-sizing: border-box;
        width: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        gap: 10px;

        .botao{
            height: 50px;
            width: 100%;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 10px;
            vertical-align: middle;
            overflow: hidden;
            gap: 10px;
            border-bottom: 1px solid ${cores.cinzaClaro};
            
            .icone{
                user-select: none;
                pointer-events: none;
                font-size: 30px;
                width: 30px;
                color: ${cores.branco};
                vertical-align: middle;
                height: auto;
            }

            p{
                vertical-align: middle;
                color: ${cores.branco};
                display: none;
                height: auto;
                width: 80px;
                flex-grow: 1;
                user-select: none;
                pointer-events: none;
                font-size: 22px;
                margin-left: 10px;
                /* background-color: ${cores.amarelo}; */
            }

            /* https://flatuicolors.com/palette/se */
            &:hover{
                .icone{color: ${cores.amarelo};}

                p{color: ${cores.amarelo};}
            }

        
        }

    }

    .rodape{
        display: flex;
        background-color: ${cores.cinza};
        overflow: hidden;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        padding: 5px;       
        color: ${cores.branco};
        height: 70px;
        gap: 20px;
        cursor: pointer;

        &:hover{
            color: ${cores.amarelo};
        }

        .icone{
            font-size: 30px;
            user-select: none;
            pointer-events: none;
        }
        div{
            flex-grow: 2;
            display: none;
            user-select: none;
            pointer-events: none;
           p{
               text-align: left;
               font-size: 15px;
           }
           .title{
                font-size: 18px;
                font-weight: 500;
           }
        }

    }

    @media(max-width:400px){
        transform: translateY(-200%);
        position: absolute;
        width: 100%;
        z-index: 999;

       .topo {
            .botao{
                display: none;
            }

            img{
                padding: 30px;
            }
       }
       
        .meio {
            .botao{
                font-size: 22px;
                display: flex;
                justify-content:center;
                align-items: center;
                padding: 10px;
                height: 80px;
            }
        }

        

        &.ativo{
            transform: translateY(0%);
            width: 100%;
            height: calc(100vh - 46px);
            top: 46px;

            .rodape{
                justify-content: center;
                padding: 5px;

                div{
                    flex-grow: 0;
                }
            }
            
            .fundo{
                display: none;
            }

            .meio .botao {justify-content: center;}
            
        }
    }
`;