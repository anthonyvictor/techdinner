import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { SearchBar } from "../../../components/SearchBar";
import * as format from "../../../util/Format";
import * as misc from "../../../util/misc";

import { useClientes } from "../../../context/clientesContext";
import { useCadCli } from "../../../context/cadClientesContext";
import { useRotas } from "../../../context/rotasContext";
import { ClienteLi } from "./clienteLi";
import { Keyer } from "../../../components/Keyer";
import { nomeTags } from "../../../util/clienteUtil";

const ListaClientesContext = createContext()

export const ListaCli = ({ children }) => {
  
  const [filteredResults, setFilteredResults] = useState([])
  const [searchString, setSearchString] = useState("");
  const [finalSearchString, setFinalSearchString] = useState('') // it changes after searchString changes + 700 miliseconds
  const [currentHovered, setCurrentHovered] = useState(null)
  
  const {setCurrentRoute} = useRotas()
  const {curr, setCurr, lista} = useCadCli();
  const { clientes, setClientes, getImages, excluir } = useClientes();

  const searchRef = useRef()
  const currentHoveredRef = useRef()

  useEffect(() => {
    filterResults()       
  },[finalSearchString, clientes])

  function filterResults(){
    let pNumero = finalSearchString.replace(/[^0-9]/gi)
    let pPhone = format.formatPhoneNumber(pNumero, false)
  
    let step1 = [...clientes].filter(e => 
      filtro({
        id: e.id, 
        nomeTags: nomeTags(e),
        contato: e.contato,
        endereco: e.endereco
      }, 
      finalSearchString, pNumero, pPhone))
    let maxID = step1.length > 0 
    ? step1.map(e => e.id).reduce((max, val) => max > val ? max : val)
    : 0
    let step2 = step1.sort((a,b)=>ordem(a,b,maxID))
    let step3 = step2.slice(0, 10)
    setFilteredResults(step3) 
  }

  function focusSearch(){
    searchRef.current.focus()
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
  
  function filtro(obj, searcString, pNumero, pPhone) {
  if (searcString !== "") {
  let txt = misc.joinObj(obj)     
  
    let val = txt.toUpperCase().replace(/[^a-z0-9]/gi, "");
  
    const p1 = val.includes(finalSearchString)
  
    const p2 = val.includes(pNumero)
  
    const p3 = !misc.isNEU(pPhone) && val.includes(pPhone)
  
    const p4 = misc.removeConjuncoes(val).includes(misc.removeConjuncoes(finalSearchString))
  
    return p1 || p2 || p3 || p4
  } else {
    return true;
  }
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
    
    setFinalSearchString(
      
      misc.removeAccents(searchString)
      .toUpperCase().replace("  ", " ")
      .replace("  ", " ")
      .replace(/[^a-z0-9]/gi, ""))

    }, 700);
  
    return() => clearTimeout(timer)
  
  }, [searchString])//eslint-disable-line


  return (
    <ListaClientesContext.Provider value={{

      filtered: filteredResults, currentHovered, setCurrentHovered,
      callback, 
    }} >
      {children}

      <Keyer 
      searchRef={searchRef} focusSearch={focusSearch} 
      finalResults={filteredResults} 
      currentHovered={currentHovered} 
      setCurrentHovered={setCurrentHovered} 
      currentHoveredRef={currentHoveredRef}
      canClick={true} click={handleClick} />
    
      <ListaCli2 />

    </ListaClientesContext.Provider>
  )
}

export const useListaClientes = () => {
  
  return useContext(ListaClientesContext)
}

function ListaCli2() {
  

  function openFilter() {}
  

  return (
    <Container className="lista-clientes">
      <SearchBar value={search} setValue={setSearch} filter={openFilter} />
        <ul className="clientes-ul">
          {filteredResults.map((cliente) => <ClienteLi cliente={cliente} />)}
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
  `;
