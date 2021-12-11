import styled from "styled-components";
import * as cores from "../../context/cores";
export default styled.div`
  background-color: whitesmoke;
  height: 100vh;

  .lista {
    width: 250px;
    height: 100%;
    border: 1px solid ${cores.preto};
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0 3px;
    .topo {
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
    }

    .meio {
      flex-grow: 2;

      div {
        width: 100%;
        ul {
          width: 100%;
          padding: 5px 0;
          border: none;
        }
      }
    }

    .rodape {
      height: 30px;
      border-top: 1px solid black;
      div{
        .geral{
          user-select: none;
          font-weight: 600;
          text-align: center;
          line-height: 28px;

          &:hover{
            display:none;
          }

        }
      }
    }
  }

  .float-button {
    display: none;
    background-color: ${cores.preto};
  }

  @media (max-width: 400px) {
    .lista {
      width: 100%;
      height: 100%;
      border: 1px solid ${cores.preto};

      .topo {
        display: none;
      }
    }

    .float-button {
      display: block;
      position: absolute;
      right: 0;
      bottom: 0;
      margin: 0px 30px 30px 0px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.5);
      font-size: 30px;
      color: white;

      &:hover {
        color: ${cores.amarelo};
      }
    }
  }
`;
