import styled from "styled-components";
import * as cores from "../../context/cores";

export const Estilo = styled.li`
  width: 100%;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${cores.branco};
  height: 50px;
  border: 1px solid black;
  border-radius: 5px;
  padding: 0 5px;
  cursor: pointer;
  overflow: hidden;

  img {
    user-select: none;
    pointer-events: none;
    border: 0.2px solid black;
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }

  .informacoes {
    user-select: none;
    /* pointer-events: none; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1px;
    width: 100%;
    height: 100%;

    .nome-cliente {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .info-secundarias {
      display: flex;
      justify-content: stretch;
      gap: 3px;

      span {
        justify-content: center;
        padding: 3px;
        gap: 3px;
        font-size: 11px;
        display: flex;
        align-items: center;
        border: 0.1px solid black;
        background-color: white;
      }

      .tipo {
        width: 20px;
        .ico {
          width: 20px;
          color: ${(props) => props.pedido.cortipo};
        }
      }

      .tempo {
        min-width: 50px;
        .ico {
          border: 1px solid black;
          border-radius: 50%;
          color: ${(props) => props.pedido.corhora};
        }
      }

      .valor {
        width: 80px;
        .ico {
          color: ${(props) => props.pedido.corvalor};
        }
      }

      .impr {
        .ico {
          color: ${(props) => props.pedido.corimpr};
        }
      }
    }
  }

  &:hover {
    background-color: ${cores.cinza};
    color: white;

    span {
      color: black;
    }
  }

  &:not(:last-child) {
    margin-bottom: 5px;
  }

  @media (max-width: 400px) {
    height: 90px;

    img {
      width: 60px;
      height: 60px;
    }

    .informacoes {
      .nome-cliente {
        font-size: 25px;
      }

      .info-secundarias {
        span {
          font-size: 18px;
        }

        .tipo {
          width: 30px;
        }

        .tempo {
          width: 70px;
        }

        .valor {
          width: 115px;
        }
      }
    }
  }
`;
