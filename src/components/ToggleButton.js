import React from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";
import * as cores from '../util/cores'

export const ToggleButton = (props) => {
  return (
    <Container>
        {props.items.map((e, i) => (
            <div key={i}
            className={e === props.currentItem ? 'active' : undefined}
            onClick={() => props.setCurrentItem(e)}>
                {e}
            </div>
        ))}
    </Container>
    )
}

const Container = styled.div`
    margin: 10px;
    display: flex;
    border: 3px solid ${cores.cinza};
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0px 3px 10px rgba(0,0,0,.3); 

    div{
        text-align: center;
        flex-grow: 2;
        padding: 10px;
        cursor: pointer;
        line-height: 100%;

        &.active{
            font-weight: 600;
            font-size: 18px;
            background-color: ${cores.cinza};
        }
    }
`

ToggleButton.propTypes = {
    items: PropTypes.array.isRequired,
    currentItem: PropTypes.string.isRequired,
    setCurrentItem: PropTypes.func.isRequired
    
}