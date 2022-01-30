import React from 'react';
import BebidasProvider from '../../../context/bebidasContext';
import {Bebidas as BebidasLista} from './bebidas';

function Bebidas(){
    return (
        <BebidasProvider>
            <BebidasLista />
        </BebidasProvider>
    )
}

export default Bebidas;
