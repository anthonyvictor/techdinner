import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { SearchBar } from "../../../components/SearchBar";
import { formatPhoneNumber } from "../../../util/Format";
import { joinObj, isNEU, removeConjuncoes, removeAccents } from "../../../util/misc";

import { useClientes } from "../../../context/clientesContext";
import { ClienteLi } from "./clienteLi";
import { Keyer } from "../../../components/Keyer";
import { nomeTags } from "../../../util/clienteUtil";
import { useCadListaClientes } from '.'

const ListaClientesContext = createContext()

export const ListaCli = () => {
  
  const [filteredResults, setFilteredResults] = useState([])
  const [searchString, setSearchString] = useState("");
  const [finalSearchString, setFinalSearchString] = useState('') // it changes after searchString changes + 700 miliseconds
  const [currentHovered, setCurrentHovered] = useState(null)
  const { clientes } = useClientes();
  const { select } = useCadListaClientes()

  const searchRef = useRef()
  const currentHoveredRef = useRef()

  useEffect(() => {
    filterResults()       
  },[finalSearchString, clientes])

  function filterResults(){
    const pNumero = finalSearchString.replace(/[^0-9]/gi)
    const pPhone = formatPhoneNumber(pNumero, false)
  
    let step1 = [...clientes].filter(e => 
      filtro({
        id: e.id, 
        nomeTags: nomeTags(e),
        contato: e.contato,
        endereco: e.endereco
      }, 
      pNumero, pPhone))
    let maxID = step1.length > 0 
    ? step1.map(e => e.id).reduce((max, val) => max > val ? max : val)
    : 0
    let step2 = step1.sort((a,b)=>ordem(a,b,maxID))
    let step3 = step2.slice(0, 10)
    setFilteredResults(step3) 
  }
  
  function ordem(a,b,maxID){
  
    const ult = (e) => 
    e.ultPedido ? Number(e.ultPedido.split('/')
    .reverse().join('') ?? 0) : 0 
    const i = (e) => e.includes(finalSearchString) 
  
    const _nomeExato = () => 
    finalSearchString.length > 0 ?
    a.nome === finalSearchString && b.nome !== finalSearchString  ? -1
    : b.nome === finalSearchString && a.nome !== finalSearchString ? 1 : null
    : null
  
    const _nomeTags = () => 
    finalSearchString.length > 3 ?
    i(nomeTags(a)) && !i(nomeTags(b)) ? -1
    : !i(nomeTags(a)) && i(nomeTags(b)) ? 1 : null
    : null
    
    const _novo = () => 
    finalSearchString.length > 3 ?
    (a.pedidos === 0 && Number(maxID) - Number(a.id) < 51) ? -1
    : (b.pedidos === 0 && Number(maxID) - Number(b.id) < 51) ? 1 : null
    : null
  
    const _pedidos = () => 
    finalSearchString.length >= 3 ?
    a.pedidos > b.pedidos ? -1 
    : a.pedidos < b.pedidos ? 1 : null
    : null
  
    const _ultPed = () => 
    finalSearchString.length > 3 ?
    ult(a) > ult(b) ? -1 
    : ult(a) < ult(b) ? 1 : null
    : null
  
    const _id = () => 
    finalSearchString.length < 4 ?
    a.id > b.id ? -1
    : a.id < b.id ? 1 : null
    : null
  
    let order = 
    _nomeExato() ?? _nomeTags() ?? 
    _novo() ?? _pedidos() ?? 
    _ultPed() ?? _id() ?? 0
  
    return order
  }
  
  function filtro(obj, pNumero, pPhone) {
  if (finalSearchString === '') return true 
  let txt = joinObj(obj)     
  
    let val = txt.toUpperCase().replace(/[^a-z0-9]/gi, "");
  
    const p1 = val.includes(finalSearchString)
    const p2 = val.includes(pNumero)
    const p3 = !isNEU(pPhone) && val.includes(pPhone)
    const p4 = removeConjuncoes(val).includes(removeConjuncoes(finalSearchString))
  
    return p1 || p2 || p3 || p4
  
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
    
    setFinalSearchString(
      
      removeAccents(searchString)
      .toUpperCase().replace("  ", " ")
      .replace("  ", " ")
      .replace(/[^a-z0-9]/gi, ""))

    }, 700);
  
    return() => clearTimeout(timer)
  
  }, [searchString])//eslint-disable-line
  
  return (
    <ListaClientesContext.Provider value={{
      searchString, setSearchString, searchRef,
      filteredResults, 
      currentHovered, setCurrentHovered, currentHoveredRef,
    
    }} >

      <Keyer 
      searchRef={searchRef} arr={filteredResults} click={select}
      hovered={{currentHovered, setCurrentHovered, currentHoveredRef}}
      />
    
      <ListaCli2 />

    </ListaClientesContext.Provider>
  )
}

export const useListaClientes = () => {
  
  return useContext(ListaClientesContext)
}

function ListaCli2() {
  

  function openFilter() {}
  
  const {filteredResults, searchString, setSearchString, searchRef} = useListaClientes() 

  return (
    <Container className="lista-clientes">
      <SearchBar _ref={searchRef} value={searchString} setValue={setSearchString} filter={openFilter} />
        <ul className="clientes-ul">
          {filteredResults.map((cliente) => <ClienteLi key={cliente.id} cliente={cliente} />)}
        </ul>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100% ;
  height: 100% ;
  flex-grow: 2;

  ul{
    display: flex;
    flex-direction: column;
    padding: 3px;
    gap: 3px;
    overflow-y: auto;
    height: 100%;
    width: 100%;
  }

  `;
