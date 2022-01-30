import React from "react";
import styled from "styled-components";

export default function CopyView(props) {
  return (
    <Container className="copy-container">
      <h6>Toque e segure no texto abaixo para copiar:</h6>
      <p className="texto">{props.txt}</p>
    </Container>
  );
}

const Container = styled.div`
  display: none;

  @media (max-width: 400px) {
    position: absolute;
    width: 80%;
    height: 60%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: black;

    h6 {
      user-select: none;
      pointer-events: none;
    }

    .texto{
      font-size: 15px;
      user-select: all;
      pointer-events: fill;
      white-space: pre-wrap;
    }

    *{
      color: white;
      display: block;
      text-align: center;
    }
  }
`;
