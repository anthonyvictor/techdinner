import React from 'react';
import { Container } from './style';

function ContextMenu(props) {
  return (
        <Container pos={props.pos} className='Context-Menu' 
        onClick={e => {
            if(e.target === e.currentTarget){
                props.setOpenMenu(false)
            }
        }}>
            <ul>
                <label>Menu</label>
                {props.children}
            </ul>
        </Container>
    )
    
}

export default ContextMenu;