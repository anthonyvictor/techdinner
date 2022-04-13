import React from 'react';
import { getStored, setStored } from '../../util/local';

// import { Container } from './styles';

function Configuracoes() {
  return (
      <div>
          <select defaultValue={window.localStorage.getItem('exibicaoPedidos') || 'group'}
          onChange={(e) => 
          window.localStorage.setItem('exibicaoPedidos', e.target.value)}>
              <option value={'all'}>Todos</option>
              <option value={'group'}>Agrupados</option>
          </select>

          <select defaultValue={ getStored('api_url') }
          onChange={(e) => 
          setStored('api_url', e.target.value)}>
              <option value={'local'}>localhost</option>
              <option value={'fixed'}>Fixo Home</option>
              <option value={'hamachi'}>Hamachi</option>
              <option value={'web'}>web</option>
          </select>
      </div>
  )
}

export default Configuracoes;