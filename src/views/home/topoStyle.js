import styled from "styled-components";

export const Estilo = styled.div`
flex-shrink: 0;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 60px;

      span {
        display: flex;
        padding: 3px 0;
        flex-grow: 2;
        gap: 5px;

        button {
          border: solid 1px;
          cursor: pointer;
        }

        .botao-novo {
          flex-grow: 2;
        }

        .botao-opcoes {
          width: 30px;
        }
      }

      select {
        width: 100%;
        display: block;
      }



      @media (max-width: 400px) {
        display: none;
  }

`