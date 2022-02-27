import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SearchBar } from "../../../components/SearchBar";
import { useEnderecos } from "../../../context/enderecosContext";
import * as Format from "../../../util/Format";
import * as cores from '../../../util/cores'
import * as misc from '../../../util/misc'
import { useCadEndereco } from "../../../context/cadEnderecosContext";
import { useRotas } from "../../../context/rotasContext";
import * as apis from '../../../apis'
import ListaProvider from "../../../context/listaContext";
import { Lista } from "../../../components/Lista";
import { useContextMenu } from "../../../components/ContextMenu";
function EndLocLista(props) {
  
  const [search, setSearch] = useState("");

  function openFilter() {}

  const { enderecos, locais, bairros } = useEnderecos();
  const [filtered, setFiltered] = useState([])
  const [lista, setLista] = useState();
  const {currEL, setCurrEL, setTipoEL, tiposEL} = useCadEndereco()
  const { setCurrentRoute } = useRotas()

  const {contextMenu} = useContextMenu()

  function editar(e){
    if(props.tabs){
      let preenchido = !misc.isNEU(misc.joinObj(currEL))

      const getEmpty = (obj) => {return obj ? obj : ''}
  
      if (
        currEL.id && currEL.id === e.id && 
        (misc.isNEU(getEmpty(currEL.local)) === misc.isNEU(getEmpty(e.local)))
        ) {
        setCurrentRoute(props.tabs[1].link)
      } else if ((preenchido && window.confirm("Deseja cancelar a edição atual?")) || !preenchido) {
        setCurrEL(e)
        
        misc.isNEU(getEmpty(e.local)) 
        ? setTipoEL(tiposEL[0])
        : setTipoEL(tiposEL[1])
  
        setCurrentRoute(props.tabs[1].link)
      }
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
    let temp1 = enderecos.map(e => {return{...e, 
      bairro: bairros.filter(b => b.id === e.bairro.id)[0]
    }})
    
    let temp2 = locais.map(e => {return{...e,
       ...temp1.filter(en => en.cep === e.cep)[0], 
       id: -e.id
    }})

    let temp = [...buildTemp(temp1, 10), ...buildTemp(temp2, 5)]

    function buildTemp(t, max){
      return t.filter(e => misc.filtro(e, search))
      .sort((a,b) => a.bairro.taxa < b.bairro.taxa 
      ? -1 : a.bairro.taxa > b.bairro.taxa ? 1 : 0)
      .slice(0, max)
    }
    
    setFiltered(temp)

  }, [search, enderecos, locais, bairros]) // eslint-disable-line

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

        <ListaProvider fullDataArray={filtered} itemDoubleClick={props.itemClick ?? itemClick} itemRightClick={openContext} >
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

  .lista-component-li{
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
      user-select: none;
      .inicio{
        font-size: 14px;
      }
      .centro{
        font-size: 13px;
        strong,label{
          display: block;
        }
        .bottom{
          p{
          font-size: 12px;
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
