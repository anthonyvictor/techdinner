import React, {useState, useEffect} from 'react';
import { usePizzas } from '../../../../../../context/pizzasContext';
import {IngredienteLi} from './ingredienteLi';
import { usePizza } from '..';
import { filtro } from '../../../../../../util/misc'
import { cores } from '../../../../../../util/cores'
import { SearchBar } from '../../../../../../components/SearchBar'
import styled from 'styled-components';


export const IngredientesLista = ({sabor}) => {

    const [searchString, setSearchString] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const [ingredientesSelected, setIngredientesSelected] = useState(sabor.ingredientes)
    
    const { ingredientes} = usePizzas()
    const { setIngredientesComponentResult, fecharIngredientesComponent } = usePizza()

    useEffect(() => {
        const all = ingredientes.filter(e => ingredientesSelected.map(s => s.id).includes(e.id) === false)
        const selected = ingredientesSelected.map(e =>  {return{...e, tipoAdd: e.tipoAdd || 'Com'}})
        setSearchResults([...selected, ...all].filter(e => filtro({ nome: e.nome }, searchString)))
    }, [searchString, ingredientesSelected])


    function changeSelected(novoIngrediente){
        setIngredientesSelected(prev => [...prev.filter(e => e.id !== novoIngrediente.id), novoIngrediente])
    } 

  return (
        <Container onClick={e => e.currentTarget === e.target && fecharIngredientesComponent()}>
        <div className='center-container'>
            <SearchBar value={searchString} setValue={setSearchString} />
            <ul className='ingredientes-lista'>
                {searchResults.map(e => (
                    <IngredienteLi key={e.id} ingrediente={e} 
                    changeSelected={changeSelected} />
                ))}
            </ul>
            <button className='confirmar' onClick={() => {
                setIngredientesComponentResult({saborId: sabor.id, ingredientes: ingredientesSelected})
            }}>
                AVANÇAR
            </button>
        </div>
    </Container>
  )
}


const Container = styled.div`
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .center-container {
        background-color: ${cores.branco};
        width: min(350px, 80%);
        height: min(600px, 80%);
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
        gap: 5px;

        .ingredientes-lista {
            gap: 5px;
            display: flex;
            flex-direction: column;
            flex-grow: 2;
            flex-shrink: 2;
            padding-bottom: 2px;
            min-height: 50px;
            overflow: auto;
        }
        .confirmar {
            flex-basis: 50px;
            flex-shrink: 0;
            flex-grow: 0;
            background-color: ${cores.verde};
            border: 1px solid black;
        }
    }
`
 