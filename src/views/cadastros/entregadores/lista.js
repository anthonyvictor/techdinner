import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import ListaProvider from '../../../context/listaContext';
import { Lista } from '../../../components/Lista';
import * as cores from '../../../util/cores'
import { SearchBar } from '../../../components/SearchBar';
import { useContextMenu } from '../../../components/ContextMenu';
import { useEntregadores } from '../../../context/entregadoresContext';
import { useCadEntregadores } from '.';

export const Lista = () => {

    const {entregadores} = useEntregadores()
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([])
    const {contextMenu} = useContextMenu()
    const {curr, setCurr} = useCadEntregadores(null)
    const [lista, setLista] = useState(null)
    
    
    useEffect(() => {
        setFiltered(entregadores.filter(e => misc.filtro({...e, imagem: ''}, search)))
        }, [search, entregadores]) //eslint-disable-line
    
    useEffect(() => {
      if (filtered) {
        setLista(filtered.map((e) => 
            <li key={e.id} >

                <label className={`item-ativo ${e.ativo ? 'true' : 'false'}`} ></label>

                <div className='centro'>
                    <label className='nome'>{e.nome}</label>
                </div>
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
        let preenchido = !misc.isNEU(misc.joinObj(curr))
    
        if ((preenchido && window.confirm("Deseja cancelar a edição atual?")) 
        || !preenchido) {
          setCurr(e)
        }
      }
    
      function excluir(e){}
    
      function itemClick(item){
        editar(item)
      }
    return (
      <Container>
          <SearchBar value={search} setValue={setSearch} />
          <ListaProvider
            fullDataArray={filtered}
            itemDoubleClick={itemClick}
            itemRightClick={openContext}
          >
            <Lista>{lista}</Lista>
          </ListaProvider>
      </Container>
    );
}

const Container = styled.div`
  background-color: ${cores.branco};
  flex-shrink: none;
  width: 100%;
    border: 1px solid black;
    padding: 10px;
    display: flex;
    flex-direction: column;

    .lista-component-li {
      user-select: none;
      .item-ativo {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-block;
        pointer-events: all;
        border: 2px solid black;

        &.true {
          background-color: ${cores.verde};
        }
        &.false {
          background-color: ${cores.vermelho};
        }
      }

      .img {
        display: flex;
        flex-direction: column;
        width: 40px;
        height: 100%;
        justify-content: center;
        

        img {
          border-radius: 10%;
          border: 2px solid black;
          flex-grow: 0;
          flex-shrink: 0;
          height: 40px;
          object-fit: scale-down;
          background-color: white;
        }

        .icone{
            font-size: 30px;
            margin: auto; 
            width: 100% ;
        }
      }

      .centro{
          .nome{
              font-size: 17px;
              font-weight: 600;
          }
          .bottom{
              *{font-size: 13px;}
          }
      }
    }
`;