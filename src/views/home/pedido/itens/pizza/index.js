import React, { useState, createContext, useContext, useRef, useEffect, useCallback } from 'react';
import { usePizzas } from '../../../../../context/pizzasContext';
import { equals, join, filtro } from '../../../../../util/misc'
import styled from 'styled-components'
import { TamanhosLista } from './tamanhos'
import { SaboresLista } from './sabores'
import { IngredientesLista } from './ingredientes'
import { Rodape } from './rodape'
import { useItens } from '../itens';
import { useApi } from '../../../../../api';


const PizzaContext = createContext()

export default function Pizza() {
    const { tamanhos, sabores, ingredientes, tipos, refresh } = usePizzas()

    const {api} = useApi()

    const {item, callback} = useItens()

    const [isLoaded, setIsLoaded] = useState(false)
    
    const [saboresSelectedUpdates, setSaboresSelectedUpdates] = useState(0)
    const [saborHovered, setSaborHovered] = useState(null)
    

    const [searchString, setSearchString] = useState('') //string containing keywords to find in objects 
    const [searchResults, setSearchResults] = useState([]) //array after filtering by keywords 
    const [finalResults, setFinalResults] = useState([]) //array merged with othes arrays and getting adjustments

    const [isHoverLocked, setIsHoverLocked] = useState(false)
    const [isPriceLocked, setIsPriceLocked] = useState(false)

    const [ingredientesComponent, setIngredientesComponent] = useState(<></>)
    const [ingredientesComponentResult, setIngredientesComponentResult] = useState(null)

    const [tamanhoSelected, setTamanhoSelected] = useState(item.pizza?.tamanho?.id ? String(item.pizza?.tamanho?.id) : null)
    const [saboresSelected, setSaboresSelected] = useState(getSaboresSelected())
    const [observacoes, setObservacoes] = useState(item?.observacoes ?? '')
    const [valor, setValor] = useState(item?.valor ?? 0)

    const searchRef = useRef()
    const saborHoveredRef = useRef()
    
    useEffect(() => {
        if(sabores.length > 0 && tamanhos.length > 0){
            carregarItem()
        }
    },[sabores,tamanhos])

    useEffect(() => {
        if(!isHoverLocked){
            setSaborHovered(null)
        }
    },[isHoverLocked])

    useEffect(() => {
        if(finalResults.length > 0) setIsHoverLocked(true)
    }, [finalResults])

    useEffect(() => {
        if(sabores.length > 0){
            setSaboresSelectedUpdates(prev => prev < saboresSelected.length ? saboresSelected.length : prev + 1)
        }
    }, [saboresSelected])

    useEffect(() => {
        if(sabores.length > 0){
            setSaboresSelected(getSaboresSelected())
            setSearchResults(sabores.filter(e => e.visivel).filter(e => filtro({ nome: e.nome, numero: e.numero }, searchString)))
        }
    }, [searchString, sabores])

    useEffect(() => {
        setFinalResults(
            [
                ...saboresSelected, 
                ...searchResults
            ].filter(filterSabor).map(mapSabor).sort(sortSabor)
        )
    }, [searchResults, saboresSelected])

    function getSaboresSelected(){
        if(item?.pizza?.sabores && sabores.length > 0){
            let res = []
           for(let sabor of item.pizza.sabores){
            const original = sabores.find(e => equals(e.id, sabor.id))
            const _tipo = {...original.tipo, ...sabor.tipo}
            const _id = buildNewId(sabor)
            const filled = {...original, ...sabor, tipo: _tipo, id: _id}
            res.push(filled)
        }
           return res
        }else{
            return []
        }
    }

    const carregarItem = useCallback(() => {
        if(item?.pizza){

            //BLOQUEIA VALOR (PARA MUDANÇAS FORA DESTA FUNÇÃO)
            setIsPriceLocked(true)

            // //MUDA TAMANHO
            // setTamanhoSelected(String(item.pizza?.tamanho?.id) ?? null)

            //MUDA SABORES
            // const itemSabores = item.pizza.sabores ?? [] 
            // itemSabores.forEach(sabor => checkUncheck(sabor, true))     
            // // buildNewId
            // //MUDA OBSERVAÇÕES
            // setObservacoes(item?.observacoes ?? '')
            
            // //MUDA VALOR
            // setValor(() => {
            //     return item.valor
            // })
            setIsLoaded(true)
            
        }else{
            setIsLoaded(true)
        }
    }, [])

    const filterSabor = (e) => {
        return filtro({ nome: e.nome, numero: e.numero }, searchString)
    }

    const getFullSaborFromId = (saborId) => sabores.find(s => equals(s.id, saborId))
    const getFullIngredientesFromIds = (ingredientesIds) => ingredientes.filter(i => ingredientesIds.includes(i.id))
    const getFullTipoFromId = (tipoId) => tipos.filter(t => equals(t.id, tipoId))[0]


    const mapSabor = (e) => {
        const saborFilled = {...getFullSaborFromId(getSaborId(e)), id: e.id} 
        const ingredientesIds = e.ingredientes.map(x => Number(x.id))
        const ingredientesFilled = getFullIngredientesFromIds(ingredientesIds)
        .map(i => {
            return{...i, tipoAdd: e.ingredientes.filter(ei => ei.id === i.id)[0]?.tipoAdd || ''}
        })
        const tipoFilled = getFullTipoFromId(e.tipo.id)
        const fullSabor = {...saborFilled, tipo: tipoFilled, ingredientes: ingredientesFilled}
        return fullSabor 
    }

    const sortSabor = (a, b) => {
        const _selected = () =>
        String(a.id).includes('s') ? -1
        : String(b.id).includes('s') ?  1 : null

        const _number = () => 
        a.numero > b.numero ? 1
        : a.numero < b.numero ? -1 : null

        return _selected() ?? _number()
    }

    function focusSearch(){
        searchRef.current.focus()
    }

    function abrirIngredientesComponent(sabor) {
        setIngredientesComponent(
            <IngredientesLista sabor={sabor} />
        )
    }
    function fecharIngredientesComponent() {
        setIngredientesComponent(<></>)
        focusSearch()
    }

    function getSaborId(sabor) {return String(sabor.id).split('s')[0]}
    function getTodosIngredientes(sabor) {return sabor.ingredientes.map(e => ingredientes.filter(i => i.id === e.id)[0].nome).join(', ')}
    function getIsSelected(sabor) {return saboresSelected.map(e => String(e.id)).includes(String(sabor.id))}
    function buildNewId(sabor) {return getSaborId(sabor) + 's' + saboresSelectedUpdates}

    function getIngredientesDescritos(sabor, retornarTudo = true) {
        let res = ''
        const concatRes = i => {res = join([res, `${i.tipoAdd} ${i.nome}`], ', ')}
        const temTipoAdd = sabor.ingredientes.map(i => i.tipoAdd ?? '').join('').length > 0
        const saborOriginal = temTipoAdd ? {
            ...getFullSaborFromId(getSaborId(sabor)),
            tipo: getFullTipoFromId(sabor.tipo.id),
            ingredientes: getFullIngredientesFromIds(sabor.ingredientes.map(e => Number(e.id)))
        } : sabor
        if (temTipoAdd) {
            const ingredientesModificados = sabor.ingredientes.filter(i => i.tipoAdd && i.tipoAdd !== '')

            for (let ingredienteModificado of ingredientesModificados) {
                const tipoAddModificadoUpperCase = ingredienteModificado.tipoAdd.toUpperCase()
                if (['POUCO','BASTANTE'].includes(tipoAddModificadoUpperCase)) {
                    concatRes(ingredienteModificado)
                } else {
                    let ingrOriginais = saborOriginal.ingredientes.map(e => String(e.id))
                    const temNosIngredientesOriginais = ingrOriginais.includes(String(ingredienteModificado.id))
                    if (
                        (!temNosIngredientesOriginais && tipoAddModificadoUpperCase === 'COM') ||
                        (temNosIngredientesOriginais && tipoAddModificadoUpperCase === 'SEM') 
                    ){ concatRes(ingredienteModificado) }
                }
            }
        }        
        return (res === '' && retornarTudo) ? getTodosIngredientes(saborOriginal) : res
    }

    function replaceSabor(sabor, novoSabor){
        if(sabor.id || novoSabor.id){
            setSaboresSelected(prev => [
                ...prev.filter(e => !equals(e.id, sabor.id)),
                {...novoSabor, id: getIsSelected(sabor) ? sabor.id : buildNewId(novoSabor)},
            ])

        }else{
            console.error('Sabor sem id!')
        }
    }

    function checkUncheck(sabor, check) {

        const insertSabor = (novoSabor) => 
            setSaboresSelected(prev => [...prev, novoSabor])

            
            const removeSabor = (sabor) => 
            setSaboresSelected(prev => prev.filter(p => !equals(p.id, sabor.id)))
            
            if (check) {
                let novoSabor = { ...sabor, id: buildNewId(sabor) }
                insertSabor(novoSabor)
            } else {
                removeSabor(sabor)
            }
            
            setSearchString('')
            focusSearch()
        }

    async function ativarDesativar(sabor){
        const payload = {
            sabor: {...sabor, ativo: !sabor.ativo}
        }
        await api().post('pizzas/salvar/sabor', payload) 
        refresh()
    }       

    return (
        <PizzaContext.Provider value={{
            saborHovered, setSaborHovered, saborHoveredRef,
            isPriceLocked, setIsPriceLocked,
            searchRef, focusSearch, 
            checkUncheck, replaceSabor,
            searchString, setSearchString,
            finalResults,
            isHoverLocked, setIsHoverLocked,
            getIsSelected, getIngredientesDescritos, getSaborId,
            abrirIngredientesComponent, fecharIngredientesComponent,
            ingredientesComponentResult, setIngredientesComponentResult,

            item, isLoaded,
            tamanhoSelected, setTamanhoSelected,
            saboresSelected, setSaboresSelected,
            observacoes, setObservacoes,
            valor, setValor,
            ativarDesativar,
            
            callback,
        }}>
            <Container className='container pizza'>
                <TamanhosLista />
                <SaboresLista />
                <Rodape />
                {ingredientesComponent}
            </Container>
        </PizzaContext.Provider>
    )
}

export const usePizza = () => {
    return useContext(PizzaContext)
}

const Container = styled.div`
    width: 90%;
    height: 90%;
    @media (max-width: 550px){
        height: 80%;
    }
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
    gap: 2px;

`