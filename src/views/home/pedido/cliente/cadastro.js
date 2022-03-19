import React from 'react'
import CadastroCli from '../../../cadastros/clientes/cadastro';

export const Cadastro = ({routes, callback}) => {
    return (
        <CadastroCli retorno={callback} tabs={routes} />
    )
}
