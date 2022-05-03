import React from 'react'
import styled from 'styled-components'
import { useBebida } from '.'
import { BebidaLi } from './bebidaLi';

export const BebidasLista = () => {

    const {searchResults} = useBebida()

    return (
        <Container>
            {searchResults.map(bebida => <BebidaLi key={bebida.id} bebida={bebida} /> )}
        </Container>
    )
}

const Container = styled.ul`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
    width: 100%;
    gap: 5px;
    padding: 5px;

      @media (min-width: 550px){
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: max-content;
        grid-gap: 5px;
      }

`