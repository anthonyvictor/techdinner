import styled from "styled-components";

export const box = styled.div`
    display: flex;
    flex-direction: column;
    background-color: whitesmoke;
    box-shadow: 0 2px 8px rgba(0,0,0,.5);
    min-height: 180px;
    border: 1px solid black;
    border-radius: 10px;
    overflow: hidden;

    &.hidden{
      display: none;
    }
    &.collapsed{
      min-height: 30px;
      max-height: 30px;
      height: 30px;
    }
    >.top{
      flex-shrink: 0;
      flex-grow: 0;
      background-color: white;
      border-bottom: 1px  solid black;
      height: 30px;
      display: flex;
      padding: 0 10px;
      .principal{
        flex-grow: 2;
        text-align: center;
        vertical-align: middle;
        line-height: 30px;
        border: none;
        background-color: transparent;
        cursor: pointer;
        &:hover{
          font-size: 17px;
          font-weight: 600;
        }
      }
      .secondary{
        background-color: whitesmoke;
        width: 50px;
        border: none;
        cursor: pointer;
      }
   
    }
`