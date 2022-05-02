import React from 'react'
import {ListaCli} from '../../../cadastros/clientes/lista'

export const Lista = ({routes, callback, mudarTab}) => {
    return (
        <ListaCli
            retorno={callback}
            tabs={routes}
            changeTab={() => mudarTab('cadastro')}
        />
    )
}
