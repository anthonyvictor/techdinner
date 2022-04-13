import React from 'react'
import styled from 'styled-components'
import { verde } from '../util/cores'

export const AvancarButton = ({ avancar, disabled, type }) => {
    return (
        <Container className='avancar' type={type ?? 'button'} onClick={avancar} disabled={disabled}>
            AVANÇAR
        </Container>
    )
}

const Container = styled.button`
    min-height: 40px;
    flex-grow: 2;
    width: 100%;
    background-color: ${verde};
    border: 2px solid black;
    border-radius: 5px;
    margin-top: 5px;
    font-size: 18px;
    transition font-size .2s;
    
    :not(:disabled){
        cursor: pointer;
            @media (pointer: fine){
            &:hover{
            font-size: 20px;
            }
        }
    }

    @media (max-width: 550px) {
        width: 100%;
        min-height: 50px;
    }
`
