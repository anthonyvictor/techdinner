import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { SearchBar } from '../../components/SearchBar';
import { useContextMenu } from '../../components/ContextMenu';
import ListaProvider from '../../context/listaContext';
import { useOutros } from '../../context/outrosContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import * as Format from '../../util/Format'
import * as misc from '../../util/misc'
import * as cores from '../../util/cores'
import { Lista } from '../../components/Lista';

export default function Outro({item}) {
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])
  const [lista, setLista] = useState(null)
  const { outros } = useOutros()
  const {contextMenu} = useContextMenu()
  const [valor, setValor] = useState((item && item.valor) ? item.valor : 0)
  const [observacoes, setObservacoes] = useState(item && item.observacoes ? item.observacoes : '')
  const [lock, setLock] = useState(false)
  const [qtd, setQtd] = useState(1)
  const searchRef = useRef()
  const [selected, setSelected] = useState(item ? [item.outro] : [])

  useEffect(() => {
    setFiltered(
      outros
      .filter(e => misc.filtro({...e, imagem: ''}, search) 
      && (e.visivel === true || item && item.id === e.id))
      .sort((a,b) => a.vendidos > b.vendidos ? 1 : -1)
    )
    }, [search]) //eslint-disable-line
    useEffect(() => {
      if(item && item.bebida){
        setLock(true)
        setValor(item.valor)
      }

  },[item])

    useEffect(() => {
      let l = filtered.map((e) => 
        <li key={e.id}
        className={selected && selected.id === e.id ? 'selected' : undefined}>
          <div className='img'>
              {!misc.isNEU(e.imagem)  
              ? <img src={e.imagem} /> 
              : <FontAwesomeIcon className='icone' icon={icons.faIceCream} />}
          </div>
          <label className='nome'>{e.nome}</label>
          <label className='valor'>{Format.formatReal(e.valor)}</label>
        </li>
      )
        setLista(l)
    }, [filtered])//eslint-disable-line

  function itemClick(e){

  }
  function openContext(e){
    contextMenu([
      { title: 'Ativar/Desativar', click: () => {} }
    ])
  }
  return (
      <Container className='container'>
        <SearchBar _ref={searchRef} value={search} setValue={setSearch} />
        <ListaProvider fullDataArray={filtered}
         searchRef={searchRef}
         selectedDataArray={selected}
        setResponseArray={setSelected} 
        allowSelect={true}
         grid={true}
         itemDoubleClick={itemClick}
         itemRightClick={openContext}
         itemDoubleClickCondition={(e) => {
          return e.ativo
         }}>
            <Lista>
              {lista}
            </Lista>
        </ListaProvider>
        <div className='bottom'>
                <div className='middle'>
                    <div className='valor'>
                      <label>Valor:</label>
                      <input type={'number'} min={0} step={0.5}
                      value={valor}
                      onChange={e => setValor(e.target.value)} />
                    </div>

                    <div className='observacoes'>
                      <button onClick={() => {
                        contextMenu([
                          {title: 'Copos',
                          click:() => {
                            const sc = (t) => {setObservacoes(prev=>[prev,`${t} Copos`].filter(e=>e!=='').join(', '))}
                            sc(prompt('Digite a quantidade de copos',2))
                          }},
                          {title: 'Já levou',
                          click:() => {
                            setObservacoes(prev=>[prev,`Ja levou`].filter(e=>e!=='').join(', '))
                          }},
                        ])
                      }}>OBS</button>
                      <input
                      value={observacoes}
                      onChange={e => setObservacoes(e.target.value)} />
                    </div>

                    <div className='qtd'>
                      <label>Qtd:</label>
                      <input type={'number'} min={1} step={1}
                      value={qtd} disabled={lock}
                      onChange={e => setQtd(e.target.value)} />
                    </div>
                </div>
                <button className='avancar' disabled={selected.length === 0}>AVANÇAR</button>
            </div>
      </Container>
  )
}

const Container = styled.div`
  background-color: ${cores.brancoEscuro};
  width: 90%;
  height: 80%;
  display: flex;
  flex-direction: column;

  .lista-component{
    ul{
      height: 100%;
      width: 100%;
      gap: 8px;
      display: grid;
      padding: 0 0 8px 0;
      /* grid-auto-columns: 50%; */
      /* grid-auto-rows: 150px; */
      /* grid-auto-flow: row; */
      /* overflow: hidden; */
      /* grid-template-columns: repeat(auto-fit, minmax(120px, 30%)); */
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      .lista-component-li {
        user-select: none;
        width: 100%;
        max-width: 120px;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 10%;

        /* &.selected{
          background-color: yellow;
        } */

          .img {
          
          display: flex;
          height: 80px;
          width: 70px;
          justify-content: center;
          min-height: 10px;

          img {
            border-radius: 10%;
            border: 2px solid black;
            flex-grow: 0;
            height: 100%;
            width: 100%;
            object-fit: cover;
          }

          .icone{
              font-size: 50px;
              margin: auto; 
              width: 100% ;
          }
        }

        .nome{
            font-size: 13px;
            font-weight: 600;
        }
        .valor{
            font-size: 17px;
            font-weight: 600;
        }
        .bottom{
            *{font-size: 13px;}
        }
        }

        .botao{
          display: none;
        }
      }
    }


  >.bottom {
        flex-shrink: 0;
        border-top: 1px solid black;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;

        .resumo {
            overflow-x: auto;
            width: 100%;
            text-align: center;
            flex-shrink: 0;
        }
        .middle {
          height: 30px;
          display: flex;
          gap: 10px;
          width: 100%;
          *{font-size: 16px;}

          button{padding: 0 5px;}
          .valor, .qtd{
            display: flex;;
            gap: 2px;
            align-items: center;
            

            input{
              width: 70px;
              height: 100%;
            }
            button{
              height: 100%;
              width: 40px;
              &.true{
                color: ${cores.vermelho};
              }
              &.false{
                color: ${cores.verde};
              }
            }
          }
          .observacoes{
            display: flex;
            flex-grow: 2;
            gap: 2px;
            input{
              flex-grow: 2;
              width: 100%;
            }
          }
          @media (max-width: 550px){
          flex-direction: column;
            height: 80px;
            gap: 2px;
            padding-top: 5px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            
          .valor, .qtd{
            grid-row: 2;
            width: 100%;
            flex-grow: 2;
            justify-content: center;
            button{
              width: 60px;
            }
            input{
              flex-grow: 2;
            }
          }
          .observacoes{
            grid-column: 1 / span 2;
            width: 100%; 
            button{
              width: 80px;
            }
          }
        }
        }
        .avancar {
            min-height: 40px;
            flex-grow: 2;
            width: 60%;
            background-color: ${cores.verde};
            border: 2px solid black;
            border-radius: 5px;
            margin-top: 5px;
            @media (max-width: 550px){
              width: 100%;
              min-height: 50px;
            }
        }
    }

`;