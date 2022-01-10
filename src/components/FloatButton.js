import React from "react";
import styled from "styled-components";
import * as cores from "../context/cores";

const Botao = styled.button`
  display: none;
  background-color: ${cores.preto};

  @media (max-width: 400px) {
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 0px 30px 20px 0px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.5);
    font-size: 30px;
    color: white;

    
  }
`;

export default function FloatButton(props) {
  return <Botao onClick={props.clique ? e => props.clique(e) : {}} className="float-button">+</Botao>;
}
