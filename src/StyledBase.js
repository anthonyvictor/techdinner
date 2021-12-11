import styled from "styled-components";

const Estilo = styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    .TopoBase{
        flex-grow: 2;
        display:flex;
        width: 100%;
        flex-direction: column;
    }

    @media(max-width: 400px) {
    .TopoBase{
        flex-shrink: 10;
    }
  }
`

export default Estilo