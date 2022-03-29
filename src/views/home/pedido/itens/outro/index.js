import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import styled from 'styled-components';
import { SearchBar } from '../../../../../components/SearchBar';
import { filtro, equals, isNEU } from '../../../../../util/misc';
import * as cores from '../../../../../util/cores'
import { useItens } from '../itens';
import { Rodape } from './rodape';
import { OutrosLista } from './outros';
import { Keyer } from '../../../../../components/Keyer';
import { useApi } from '../../../../../api';
import { useOutros } from '../../../../../context/outrosContext';

const OutroContext = createContext()

export default function Outro(){
  const {item, callback} = useItens()
  const {outros, refresh} = useOutros()
  const {api} = useApi()

  const [currentSelected, setCurrentSelected] = useState(item?.outro)
  
  const [valor, setValor] = useState((item && item.valor) ? item.valor : 0)
  const [observacoes, setObservacoes] = useState(item && item.observacoes ? item.observacoes : '')
  const [qtd, setQtd] = useState(1)

  const [currentHovered, setCurrentHovered] = useState(null)
  const [isHoverLocked, setIsHoverLocked] = useState(false)

  const [searchString, setSearchString] = useState('') //string containing keywords to find in objects 
  const [searchResults, setSearchResults] = useState([]) //array after filtering by keywords 

  const searchRef = useRef()
  const currentHoveredRef = useRef()

  useEffect(() => {

    const timer = setTimeout(() => {
      if(outros.length > 0){
        atualizarLista()
      }
    }, 500);

    return () => clearTimeout(timer)
  }, [searchString, outros]) //eslint-disable-line
  
  useEffect(() => {
    if(isHoverLocked){
        setCurrentHovered(null)
    }
  },[isHoverLocked])

  useEffect(() => {
      if(searchResults.length > 0) setIsHoverLocked(true)
  }, [searchResults])

  useEffect(() => {
    currentSelected && setValor(currentSelected.valor)
  }, [currentSelected])

  function atualizarLista(){
    const novaLista = [
      ...outros
      .filter(e => filtroOutro(e))
      .sort((a,b) => ordemOutro(a,b))
      .slice(0, searchString.length > 0 ? 25 : 12)
    ]

    const novacurrentSelected = 
    (currentSelected && 
    (!novaLista.find(e => equals(e.id, currentSelected.id))) &&
    (searchString.length === 0 || filtroOutro(currentSelected))) 
    ? {...currentSelected} : null

    setSearchResults(novacurrentSelected ? [novacurrentSelected, ...novaLista] : novaLista)
  }

  function filtroOutro(e){
    const newE = {
      ...e, imagem: '',
  }
    const isResult = filtro(newE, searchString),
          isVisible = !!e.visivel,
          isItem = item?.outro?.id === e.id

    return isResult && (isVisible || isItem)
  }

  function ordemOutro(a,b){
    const ativo = () => isActive(a) && !isActive(b) ? -1 : !isActive(a) && isActive(b) ? 1 : 0   
    const vendido = () => a.vendidos > b.vendidos ? -1 : a.vendidos < b.vendidos ? 1 : 0
    return ativo() || vendido()
  }

  async function ativarDesativar(outro){
    const payload = {
        tipoPost: 'ativo',
        outro: {id: outro.id, ativo: !outro.ativo}
    }
    await api().post('outros/salvar', payload) 
    refresh()
  } 

  function avancar(outro=null){
    const newOutro = {...(outro || currentSelected), imagem: ''}
    const newValor = outro ? outro.valor : valor
    delete newOutro.imagem
    if(!isNEU(newOutro)){
      for (let q = 1; q <= qtd; q++) {
        const novoItem = {
          ...item, 
          id: q > 1 ? null : item.id,
          observacoes: observacoes,
          tipo: 3,
          valor: newValor,
          outro: newOutro,
        }
        callback(novoItem)
      }
    }else{
        alert('Selecione um item!')
    }
  }

  function focusSearch(){
    searchRef.current.focus()
  }

  function isHovered(outro){return currentHovered && equals(currentHovered.id, outro.id)}
  function isSelected(outro){ return currentSelected && equals(currentSelected.id, outro.id)} 
  function isActive(outro){ return !!outro.ativo} 

  return (
    <OutroContext.Provider value={{
      currentSelected, setCurrentSelected,
      searchString, setSearchString, 
      searchRef, focusSearch,
      searchResults, setSearchResults,
      ativarDesativar, avancar, 
      currentHovered, setCurrentHovered, currentHoveredRef,
      isHovered, isSelected, isActive,
      isHoverLocked, setIsHoverLocked,
      valor, setValor,
      observacoes, setObservacoes,
      qtd, setQtd,

    }}>
      <Outro2 />

      <Keyer searchRef={searchRef} focusSearch={focusSearch} finalResults={searchResults} 
            currentHovered={currentHovered} setCurrentHovered={setCurrentHovered} 
            currentHoveredRef={currentHoveredRef}
            canClick={isActive} click={avancar} />

    </OutroContext.Provider>
  )
}

export const useOutro = () => {
  return useContext(OutroContext)
}

const Outro2 = () => {

  const {searchString, setSearchString, searchRef} = useOutro()

  return (
      <Container className='container'>
        <SearchBar _ref={searchRef} value={searchString} setValue={setSearchString} />
        <OutrosLista />
        <Rodape />
      </Container>
  )
}

const Container = styled.div`
  background-color: ${cores.brancoEscuro};
  width: 90%;
  height: 80%;
  display: flex;
  flex-direction: column;
`;
