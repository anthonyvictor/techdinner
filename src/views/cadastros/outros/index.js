import React from 'react';
import OutrosProvider from '../../../context/outrosContext';
import {Outros as OutrosLista} from './outros';

function Outros(){
    return (
        <OutrosProvider>
            <OutrosLista />
        </OutrosProvider>
    )
}

export default Outros;