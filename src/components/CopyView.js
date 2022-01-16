import React from "react";
import styled from "styled-components";

export default function CopyView(props) {
  return (
    <Container className="copy-container">
      <h6>Toque e segure no texto abaixo para copiar:</h6>
      <h1>{props.txt}</h1>
    </Container>
  );
}

const Container = styled.div`
  display: none;

  @media (max-width: 400px) {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: black;

    h6 {
      user-select: none;
      pointer-events: none;
    }

    *{
      color: white;
      display: block;
      text-align: center;
    }
  }
`;
