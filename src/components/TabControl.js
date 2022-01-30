import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import * as cores from "../util/cores";
import { useTabControl } from "../context/tabControlContext";
import { useRotas } from "../context/rotasContext";
import { useLocation } from "react-router-dom";

export const TabControl = () => {

  const {currentTab, setCurrentTab, tabs, getDefault} = useTabControl()

  const {setCurrentRoute} = useRotas()

  const loc = useLocation()

  const top = useRef()

  useEffect(() => {
    let curr = tabs.filter(e => e.link === loc.pathname)
    if(curr.length > 0){
      for(let bt of top.current.children){
        if(bt.innerHTML === curr[0].titulo){
          bt.classList.add('current')
        }else{
          bt.classList.remove('current')
        }
      }
    }
  }, [currentTab]) // eslint-disable-line
    
    useEffect(() => {
      setCurrentTab(getDefault())
    },[loc.pathname]) // eslint-disable-line react-hooks/exhaustive-deps
    

  return (
    <Container>
      <div ref={top} className="top">
        {tabs &&
          tabs.map((t) => (
            <button
            key={t.link}
              onClick={() => {
                setCurrentRoute(t.link)
              }}
            >
              {t.titulo}
            </button>
          ))}
      </div>
      <div className="middle">
        {currentTab}
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
  justify-content: stretch;
  overflow: hidden;
  flex-grow: 2;

  .top {
    width: 100%;
    height: 40px;
    flex-grow: 0;
    flex-shrink: 0;
    overflow: hidden;
    background-image: linear-gradient(white 50%, ${cores.branco} 50% );
    button {
      margin-left: 5px;
      margin-top: 3px;
      outline: none;
      border: 0.5px solid gray;
      border-radius: 10px;
      min-width: 180px;
      height: 120%;
      box-shadow: 0 1px 3px rgba(0,0,0,.5);
      cursor: pointer;

      &.current{
        background-color: ${cores.brancoEscuro};
      }

      &:hover {
        background-color: ${cores.cinza};
      }
    }
  }

  .middle{
    display: flex;
    justify-content: stretch;
    align-items: stretch;

    overflow: hidden;
    height: 100%;
    background-color: ${cores.branco};
    padding: 5px;
    width: 100% ;
    box-sizing: border-box;
    flex-shrink: 2;
    border: 1px solid black;

    & > *{
      width: 100%;
    }
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
      background-image: linear-gradient(${cores.branco} 50%, white 50% );
     
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
