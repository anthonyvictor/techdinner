import styled from "styled-components";

export const Estilo = styled.ul`
  overflow-y: auto;
  width: 100%;
  height: calc(100vh - 140px); 
  padding: 5px 0;
  border: none;

  @media (max-width: 400px){
      height: calc(100vh - 90px);
      padding: 5px 0 60px 0;
  }
`;
