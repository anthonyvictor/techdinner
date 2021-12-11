import styled from "styled-components";
import * as cores from "../../context/cores";

export default styled.div`
  background-color: whitesmoke;
  overflow: hidden;
  height: 100%;

  .esquerda {
    width: 260px;
    border-right: 1px solid ${cores.preto};
    flex-direction: column;
    gap: 5px;
    padding: 0 3px;
  }

  .float-button {
    display: none;
    background-color: ${cores.preto};
  }

  @media (max-width: 400px) {
    .esquerda {
      width: 100%;
      height: 100%;
      border: 1px solid ${cores.preto};
    }

    .float-button {
      display: block;
      position: absolute;
      right: 0;
      bottom: 0;
      margin: 0px 30px 39px 0px;
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
