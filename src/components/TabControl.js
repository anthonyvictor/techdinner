import React from "react";
import styled from "styled-components";
import * as cores from "../util/cores";
import { useTabControl } from "../context/tabControlContext";
import { useRotas } from "../context/rotasContext";

export const TabControl = () => {

  const {currentTab, tabs} = useTabControl()
  const {setCurrentRoute} = useRotas()

  return (
    <Container>
      <div className="top">
        {tabs &&
          tabs.map((t) => (
            <button
            key={t.link}
              onClick={() => {
                setCurrentRoute(t.link)
                // setCurrentTab(t.elemento);
              }}
            >
              {t.titulo}
            </button>
          ))}
      </div>
      {currentTab}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;

  .top {
    width: 100%;
    height: 40px;
    flex-grow: 0;
    flex-shrink: 0;
    overflow: hidden;
    background-image: linear-gradient(white 50%, ${cores.light} 50% );
    button {
      margin-left: 5px;
      margin-top: 3px;
      outline: none;
      border: 0.5px solid gray;
      border-radius: 10px;
      min-width: 180px;
      height: 120%;
      cursor: pointer;

      &:hover {
        background-color: ${cores.cinzaClaro};
      }
    }
  }

  & > :not(.top){
    height: 100%;
    width: 100%;
    padding: 5px;
    background-color: ${cores.light};
    border: 1px solid black;
    box-sizing: border-box;
  }

  @media (max-width: 400px) {
    flex-direction: column-reverse;

    .top {
      width: 100%;
      height: 50px;
      overflow-y: hidden;
      overflow-x: auto;
      display: flex;
      gap: 5px;
      background-image: linear-gradient(${cores.light} 50%, white 50% );
      button {
        margin-left: 0;
        margin-top: 0;
        border-radius: 2% ;
        height: 100%;
        flex-grow: 2;
      }
    }
  }
`;
