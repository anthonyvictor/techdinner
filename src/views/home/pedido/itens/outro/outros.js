import React from 'react'
import styled from 'styled-components'
import { useOutro } from '.'
import { OutroLi } from './outroLi';

export const OutrosLista = () => {

    const {searchResults} = useOutro()

    return (
        <Container>
          {searchResults.map(outro => <OutroLi key={outro.id} outro={outro} /> )}
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