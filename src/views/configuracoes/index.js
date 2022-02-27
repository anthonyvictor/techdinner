import React from 'react';

// import { Container } from './styles';

function Configuracoes() {
  return (
      <div>
          <select defaultValue={window.localStorage.getItem('exibicaoPedidos')}
          onChange={(e) => 
          window.localStorage.setItem('exibicaoPedidos', e.target.value)}>
              <option value={'all'}>Todos</option>
              <option value={'group'}>Agrupados</option>
          </select>
      </div>
  )
}

export default Configuracoes;