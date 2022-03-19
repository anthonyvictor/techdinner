import React, {useState} from 'react';
import { usePedido } from '..';
import { useHome } from '../../../../context/homeContext';
import EnderecoLista from '../../../cadastros/clientes/endereco';


export const Endereco = ({callback}) => {
    const {curr} = useHome()
    const [selectedTemp, setSelectedTemp] = useState(curr?.endereco)

    function selectEndereco(){
        if (selectedTemp) {
            const selectedFinal = {...selectedTemp}
            callback(selectedFinal)
        }
    }

    return(
        <div className='container endereco'>
                <EnderecoLista
                    endereco={selectedTemp}
                    setEndereco={obj => setSelectedTemp(prev => {return {...prev, ...obj}})}
                />
                <button onClick={() => selectEndereco()}>Salvar</button>
            </div>
    )
}