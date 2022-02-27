import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { SearchBar } from '../../components/SearchBar';
import { useBebidas } from '../../context/bebidasContext';
import { useContextMenu } from '../../components/ContextMenu';
import ListaProvider from '../../context/listaContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import * as Format from '../../util/Format'
import * as misc from '../../util/misc'
import * as cores from '../../util/cores'
import { Lista } from '../../components/Lista';

export default function Bebida({item}) {
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])
  const [lista, setLista] = useState(null)
  const {bebidas} = useBebidas()
  const {contextMenu} = useContextMenu()
  const [valor, setValor] = useState((item && item.valor) ? item.valor : 0)
  const [observacoes, setObservacoes] = useState(item && item.observacoes ? item.observacoes : '')
  const [lock, setLock] = useState(false)
  const [qtd, setQtd] = useState(1)
  const searchRef = useRef()
  const [selected, setSelected] = useState(item ? [item.bebida] : [])

  useEffect(() => {
    setFiltered(
      bebidas
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
      <li key={e.id} >
          <div className='inicio'>

              <div className='img'>
                  {!misc.isNEU(e.imagem) 
                  ? <img src={e.imagem} /> 
                  : <FontAwesomeIcon className='icone' icon={icons.faGlassCheers} />}
              
              </div>

          </div>

          <div className='centro'>
              <label className='nome'>
                {[e.nome, e.sabor ? e.sabor : '', Format.formatLitro(e.tamanho)]
                .filter(e => e !== '')
                .join(' ')}
              </label>
              <div className='bottom'>
                  <span>Preço: {Format.formatReal(e.valor)}</span>
                  <span> | Categoria: {e.tipo}</span>
              </div>
          </div>
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
        <ListaProvider fullDataArray={filtered} grid={true} searchRef={searchRef}
        selectedDataArray={selected}
        setResponseArray={setSelected} 
        allowSelect={true}
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
    display: flex;
    flex-direction: column;

    .lista-component-li {
      user-select: none;
      min-width: 10px;

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
          object-fit: cover;
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
  }


  >.bottom {
        flex-shrink: 0;
        /* height: 80px; */
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

            >.valor, .qtd{
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