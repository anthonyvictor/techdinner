import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SearchBar } from "../../../components/SearchBar";
import { useEnderecos } from "../../../context/enderecosContext";
import { useLocais } from "../../../context/locaisContext";
import * as Format from "../../../util/Format";
import * as cores from '../../../util/cores'
import * as misc from '../../../util/misc'
import CopyView from "../../../components/CopyView";
import { useCadEndereco } from "../../../context/cadEnderecosContext";
import { useTabControl } from "../../../context/tabControlContext";
import { useRotas } from "../../../context/rotasContext";
import * as infoLocal from '../../../util/local'
import ListaProvider from "../../../context/listaContext";
import { Lista } from "../../../components/Lista";
import { useContextMenu } from "../../../context/contextMenuContext";
function EndLocLista(props) {
  
  const [search, setSearch] = useState("");

  function openFilter() {}

  const { enderecos } = useEnderecos();
  const [filtered, setFiltered] = useState([])
  const { locais } = useLocais();
  const [lista, setLista] = useState();
  const {currEL, setCurrEL, setTipoEL, tiposEL} = useCadEndereco()
  const { tabs } = useTabControl()
  const { setCurrentRoute } = useRotas()

  const {contextMenu} = useContextMenu()
  const [copyView, setCopyView] = useState(null);

  function editar(e){
    let preenchido = !misc.isNEU(misc.joinObj(currEL))

    const getEmpty = (obj) => {return obj ? obj : ''}

    if (
      currEL.id && currEL.id === e.id && 
      (misc.isNEU(getEmpty(currEL.local)) === misc.isNEU(getEmpty(e.local)))
      ) {
      setCurrentRoute(tabs[1].link)
    } else if ((preenchido && window.confirm("Deseja cancelar a edição atual?")) || !preenchido) {
      setCurrEL(e)
      
      misc.isNEU(getEmpty(e.local)) 
      ? setTipoEL(tiposEL[0])
      : setTipoEL(tiposEL[1])

      setCurrentRoute(tabs[1].link)
    }
  }

  function maps(e){

    if(!misc.isNEU(e.logradouro)){
      let logradouro = e.logradouro.replace(/\s\(+.+\)+/,'')
      let cidade = infoLocal.MyCity()
      let estado = infoLocal.MyStateCode()
      let cep = e.cep.replace(/[-.]/,'')
      let numero = e.numero ?? ''
      let all = [logradouro, numero, cidade, estado, cep].filter(txt => !misc.isNEU(txt)).join(' ').replace(' ', '+')
      let url = `https://maps.google.com/maps?q=${all}`
  
      window.open(url)
    }else{
      throw new Error('Endereço vazio!')
    }
  }
  
  function excluir(e){}

  function copiarMobile(txt) {
    txt = Format.formatEndereco(txt, {withTaxa:true,withLocal:true})
    if (!misc.isNEU(txt)) {
        setCopyView(<CopyView txt={txt} />)
    } else {
      alert("Dados inválidos para copiar");
    }
  }

  function copiar(txt) {
    txt = Format.formatEndereco(txt, {withTaxa:true,withLocal:true})
    if (!misc.isNEU(txt)) {
        misc.copiar(txt)
    } else {
      alert("Dados inválidos para copiar");
    }
  }

  function itemClick(e){
    editar(e)
  }
  
  function openContext(e) {

    contextMenu([
      {title: 'Editar', 
      click:() => editar(e)},

      {title: 'Copiar', 
      click:() => openContextCopiar(e)},

      {title: 'Excluir', 
      click:() => excluir(e)},

      {title: 'Maps', 
      click:() => maps(e)}
    ])
  }

  function c_end(endereco){
    return Format.formatEndereco(endereco, {withTaxa: true, withLocal: true})
  }

  function openContextCopiar(endereco) {

    contextMenu([
      {title: 'CEP', 
      click:() => copiar(endereco.cep), 
      touch:() => copiarMobile(endereco.cep), 
      enabled: true, visible: true},

      {title: 'Tudo', 
      click:() => copiar(c_end(endereco)), 
      touch:() => copiarMobile(c_end(endereco)), 
      enabled: true, visible: true}
    ])
  }

  useEffect(() => {
    let temp = enderecos;
    temp = [...enderecos, ...locais.map(e => {return{...e, id: -e.id}})]  
    setFiltered(temp.filter(e => misc.filtro(e, search)))
  }, [search]) // eslint-disable-line

  useEffect(() => {
    if (filtered) {
      setLista(
        filtered.sort((a,b) => a.taxa === b.taxa ? 0 : a.taxa > b.taxa ? 1 : -1).map((e, i) => (
          <li key={e.id}>
            <h3 className="inicio">{Format.formatReal(e.taxa)}</h3>
            <label className="centro">
              {Format.formatEndereco(e, { withTaxa: false, withLocal: true })}
            </label>
          </li>
        ))
      );
    }
  }, [filtered])

  return (
    <Container>
      <SearchBar value={search} setValue={setSearch} filter={openFilter} />

        <ListaProvider fullDataArray={filtered} itemDoubleClick={props.itemClick ?? itemClick} itemRightClick={openContext} >
         <Lista>
            {lista}
        </Lista>
        </ListaProvider>
      {copyView}
    </Container>
  );
}

export default EndLocLista;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  
  #endloc-lista{
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    gap: 5px;

    li{
      display: flex;
      align-items: center;
      padding: 10px 5px;
      gap: 8px;
      border: 1px solid black;
      background-color: ${cores.brancoEscuro};

      label{
        flex-grow: 2;
        flex-shrink: 2;
        font-weight: 600;
      }

      button{
        
        background-color: transparent;
        border: none;
        outline: none;
        font-size: 20px;
        padding: 5px 15px;
        cursor: pointer;
        pointer-events: fill;
      }

      &:hover {
        button {
          color: white;
        }
        color: white;
        background-color: ${cores.cinzaEscuro};
      }
    }
  }

`;
