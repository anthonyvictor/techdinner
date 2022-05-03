import React, {useState} from 'react';
import EntregadoresProvider, { useEntregadores } from '../../../../context/entregadoresContext';
import { useHome } from '../../../../context/homeContext';
import { equals } from '../../../../util/misc';

export const Entregadores = ({callback}) => {
    return (
        <EntregadoresProvider>
            <ListaEntregadores callback={callback} />
        </EntregadoresProvider>
    )
}

const ListaEntregadores = ({callback}) => {
    const { entregadores } = useEntregadores()
    const {curr} = useHome()
    const [selectedTemp, setSelectedTemp] = useState(curr?.endereco?.entregador?.id)
    
    function selectEntregador(){
        if (selectedTemp) {
            const selectedFinal = entregadores.filter(x => equals(x.id, selectedTemp))[0]
            callback(selectedFinal)
        }
    }
    return (
        <div className='container entregador'>
            <h1>Selecione o entregador:</h1>
            <select value={selectedTemp || 'Selecione...'} onChange={e => setSelectedTemp(e.target.value)}>
                <option key={0} disabled>
                    Selecione...
                </option>
                {entregadores
                    .filter(e => e.ativo)
                    .map(e => (
                        <option key={e.id} value={e.id} label={e.nome}>
                            {e.nome}
                        </option>
                    ))}
            </select>
            <button onClick={selectEntregador}>
                Salvar
            </button>
        </div>
    )
}