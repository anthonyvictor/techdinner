import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SearchBar } from '../../../components/SearchBar';
import { useEnderecos } from '../../../context/enderecosContext';
import { useCadEndereco } from '../../../context/cadEnderecosContext';
import * as misc from '../../../util/misc'
import * as Format from "../../../util/Format";
import * as cores from '../../../util/cores'
import { useContextMenu } from '../../../context/contextMenuContext';
import ListaProvider from '../../../context/listaContext';
import { Lista } from '../../../components/Lista';

function Bairros() {
  
  const {bairros} = useEnderecos()
  const {currBai, setCurrBai, limparBai} = useCadEndereco()
  const [search, setSearch] = useState('')
  const [lista, setLista] = useState('')
  const [filtered, setFiltered] = useState([])

  function ordem(a,b){
    if(a.taxa > b.taxa) return 1
    if(a.taxa < b.taxa) return -1
    // if(a.localeCompare(b))
    if(a.nome > b.nome) return 1
    if(a.nome < b.nome) return -1
  }

  useEffect(() => {
    setFiltered(bairros.filter(e => misc.filtro(e, search)))
  }, [search]) //eslint-disable-line

  useEffect(() => {
    if (filtered) {
      setLista(
        filtered.sort(ordem).map((e) => (
          <li key={e.id}>
            <label className='centro'>{e.nome + ' - ' + Format.formatReal(e.taxa)}</label>
          </li>
        ))
      );
    }
  }, [filtered])

  const {contextMenu} = useContextMenu()
 
  function openContext(e) {
    contextMenu([
      {title: 'Editar', click:() => editar(e), enabled: true, visible: true},
      {title: 'Excluir', click:() => excluir(e), enabled: true, visible: true}
    ])
  }

  function editar(e){
    let preenchido = currBai.nome.length > 0 ?? false

    if ((preenchido && window.confirm("Deseja cancelar a edição atual?")) 
    || !preenchido) {
      setCurrBai(e)
    }
  }

  function excluir(e){}

  return (
    <Container>
      
      <div className='esq'>
        <SearchBar value={search} setValue={setSearch} filter={() => {}} />

        <ListaProvider fullDataArray={filtered} itemDoubleClick={editar} itemRightClick={openContext} >
          <Lista>
              {lista}
          </Lista>
        </ListaProvider>

        {/* <ul id='bairros-lista'>
          {lista}
        </ul> */}
      </div>

      <form className='dir'>
        
        <label>{!misc.isNEU(currBai.id) ? `iD: ${currBai.id}` : 'Novo!' }</label>
        
        <section>
          <label htmlFor='descricao'>Descrição:</label>
          <input id='descricao'
          value={currBai.nome}
          onChange={e => setCurrBai({...currBai, nome: e.target.value})}
          onBlur={e => e.target.value = e.target.value.trim()}
          />
        </section>

        <section>
          <label htmlFor='taxa'>Taxa:</label>
          <input id='taxa' type={'number'} min={0} step={'.5'}
          value={currBai.taxa} inputMode='decimal'
          onChange={e => 
            setCurrBai(
              {...currBai, taxa: e.target.value})}
              onKeyDown={e => {
                if(e.key.replace(/[^0-9,]/,'').length === 0){e.preventDefault()}
              }}
          // onBlur={e => e.target.value = Format.formatReal(e.target.value.trim())}
          />
        </section>

        <div className="botoes">
          <button type="button" id='salvar'>Salvar</button>
          <button type="button" id="limpar" onClick={() => limparBai(true)}>Limpar</button>
        </div>

      </form>

    </Container>
    )
}

export default Bairros;

const Container = styled.div`
  display: flex;
  justify-content: stretch;
  gap: 10px;
  overflow-y: auto;

  .esq{
    border: 1px solid black;
    padding: 10px;
    flex-grow: 2;
    display: flex;
    flex-direction: column;

      label{
        flex-grow: 2;
        flex-shrink: 2;
        font-weight: 600;
      }
  }

  .dir{
    flex-grow: 1;
    display: flex;
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

  @media (max-width: 550px){
    flex-direction: column-reverse;
  }

`