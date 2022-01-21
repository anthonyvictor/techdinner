import React from 'react';

//VIEWS
import ELList from './endlocLista'
import ELCad from './endlocCad'
import Bairros from './bairros'

//CONTEXT
import CadEnderecoProvider from '../../../context/cadEnderecosContext';
import TabControlProvider from '../../../context/tabControlContext';

//COMPONENTS
import { TabControl } from '../../../components/TabControl';

function Enderecos(props) {
    const tabs = [
        { titulo: "E/L Lista", elemento: <ELList /> },
        { titulo: "E/L Cadastro", elemento: <ELCad /> },
        { titulo: "Bairros", elemento: <Bairros /> }
      ];

    return (
      <TabControlProvider tabs={tabs} tabInicial={props.tabInicial} >
        <CadEnderecoProvider>
          <TabControl />
        </CadEnderecoProvider>
      </TabControlProvider>
    )
}

export default Enderecos;