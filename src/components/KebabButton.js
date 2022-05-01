import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import styled from 'styled-components'

export const Kebab = ({click}) => {
    return (
        <Container className="kebab-button" onClick={click}>
            <FontAwesomeIcon icon={faEllipsisV} />
        </Container>
    )
}

const Container = styled.button`
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 20px;
    padding: 5px 15px;
    cursor: pointer;
    pointer-events: fill;
`