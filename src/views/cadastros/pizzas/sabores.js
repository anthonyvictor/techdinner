import React, {useState,useEffect} from 'react';
import styled from 'styled-components';
import * as misc from '../../../util/misc'
import * as format from '../../../util/Format'
import * as cores from '../../../util/cores'
import { SearchBar } from '../../../components/SearchBar';
import { usePizzas } from '../../../context/pizzasContext';
import { Lista } from '../../../components/Lista';
import CadPizzasProvider, { useCadPizzas } from '../../../context/cadPizzasContext';
import Ingredientes from './ingredientes';
import ListaProvider from '../../../context/listaContext';
import { useContextMenu } from '../../../context/contextMenuContext';

function Sabores() {
    const {sabores, tipos, ingredientes} = usePizzas()

    const {searchSab: search, setSearchSab: setSearch,
    listaSab: lista, setListaSab: setLista,
    currSab: curr, setCurrSab: setCurr} = useCadPizzas()

    const [showIngrList, setShowIngrList] = useState(false)
    const {contextMenu} = useContextMenu()

    const [filtered, setFiltered] = useState([]) //sabores.filter(e => misc.filtro(e, search))

    useEffect(() => {
        setFiltered(sabores.filter(e => misc.filtro(e, search)))
    }, [search]) //eslint-disable-line

    useEffect(() => {
      if (filtered) {
        setLista(
          filtered.map((e) => (
            <li key={e.id}>
              <label 
              className={`item-ativo ${e.ativo ? 'true' : 'false'}`} 
              title={e.ativo
                ? 'Este item está ativo para novos pedidos.'
                : 'Este item está desativado para novos pedidos.'}
              ></label>
              <div className='centro'>
                  <section>
                      <span className='tipo' style={{color: e.tipo.cor}}>{`(${format.formatAbrev(e.tipo.nome)}) `}</span>
                      <span className='nome'>{`${e.numero} - ${e.nome}`}</span>
                      {!e.visivel && <strong className={`item-visivel ${e.visivel
                        ? 'true' : 'false'}`}> - {e.visivel
                        ? 'Visível' : 'Invisível'}</strong>}
                  </section>
                  
                  <p>{e.ingredientes.map(e => e.nome).join(', ')}</p>
              </div>
            </li>
          ))
        )
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

function fecharIngrList(){
    setShowIngrList(false)
}

function ingrListCallBack(selecionados){
  setCurr({...curr, ingredientes: selecionados})
  setShowIngrList(false)
}

function alterarCurrTipo(obj){
  if(curr){
    if(curr.tipo){
      const prevTipo = {...curr.tipo, ...obj}
      setCurr({...curr, tipo: prevTipo})
    }else{
      setCurr({...curr, tipo: obj})
    }
  }else{
    setCurr({tipo: obj})
  }
}

  return (
    <Container>
      <div className='esq'>
        <SearchBar value={search} setValue={setSearch} />

        <ListaProvider fullDataArray={filtered} itemDoubleClick={itemClick} itemRightClick={openContext} >
          <Lista >
            {lista}
          </Lista>
        </ListaProvider>

      </div>

      <form className='dir'>
        
        <label>{curr && !misc.isNEU(curr.id) ? `iD: ${curr.id}` : 'Novo!' }</label>
        
        <section className='descricao-numero-container'>
          <section className='descricao-container'>
            <label htmlFor='descricao'>Descrição:</label>
            <input id='descricao' name='descricao'
            value={curr && curr.nome ? curr.nome : ''}
            onChange={e => setCurr({...curr, nome: e.target.value})}
            onBlur={e => e.target.value = e.target.value.trim()}
            />
          </section>
          <section className='numero-container'>
            <label htmlFor="numero">Número:</label>
            <input id="numero" name="numero"
            type={'number'} min={1}
            value={curr && curr.numero ? curr.numero : ''}
            onChange={(e) => setCurr({...curr, numero: e.target.value})}
            onBlur={e => {e.target.value = e.target.value.trim()}}
             />
          </section>
        </section>

        <section className='tipo-container'>
          <label htmlFor="tipo">Tipo:</label>
          <div className='tipo-cor-container'>
            <input id="tipo" name="tipo" list='tipos-lista'
            value={curr && curr.tipo && curr.tipo.nome ? curr.tipo.nome : ''}
            onChange={(e) => alterarCurrTipo({nome: e.target.value})} />
            <input id='cor' name='cor' type={'color'} 
            value={curr && curr.tipo && curr.tipo.cor ? curr.tipo.cor : '#000000'} 
            onChange={(e) => alterarCurrTipo({cor: e.target.value})} />
          </div>
          <datalist id='tipos-lista'>
              {tipos.map((e) => <option key={e.id}>{e.nome}</option>)}
            </datalist>
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


        <section className='ingredientes-container'>
          <label htmlFor='ingredientes'>Ingredientes:</label>
          <ul id='ingredientes' className='ingredientes-lista'>
            {curr && !misc.isNEU(curr.ingredientes) && curr.ingredientes.map(e => (
              <li key={e.id}>
                <p>{e.nome}</p>
                <button type='button' onClick={() => 
                  setCurr({...curr, 
                  ingredientes: curr.ingredientes
                  .filter(i => !misc.equals(i.id, e.id))})}>x</button>
              </li>
            ))}
          </ul>
          <button id='adicionar-ingrediente' type='button'
          onClick={() => {
            setShowIngrList(true)
            }}>Adicionar</button>
        </section>

        <div className="botoes">
          <button type="button" id='salvar'>Salvar</button>
          <button type="button" id="limpar" onClick={() => limpar(true)}>Limpar</button>
        </div>

      </form>
      {showIngrList && 
        <IngrListContainer onClick={e => e.currentTarget === e.target && fecharIngrList()}>
            <CadPizzasProvider>
              <div className='center-container'>
        
                <Ingredientes fullDataArray={ingredientes} 
                selectedDataArray={curr && curr.ingredientes ? curr.ingredientes : []}
                setResponseArray={ingrListCallBack} 
                itemDoubleClick={itemClick} itemRightClick={openContext}
                allowMultiSelect={true} allowKeyPressObserver={false}
                />

            </div>
          </CadPizzasProvider>    
        </IngrListContainer>
      }

    </Container>
  )
}

export default Sabores;

const IngrListContainer = styled.div`
  background-color: rgba(0,0,0,.8);
  position: absolute;
  height: 100% ;
  width: 100% ;
  display: flex;
  justify-content: center;
  align-items: center;

  .center-container{
    background-color: ${cores.branco};
    width: min(350px, 80%);
    height: min(600px, 80%);
    display: flex;
    flex-direction: column;

    

  }

`

const Container = styled.div`
position: relative;
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

    .lista-component{
    li{
      div{
        flex-grow: 2;

        span{
            font-weight: 600;
            font-size: 17px;
        }

        p{
            font-size: 13px;
            font-weight: 600;
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

  .item-visivel {
            &.true {
              color: ${cores.verde};
            }

            &.false {
              color: ${cores.vermelho};
            }
          }

  }


  .dir{
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 20px;
   
    width: 400px;

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
      flex-shrink: 0;

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

    .descricao-numero-container{
      flex-direction: row;
      gap: 15px;
      

      .descricao-container{
        flex-grow: 0;
        flex-shrink: 3;
        width: 100%;
        max-width: 100%;
      }

      .numero-container{
        flex-grow: 0;
        flex-shrink: 3;
        width: 60px;;
      }
    }

    .tipo-container{
      .tipo-cor-container{
        display: flex;
        gap: 5px;
        #tipo{
          width: 70%;
        }
        #cor{
          height: 100% ;
        }
      }
    }

    .ingredientes-container{
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      gap: 5px;
      flex-direction: column;
      height: 250px;
      justify-content: stretch;
      justify-self: stretch;

      .ingredientes-lista{
        flex-grow: 2;
        display:grid;
        border: 1px solid black;
        overflow-y: auto;
        grid-template-columns: 48% 48%;
        grid-auto-rows: 30px;
        row-gap: 7px;
        padding: 7px 0 5px 5px;
        column-gap: 7px;
        box-sizing: border-box;

        li{
          display: flex;
          padding: 5px;
          border: 1px solid black;
          height: 100%;
          background-color: ${cores.brancoEscuro};
          align-items: center;

          p{
            font-size: 15px;
            flex-grow: 2;
          }
          button{
            background-color: transparent;
            border: none;
            padding: 0 30px;
            font-size: 15px;
            cursor: pointer;
            color: ${cores.vermelho};
          }

          &:hover{
            *{font-weight: 600;}
          }
        }
      }

      #adicionar-ingrediente{
        flex-shrink: 0;
        height: 40px;
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

  }


  @media (max-width: 400px){
    display: block;
    overflow-y: auto;
    .esq{
      height: 50% ;
    }
    .dir{
      overflow-y: auto;
      width: 100%;
      .descricao-numero-container{
      display: flex;
      flex-direction: column;
      gap: 15px;

      .descricao-container{
        flex-grow: 2;
      }

      .numero-container{
        flex-grow: 2;
        width: 100%;
      }
      }

        .ingredientes-container{
        min-height: 250px;

        
      }

      .tipo-container{
      .tipo-cor-container{
        display: flex;
        gap: 5px;
        #tipo{
          width: 70%;
        }
        #cor{
          height: 40px ;
        }
      }
    }
    }
  }
`;
