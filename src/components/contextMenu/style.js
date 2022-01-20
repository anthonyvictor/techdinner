import styled from "styled-components";
import * as cores from "../../util/cores";

export const Container = styled.div`
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);

  @keyframes Abrir {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: auto;
      opacity: 100%;
    }
  }

  ul {
    animation: Abrir 0.5s linear;
    width: 250px;
    flex-shrink: 0;
    flex-grow: 0;
    overflow-y: auto;
    list-style: none;
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 0px;
    height: fit-content;
    border-radius: 10px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
    padding: 20px 10px;
    box-sizing: border-box;

    label {
      width: 100%;
      text-align: center;
      margin-bottom: 15px;
      color: gray;
    }

    li {
      width: 100%;
      padding: 5px;
      color: black;
      user-select: none;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      font-size: 1.5rem;
      height: 60px ;
      flex-grow: 0;
      flex-shrink: 0;



      &:not(.disabled):hover {
        background-color: ${cores.cinzaClaro};
        cursor: pointer;
      }

      &.disabled {
        color: darkgrey;
        pointer-events: none;
      }

      &.hidden {
        display: none;
      }
    }
  }
`;
