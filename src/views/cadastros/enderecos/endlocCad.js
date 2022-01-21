import React from 'react';
import styled from 'styled-components';
import * as cores from '../../../util/cores'

function EndLocCad() {
  return (
    <Container>
        
    </Container>
  )
}

export default EndLocCad;

const Container = styled.div`
 padding: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 10px;
  background-color: ${cores.light};
  overflow-y: auto;
  border: 1px solid black;
  box-sizing: border-box;
`