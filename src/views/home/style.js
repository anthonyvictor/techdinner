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


  @media (max-width: 400px) {
    .esquerda {
      width: 100%;
      height: 100%;
      border: 1px solid ${cores.preto};
    }
  }
`;
