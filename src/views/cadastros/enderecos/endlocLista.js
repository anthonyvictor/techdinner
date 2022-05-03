import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SearchBar } from "../../../components/SearchBar";
import { useEnderecos } from "../../../context/enderecosContext";
import * as Format from "../../../util/Format";
import { cores } from '../../../util/cores'
import * as misc from '../../../util/misc'
import { useCadEndereco } from '.';
import { useRotas } from "../../../context/rotasContext";
import * as apis from '../../../apis'
import ListaProvider from "../../../context/listaContext";
import { Lista } from "../../../components/Lista";
import { useContextMenu } from "../../../components/ContextMenu";
import { useTabControl } from "../../../components/TabControl";

function EndLocLista() {
  
  const [search, setSearch] = useState("");
  const {tabs, currentTab, setCurrentTab} = useTabControl()
  function openFilter() {}

  const { enderecos, locais, bairros } = useEnderecos();
  const [filtered, setFiltered] = useState([])
  const [lista, setLista] = useState();
  const {currEL, setCurrEL, setTipoEL, tiposEL, callback} = useCadEndereco()
  const { setCurrentRoute } = useRotas()

  const {contextMenu} = useContextMenu()

  function editar(e){
    if(tabs.length === 1) return
      let preenchido = !misc.isNEU(misc.joinObj(currEL))

      const getEmpty = (obj) => {return obj ? obj : ''}
  
      if (
        currEL.id && currEL.id === e.id && 
        (misc.isNEU(getEmpty(currEL.local)) === misc.isNEU(getEmpty(e.local)))
        ) {
        setCurrentTab(tabs[1])
      } else if ((preenchido && window.confirm("Deseja cancelar a edição atual?")) || !preenchido) {
        setCurrEL(e)
        
        misc.isNEU(getEmpty(e.local)) 
        ? setTipoEL(tiposEL[0])
        : setTipoEL(tiposEL[1])
  
        setCurrentTab(tabs[1])
      }
    
  }

  function maps(e){
    apis.enderecoToUrl(e).then(url => window.open(url))
  }
  
  function excluir(e){}

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
    return Format.formatEndereco(endereco, true, true)
  }

  function openContextCopiar(endereco) {

    contextMenu([
      {title: 'CEP', 
      text: endereco.cep,
      enabled: true, visible: true},

      {title: 'Tudo', 
      text: c_end(endereco),
      enabled: true, visible: true}
    ])
  }

  useEffect(() => {
    const searchStringNumero = search.replace(/[^0-9]/)
    const searchString = formatString(search)
    let temp1 = enderecos.map(e => {return{...e, 
      bairro: bairros.filter(b => b.id === e.bairro.id)[0]
    }})
    
    let temp2 = locais.map(e => {return{...e,
      ...temp1.filter(en => en.cep === e.cep)[0], 
      id: -e.id
    }})
    
    let temp = [...buildTemp(temp2, 3), ...buildTemp(temp1, 10)]

    function buildTemp(t, max){
      return t.filter(e => filtro(e, searchString, searchStringNumero))
      .sort((a,b) => a.bairro.taxa < b.bairro.taxa 
      ? -1 : a.bairro.taxa > b.bairro.taxa ? 1 : 0)
      .slice(0, max)
    }
    
    setFiltered(temp)

  }, [search, enderecos, locais, bairros]) // eslint-disable-line

  const formatString = (a) => a.toUpperCase().replace(/[^a-zA-Z0-9, ]/gi, "")

  function filtro(obj, searchString, searchStringNumero) {
    if (search !== "") {
      let objString = formatString(misc.joinObj(obj))
      let objStringNumero = objString.replace(/[^,0-9]/)

      const p1 = objString.includes(searchString)
  
      const p2 = objStringNumero.includes(searchStringNumero)
  
      const p3 = misc.removeConjuncoes(objString).includes(misc.removeConjuncoes(searchString))
  
      return p1 || p2 || (!p1 && p3)
    }
      return true;
  }

  useEffect(() => {
    if (filtered) {
      setLista(
        filtered.map((e) => (
          <li key={e.id}>
            <h3 className="inicio">{Format.formatReal(e.bairro.taxa)}</h3>
            <div className="centro">
              <strong>
                {Format.formatEndereco({local: e.local, numero: e.numero, referencia: e.referencia}, false, true, false)}
              </strong>
              <label>
                {Format.formatEndereco(e, false, false, false)}
              </label>
              <div className="bottom">
              <p>Cep: {Format.formatCEP(e.cep)}</p>
            </div>
            </div>
            
          </li>
        ))
      );
    }
  }, [filtered])

  return (
    <Container>
      <SearchBar value={search} setValue={setSearch} filter={openFilter} />

        <ListaProvider fullDataArray={filtered} itemDoubleClick={callback ?? itemClick} itemRightClick={openContext} >
         <Lista>
            {lista}
        </Lista>
        </ListaProvider>
    </Container>
  );
}

export default EndLocLista;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  padding: 5px;
  background-color: ${cores.branco};
  height: calc(100% - 50px);

  .lista-component-li{
    user-select: none;
      .inicio{
        font-size: 16px;
      }
      .centro{
        font-size: 15px;
        strong,label{
          display: block;
        }
        strong{font-size: 12px}
        .bottom{
          p{
          font-size: 12px;
          font-style: italic;
        }
        }
       
      }
    }

  @media (max-width: 550px){
    .lista-component-li{
      .inicio{
        font-size: 12px;
      }
      .centro{
        *{font-size: 10px;}
        
        strong,label{
          display: block;
        }
        .bottom{
          p{
          font-size: 9px;
          font-style: italic;
        }
        }
       
      }
    }
  }
  
  /* #endloc-lista{
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

      @media (max-width: 550px){
        .centro{
          font-size: 8px!important;
          background-color: red;
        }
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
  } */

`;
