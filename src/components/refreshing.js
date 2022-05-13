import React from "react";
import styled from "styled-components";
import { cores } from "../util/cores";

export function Refreshing(){

    return (
      <RefreshingContainer>
        <h1>Carregando...</h1>
        <div className="loader"></div>
      </RefreshingContainer>
    )
  }
  
  const RefreshingContainer = styled.div`
    position: absolute;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${cores.dark};
  
    img{
      width: min(400px, 80%);
    }
  
    p{
      
    }
  
    *{
      color: ${cores.branco};
      
    }
  
  .loader {
    border: 16px solid ${cores.branco}; /* Light grey */
    border-top: 16px solid ${cores.azul}; /* Blue */
    border-radius: 50%;
    width: 90px;
    height: 90px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  `