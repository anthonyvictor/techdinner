import React, { useState, useEffect } from 'react';
import { Lista } from '../../../components/Lista';
import { usePizzas } from '../../../context/pizzasContext';
import styled from 'styled-components';
import { SearchBar } from '../../../components/SearchBar';
import * as misc from '../../../util/misc'
import * as cores from '../../../util/cores'
import { useCadPizzas } from '../../../context/cadPizzasContext';
import ListaProvider from '../../../context/listaContext';
import { useContextMenu } from '../../../context/contextMenuContext';


function Ingredientes(props) {
    const {ingredientes} = usePizzas()

    const {searchIngr:search, setSearchIngr:setSearch,
      listaIngr:lista, setListaIngr:setLista,
      currIngr:curr, setCurrIngr:setCurr} = useCadPizzas()

      const {contextMenu} = useContextMenu()
      const [filtered, setFiltered] = useState([]) //ingredientes.filter(e => misc.filtro(e, search))

    useEffect(() => {
    setFiltered(ingredientes.filter(e => misc.filtro(e, search)))
    }, [search]) //eslint-disable-line

    useEffect(() => {
      if (filtered) {
        setLista(filtered.map((e) => 
              <li key={e.id} >
                <label className='centro'>{e.nome}</label>
              </li>
            ))
      }
    }, [filtered])//eslint-disable-line
 
  function openContext(e) {

    contextMenu([
      {title: 'Editar', click:() => editar(e)},
      {title: 'Excluir', click:() => excluir(e)},
    ])

  }

  function editar(e){
    let preenchido = curr && curr.nome && (curr.nome.length > 0 ?? false)

    if ((preenchido && window.confirm("Deseja cancelar a edição atual?")) 
    || !preenchido) {
      setCurr(e)
    }
  }

  function excluir(e){}

  function limpar(confirm) {
    const res = confirm && window.confirm("Limpar formulário?");
    if (res) {
        setCurr(null);
    }
  }
  function itemClick(item){
    editar(item)
  }

  function ThisListaProvider({children}){
    if(props.fullDataArray){
      return (
        <ListaProvider fullDataArray={props.fullDataArray} selectedDataArray={props.selectedDataArray}
        setResponseArray={props.setResponseArray} 
        itemDoubleClick={props.itemDoubleClick} itemRightClick={props.itemRightClick}
        allowMultiSelect={props.allowMultiSelect} allowKeyPressObserver={props.allowKeyPressObserver} >
          {children}
        </ListaProvider>
      )
    }else{
      return (
        <ListaProvider fullDataArray={filtered} itemDoubleClick={itemClick} itemRightClick={openContext} >
          {children}
        </ListaProvider>
      )
    }
  }
  return (
    <Container className='ingredientes-component'>

        <div className='esq'>

        <SearchBar value={search} setValue={setSearch} />    

        <ThisListaProvider>
          <Lista >
            {lista}
          </Lista>
        </ThisListaProvider>

        </div>
        
        <form className={props.allowMultiSelect ? 'dir hidden' : 'dir'}
        >
        <label>{curr && !misc.isNEU(curr.id) ? `iD: ${curr.id}` : 'Novo!' }</label>
        
        <section>
          <label htmlFor='descricao'>Descrição:</label>
          <input id='descricao'
          value={curr && curr.nome ? curr.nome : ''}
          onChange={e => setCurr({...curr, nome: e.target.value})}
          onBlur={e => e.target.value = e.target.value.trim()}
          />
        </section>

        <div className="botoes">
          <button type="button" id='salvar'>Salvar</button>
          <button type="button" id="limpar" onClick={() => limpar(true)}>Limpar</button>
        </div>
        </form>
    </Container>
    )
}

export default Ingredientes;

export const Container = styled.div`
  display: flex;
  justify-content: stretch;
  gap: 10px;
  overflow-y: auto;
  height: 100% ;

  .esq{
    border: 1px solid black;
    padding: 10px;
    flex-grow: 2;
    display: flex;
    flex-direction: column;

    width: 100% ;
    height: 100% ;



    }

    .dir{
    flex-grow: 1;
    display: flex;

    &.hidden{
      display: none;
    }

    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 20px;

      section{
        width: 100% ;
        display:flex;
        flex-direction: column;
        label{
        display: block;
      }
      input{
        flex-grow: 2;
        font-size: 20px;
        text-transform: uppercase;
        padding: 5px 0; 
        min-width: 350px;
      }
    }

    .botoes{
      display: flex;
      height: 50px;
      gap: 20px;
      width: 100% ;

      button{
        border: 2px solid black;
        font-size: 18px;
        cursor: pointer;
      }

      #salvar{
        flex-grow: 3;
        background-color: ${cores.verde};
      }
      #limpar{
        flex-grow: 1;
        background-color: ${cores.vermelho};
      }
    }

  }

  @media (max-width: 400px){
    flex-direction: column;
  }
`;