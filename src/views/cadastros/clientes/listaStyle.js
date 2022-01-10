import styled from "styled-components";
import * as cores from '../../../context/cores'

export const Estilo = styled.ul`
  overflow-y: auto;
  padding: 2px;
  
  .pesquisa{
        display: flex;
        padding: 5px 2px;
        gap: 10px;
        width: 100%;
        justify-content: stretch;
        overflow: none;
        input{
            font-size: 22px;
            flex-grow: 2;
            border: none;
            border-bottom: 1px solid black;
            ;

            &::placeholder{
                font-style: italic;
                font-size: 25px;
                
            }
        }

        button{
            background-color: transparent;
            border:none;
            padding: 0 30px;
            font-size: 18px;
            cursor: pointer;

            &:hover{
                color: ${cores.amarelo};
            }
        }

    }

  li{
    margin-bottom: 6px;
    border: 1px solid black;
    padding: 1px;
    box-sizing: border-box;
    background-color: ${cores.branco};

    
    
    .container{
      user-select: none;
      pointer-events: none;
      display: flex;
      justify-content: space-between;
      gap: 5px;
      align-items: center;

      .img-id{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 10px;
        min-width:40px;
        img{
        cursor: pointer;
        pointer-events: fill;
        border-radius: 50%;
        border: 2px solid black;
        width: 40px;
        min-height: 40px;
        min-width:40px;
        height: 40px;
        object-fit: cover;
      }
      }

      .info{
        flex-grow: 2;
        label{
          font-weight: 600;
          font-size: 15px;
        }

        .tags{
          font-size: 12px;
        }

        .contato{
          font-weight: 600;
          font-size: 13px;
        }

        .bottom-info{
          font-size: 12px;
          font-style: italic;
          span:after{
            content: ' | ';
          }

          span:last-child:after {
            content:'';
          }
          
        }
      }

    }

    .botao{
        background-color: transparent;
        border: none;
        outline: none;
        font-size: 20px;
        padding: 5px 15px;
        cursor: pointer;
        pointer-events: fill;
        
      }

    &:hover{
      .botao{
        color: white;
      }
      color: white;
      background-color: ${cores.cinza};
    }
  }

  @media(max-width: 400px){


    .pesquisa{
                input{
                font-size: 25px;
                width:100% ;                
            }
            
            button{
                font-size: 30px;
                padding: 10px 20px;
                
            }

            .bt-id{
                display: none;
            }
            }

    li:last-child{
      margin-bottom: 80px;
    }
  }

`;
