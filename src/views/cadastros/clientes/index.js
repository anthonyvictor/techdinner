import React from 'react'
import Lista from '../../home/lista'
import PedidoProvider from '../../../context/pedidos'

export default function Clientes(){
    return(
        <div>
            <PedidoProvider>
                <Lista />
            </PedidoProvider>
        </div>
    )
}