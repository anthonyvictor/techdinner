import styled from "styled-components";
import * as cores from "../../util/cores";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  padding: 5px;
  border: 1px solid black;
  box-shadow: 1px 1px 10px rgba(0,0,0,.2);

  div {
    
    display: flex;
    gap: 10px;
    font-size: 20px;
    flex-direction: row-reverse;
    align-items: center;

    label{user-select: none;}
    
    input {
      flex-grow: 2;
      width: 100%;
      font-size: 22px;
      
      
    }

    button {
      user-select: none;
      background-color: white;
      cursor: pointer;
      min-width: 40px;
      min-height: 40px;
      max-width: 40px;
      max-height: 40px;

      border-radius: 50%;
      border: 3px solid black;
      outline: none;
    }
  }
  .array {
    height: 100%;
    min-height: 40px;
    display: flex;
    overflow-x: auto;
    gap: 10px;
    border: none;
    list-style: none;
    align-items: center;
    padding: 5px;

    li {
      flex-shrink: 0;
      height: 30px;
      background-color: ${cores.cinza};
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
      user-select: none;
      vertical-align: middle;
      cursor: pointer;
      &:hover{
          color: ${cores.amarelo};
      }
    }
  }

  @media(max-width:400px){
    div{

      label{
        font-size: 16px;
      }
    }
  }

`;
