import React from 'react'
import styled from 'styled-components'

export const FecharButton = ({ fechar }) => {
    return (
        <Container>
            <button onClick={e => fechar(e)}>X</button>
        </Container>
    )
}

const Container = styled.div`
    height: 80vh;
    background-color: transparent;

    @media print{
      display: none;
    }

    button{
      position: absolute;
      right: 2%;
      top: 2%;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      background-color: white;

      @media (hover: hover) and (pointer: fine){
        &:hover{
          background-color: yellow;
        }
      }
    
    }
`