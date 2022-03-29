import React, {useState, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import { usePizzas } from '../../../../../../context/pizzasContext';
import { usePizza } from '..'
import { equals } from '../../../../../../util/misc';
import { formatReal } from '../../../../../../util/Format';

export const TamanhosLista = () => {
    const { temBorda, isFidelidade, tamanhoSelected, setTamanhoSelected } = usePizza() 
    const { tamanhos, valores } = usePizzas()
    const [finalResults, setFinalResults] = useState([]) //array after filtering and getting adjustments

    useEffect(() => {
        if(valores.length > 0 && tamanhos.length > 0){
            fillSelect()
        }
     }, [tamanhos, valores])

     const isAllLoaded = () => tamanhos.length > 0 && valores.length > 0

    const getMinValor = (tamanhoId) =>  {
        let r = 0 
        if(isAllLoaded() && tamanhoId){
            r = valores.filter(v => equals(v.tamanho.id, tamanhoId))
            .sort((a, b) => a.valor < b.valor ? -1 : 1)
            [0].valor
        }
        return r
    }

    const getValores = (tamanhoId) => {
        let r = '' 
        if(isAllLoaded() && tamanhoId){
            r = [...new Set(
                valores.filter(v => equals(v.tamanho.id, tamanhoId))
                .sort((a, b) => a.valor < b.valor ? -1 : 1)
                .map(e => e.valor)
            )]
            .map(e => formatReal(e.valor)).join(' - ')
        }
        return r
    }

    function fillSelect(){
        if(isAllLoaded()){
            setFinalResults(
                [...tamanhos]
                .filter(e => e.ativo && e.visivel)
                .sort((a, b) => getMinValor(a.id) < getMinValor(b.id) ? -1 : 1)
            )
        }
    }

  return (
    <Container
    value={tamanhoSelected ?? 'Selecione o tamanho...'}
    onChange={e => setTamanhoSelected(e.target.value)}>

        <option key={0} disabled>
            Selecione o tamanho...
        </option>
        {finalResults.map(e => (
            <option value={e.id} key={e.id} disabled={!e.ativo}>
                {e.nome}
            </option>
        ))}
        
    </Container>
  )
}

const Container = styled.select`
        width: 100%;
        padding: 10px;
        font-size: 22px;
        flex-grow: 0;
        flex-shrink: 0;
`