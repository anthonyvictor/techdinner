import React from 'react';
import { Container } from './style';

function ContextMenu(props) {
    console.log(props.pos.left)
  return (
        <Container pos={props.pos} className='Context-Menu' onClick={props.setOpenMenu}>
            <ul>
                <label>Menu</label>
                {props.children}
            </ul>
        </Container>
    )
    
}

export default ContextMenu;