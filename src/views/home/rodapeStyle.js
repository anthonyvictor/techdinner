import styled from "styled-components";

export const Estilo = styled.div`
height: 30px;
  border-top: 1px solid black;
  overflow: hidden;

    .geral {
      text-align: center;
      p {
        display: inline;
        font-weight: 600;
        line-height: 30px;
        user-select: none;
        pointer-events: none;
      }
    }

    .detalhes {
      opacity: 100%;
      display: flex;
      justify-content: space-around;

      p {
        line-height: 28px;
        user-select: none;
        font-size: 15px;

        &:hover {
          font-weight: 600;
          font-size: 17px;
          cursor: pointer;
        }
      }

      .tx {
        color: blue;
      }

      .pg {
        color: green;
      }

      .pnd {
        color: red;
      }
    }

    &:hover {
      .geral {
        opacity: 0;
        display: none;
      }
    }

    @media (max-width: 400px){
        .geral p {
        font-weight: 600;
        line-height: 36px;
      }

      .detalhes p{
          line-height: 36px;
      }

      &:hover {
      .geral {
        opacity: 100%;
        display: block;
      }
    }

    }

`;
