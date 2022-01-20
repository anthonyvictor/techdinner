import React from 'react';
import ELList from './endlocLista'
import ELCad from './endlocCad'
import Bairros from './bairros'

function enderecos() {
    const tabs = [
        { titulo: "E/L Lista", elemento: <ELList /> },
        { titulo: "E/L Cadastro", elemento: <ELCad /> },
        { titulo: "Bairros", elemento: <Bairros /> }
      ];

  return <div />;
}

export default enderecos;