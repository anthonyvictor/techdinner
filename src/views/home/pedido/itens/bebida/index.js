import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import styled from 'styled-components';
import { SearchBar } from '../../../../../components/SearchBar';
import { useBebidas } from '../../../../../context/bebidasContext';
import { filtro, join, equals, isNEU } from '../../../../../util/misc';
import * as cores from '../../../../../util/cores'
import { useItens } from '../itens';
import { Rodape } from './rodape';
import { BebidasLista } from './bebidas';
import axios from 'axios';
import { Keyer } from '../../../../../components/Keyer';
import { useApi } from '../../../../../api';

const BebidaContext = createContext()

export default function Bebida(){
  const {item, callback} = useItens()
  const {bebidas, refresh} = useBebidas()
  const {api} = useApi()

  const [currentSelected, setCurrentSelected] = useState(item?.bebida)

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
      if(bebidas.length > 0){
        atualizarLista()
      }
    }, 500);

    return () => clearTimeout(timer)
  }, [searchString, bebidas]) //eslint-disable-line
  
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
      ...bebidas
      .filter(e => filtroBebida(e))
      .sort((a,b) => ordemBebida(a,b))
      .slice(0, searchString.length > 0 ? 25 : 12)
    ]

    const novacurrentSelected = 
    (currentSelected && 
    (!novaLista.find(e => equals(e.id, currentSelected.id))) &&
    (searchString.length === 0 || filtroBebida(currentSelected))) 
    ? {...currentSelected} : null

    setSearchResults(novacurrentSelected ? [novacurrentSelected, ...novaLista] : novaLista)
  }

  function filtroBebida(e){
    const newE = {
      ...e, imagem: '',
      descricao1: join([e.tipo, e.nome, e.tamanho],' ') ,
      descricao2: join([e.tipo, e.nome, e.sabor || '', e.tamanho],' ') ,
      descricao3: join([e.tipo, e.tamanho],' ') ,
      descricao4: join([e.tipo, e.sabor || '', e.tamanho],' ') ,

  }
    const isResult = filtro(newE, searchString),
          isVisible = !!e.visivel,
          isItem = item?.bebida?.id === e.id

    return isResult && (isVisible || isItem)
  }

  function ordemBebida(a,b){
    const ativo = () => isActive(a) && !isActive(b) ? -1 : !isActive(a) && isActive(b) ? 1 : 0   
    const vendido = () => a.vendidos > b.vendidos ? -1 : a.vendidos < b.vendidos ? 1 : 0
    return ativo() || vendido()
  }

  async function ativarDesativar(bebida){
    const payload = {
        tipoPost: 'ativo',
        bebida: {id: bebida.id, ativo: !bebida.ativo}
    }
    await api().post('bebidas/salvar', payload) 
    refresh()
  } 

  function avancar(bebida=null){
    const newBebida = {...(bebida || currentSelected), imagem: ''}
    const newValor = bebida ? bebida.valor : valor
    delete newBebida.imagem
    if(!isNEU(newBebida)){
      for (let q = 1; q <= qtd; q++) {
        const novoId = 
        q > 1 ? null 
        : item?.id ? item.id
        : item?.ids?.length > 0 ? item.ids[0] 
        : null
        const novoItem = {
          ...item, 
          id: novoId,
          observacoes: observacoes,
          tipo: 1,
          valor: newValor,
          bebida: newBebida,
        }
        callback(novoItem)
      }
    }else{
        alert('Selecione uma bebida!')
    }
  }

  function focusSearch(){
    searchRef.current.focus()
  }

  function isHovered(bebida){return currentHovered && equals(currentHovered.id, bebida.id)}
  function isSelected(bebida){ return currentSelected && equals(currentSelected.id, bebida.id)} 
  function isActive(bebida){ return !!bebida.ativo} 

  return (
    <BebidaContext.Provider value={{
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
      <Bebida2 />

      <Keyer searchRef={searchRef} focusSearch={focusSearch} finalResults={searchResults} 
            currentHovered={currentHovered} setCurrentHovered={setCurrentHovered} 
            currentHoveredRef={currentHoveredRef}
            canClick={isActive} click={avancar} />

    </BebidaContext.Provider>
  )
}

export const useBebida = () => {
  return useContext(BebidaContext)
}

const Bebida2 = () => {

  const {searchString, setSearchString, searchRef} = useBebida()

  return (
      <Container className='container'>
        <SearchBar _ref={searchRef} value={searchString} setValue={setSearchString} />
        <BebidasLista />
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