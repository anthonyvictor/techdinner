import React, {useState,useEffect} from 'react';
import styled from 'styled-components';
import ListaProvider from '../../../context/listaContext';
import { usePizzas } from '../../../context/pizzasContext';
import * as Format from '../../../util/Format';
import * as misc from '../../../util/misc'
import { Lista } from '../../../components/Lista';
import * as cores from '../../../util/cores'
import { useCadPizzas } from '../../../context/cadPizzasContext';
import { SearchBar } from '../../../components/SearchBar';
import { useContextMenu } from '../../../context/contextMenuContext';

function Tamanhos() {
  const {tamanhos, tipos, valores} = usePizzas()


  const {searchTam: search, setSearchTam: setSearch,
    listaTam: lista, setListaTam: setLista,
    currTam: curr, setCurrTam: setCurr
  } = useCadPizzas()

  const {contextMenu} = useContextMenu()

  const [filtered, setFiltered] = useState([]) //tamanhos.filter(e => misc.filtro(e, search))

  useEffect(() => {
    setFiltered(tamanhos.filter(e => misc.filtro(e, search)))
  }, [search]) //eslint-disable-line

  useEffect(() => {
    if (filtered) {
      setLista(
        filtered.map((e) => (
          <li className='item-li' key={e.id}>
            <label className={`item-ativo ${e.ativo ? 'true' : 'false'}`} 
            title={e.ativo
              ? 'Este item está ativo para novos pedidos.'
              : 'Este item está desativado para novos pedidos.'}></label>
  
            <div className='centro'>
                <section className='nome-container'>
                    <span className='nome'>{e.nome}</span>
                    {!e.visivel && <strong className={`item-visivel ${e.visivel
                    ? 'true' : 'false'}`}> - {e.visivel
                    ? 'Visível' : 'Invisível'}</strong>}
                </section>
                <ul className='valores-container'>
                    {valores.filter(v => v.tamanho.id === e.id).map(v =>
                      <ColoredLi key={v.id} cor={v.tipo.cor}>
                        <span className='tipo-span'>{Format.formatAbrev(v.tipo.nome)}: </span>
                        <span>{Format.formatReal(v.valor)}</span>
                      </ColoredLi>
                    )}
                </ul>
            </div>
          </li>
        ))
      );
    }
  }, [filtered])//eslint-disable-line

  function openContext(e) {
    contextMenu([
      {title: 'Editar', click:() => editar(e)},
      {title: 'Excluir', click:() => excluir(e)},
    ])
  }

  function editar(e){
    let preenchido = !misc.isNEU(curr)

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

  function itemClick(e){
  editar(e)
  }
  
  const [valoresDoCurrTamanho, setValoresDoCurrTamanho] = useState([])
  useEffect(() => {
      setValoresDoCurrTamanho(curr && curr.id ? valores.filter(v => v.tamanho.id === curr.id):[])
  }, [curr])//eslint-disable-line

function contem(i) {
  valores
  .map(valor => [valor.tipo.id, valor.tamanho.id]
    .join(',')).includes([i.id,curr.id].join(','))
  }

  function sortValores(a, b){
    if(curr && curr.id){


      return !(contem(a) ^ contem(b)) ? 0 : contem(a) ? -1 : 1
    }else{ return 0}
  }

  function handleValorChange(valor, tipo){

    setValoresDoCurrTamanho(prev => {
      const arr1 = prev.filter(v => v.tipo.id !== tipo.id)
      const obj = {tipo: tipo, valor: valor}
      return [...arr1, obj]})
  }

  return (
    <Container tipos={tipos}>
      <div className='esq'>
      <SearchBar value={search} setValue={setSearch} />
      <ListaProvider fullDataArray={filtered} itemDoubleClick={itemClick} itemRightClick={openContext} >
          <Lista >
            {lista}
          </Lista>
        </ListaProvider>
      </div>

      <div className='dir'>

        <label>{curr && !misc.isNEU(curr.id) ? `iD: ${curr.id}` : 'Novo!' }</label>



          <section className='nome-container'>
            <label htmlFor='nome'>Nome:</label>
            <input id='nome' name='nome'
            value={curr && curr.nome ? curr.nome : ''}
            onChange={e => setCurr(prev => {return {...prev, nome: e.target.value}})}
            onBlur={e => e.target.value = e.target.value.trim()}
            />
          </section>

          <section className='visivel-ativo-container'>

            <section className='visivel-container'>
              <label htmlFor="visivel">Visível:</label>
              <input id="visivel" name="visivel"
              type={'checkbox'}
              checked={curr ? (curr.visivel ?? true) : true}
              onChange={(e) => setCurr(prev => {return {...prev, visivel: e.target.checked}})}
              />
            </section>

            <section className='ativo-container'>
              <label htmlFor="ativo">Ativo:</label>
              <input id="ativo" name="ativo"
              type={'checkbox'}
              checked={curr ? (curr.ativo ?? true) : true}
              onChange={(e) => setCurr(prev => {return {...prev, ativo: e.target.checked}})}
              />
            </section>

        </section>

        <section className='valores-container'>
          <label htmlFor='valores'>Valores:</label>
          <ul id='valores' className='valores-lista'>
            {/* {listaValores} */}
            {tipos.sort(sortValores).map(tipo =>
          <li key={tipo.id}>
            <p>{tipo.nome}</p>
            <input type={'number'} className='valor-input' step={.5}
            value={valoresDoCurrTamanho.filter(v => v.tipo.id === tipo.id).map((v) => v.valor)[0] ?? 0}
            onChange={e => handleValorChange(e.target.value, tipo)}
            />
          </li>
          )}
          </ul>
        </section>

        <div className="botoes">
          <button type="button" id='salvar'>Salvar</button>
          <button type="button" id="limpar" onClick={() => limpar(true)}>Limpar</button>
        </div>
      </div>
    </Container>
  )
}

export default Tamanhos;



const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: stretch;
  gap: 10px;
  overflow-y: auto;

  .esq {
    border: 1px solid black;
    padding: 10px;
    flex-grow: 2;
    display: flex;
    flex-direction: column;

    .lista-component {
      .item-li {
        .inicio {
        }
        div {
          flex-grow: 2;

          span {
            font-weight: 600;
            font-size: 17px;
          }

          p {
            font-size: 13px;
          }
        }
      }

      .centro {
        .nome-container {
          font-size: 17px;
          font-weight: 600;

          .item-visivel {
            &.true {
              color: ${cores.verde};
            }

            &.false {
              color: ${cores.vermelho};
            }
          }
        }
        ul {
          list-style: none;
          display: flex;
          flex-direction: row;
        }
      }
    }
  }

  .dir {
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 20px;

    width: 400px;

    section {
      width: 100%;
      display: flex;
      flex-direction: column;
      label {
        display: block;
      }
      input {
        flex-grow: 2;
        font-size: 20px;
        text-transform: uppercase;
        padding: 5px 0;
      }
    }

    .botoes {
      display: flex;
      height: 50px;
      gap: 20px;
      width: 100%;
      flex-shrink: 0;

      button {
        border: 2px solid black;
        font-size: 18px;
        cursor: pointer;
      }

      #salvar {
        flex-grow: 3;
        background-color: ${cores.verde};
      }
      #limpar {
        flex-grow: 1;
        background-color: ${cores.vermelho};
      }
    }

    .descricao-numero-container {
      flex-direction: row;
      gap: 15px;

      .descricao-container {
        flex-grow: 0;
        flex-shrink: 3;
        width: 100%;
        max-width: 100%;
      }

      .numero-container {
        flex-grow: 0;
        flex-shrink: 3;
        width: 60px;
      }
    }

    .visivel-ativo-container {
      flex-direction: row;
      justify-content: flex-start;
      section {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        * {
          padding: 0;
        }
        gap: 5px;
        label {
          text-align: center;
        }
        input {
          flex-grow: 0;
          width: 20px;
          height: 20px;
        }
      }
    }

    .tipo-container {
      .tipo-cor-container {
        display: flex;
        gap: 5px;
        #tipo {
          width: 70%;
        }
        #cor {
          height: 100%;
        }
      }
    }

    .valores-container {
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      gap: 5px;
      flex-direction: column;
      height: 250px;
      justify-content: stretch;
      justify-self: stretch;
      

      .valores-lista {
        flex-grow: 2;
        display: grid;

        grid-template-columns: auto auto;
        grid-auto-rows: 40px;

        border: 1px solid black;
        overflow-y: auto;
        row-gap: 7px;
        padding: 5px;
        column-gap: 5px;

        li {
          display: flex;
          padding: 5px;
          border: 1px solid black;
          height: 100%;
          width: 100%;
          background-color: ${cores.brancoEscuro};
          align-items: center;

          p {
            flex-grow: 2;
          }

          .valor-input {
            width: 70px;
            flex-grow: 0;
            font-size: 13px;
          }
        }
      }
    }
  }

  .item-ativo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-block;
    pointer-events: all !important;
    border: 2px solid black;

    &.true {
      background-color: ${cores.verde};
    }
    &.false {
      background-color: ${cores.vermelho};
    }
  }
  @media (max-width: 550px) {
    display: block;
    overflow-y: auto;
    .esq {
      height: 50%;
    }
    .dir {
      overflow-y: auto;
      width: 100%;
      .descricao-numero-container {
        display: flex;
        flex-direction: column;
        gap: 15px;

        .descricao-container {
          flex-grow: 2;
        }

        .numero-container {
          flex-grow: 2;
          width: 100%;
        }
      }

      .ingredientes-container {
        min-height: 250px;
      }
    }
  }
`;

const ColoredLi = styled.li`
  padding: 2px !important;
  background-color: transparent !important;
  *{
    font-size: 12px !important;
  }
  .tipo-span {
    color: ${(props) => props.cor};
  }
`;