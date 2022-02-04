import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Lista } from '../../components/Lista'
import ListaProvider from '../../context/listaContext'
import * as Format from '../../util/Format'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import * as cores from '../../util/cores'
import { usePizzas } from '../../context/pizzasContext'
import * as misc from '../../util/misc'
import { SearchBar } from '../../components/SearchBar'

export default function Pizza({ item }) {
  const [selected, setSelected] = useState([])
  const { tamanhos, sabores, ingredientes } = usePizzas()
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [lista, setLista] = useState([])
  const [hovered, setHovered] = useState(null)

  const specialKeys = ['ArrowDown', 'ArrowUp', 'Enter']
  const alphaNum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
  const [specialKeyPressed, setSpecialKeyPressed] = useState(null)

  const order = (a, b) => {
    if (a.numero > b.numero) return 1
    if (a.numero < b.numero) return -1
    if (a.numero === b.numero) return 0
  }
  useEffect(() => {
    setFiltered(sabores.filter(filtroVisivel).filter(e => misc.filtro({ nome: e.nome, numero: e.numero }, search)))
  }, [search])

  useEffect(() => {
    setLista(
      [...selected, ...filtered]
      .filter(filtroVisivel).filter(e => misc.filtro({ nome: e.nome, numero: e.numero }, search))
      .sort(order)
    )
  }, [filtered,selected])
//   useEffect(() => {
//     setLista(
//       [...selected, ...filtered].sort(order)
//     )
//   }, [filtered, selected])
  
  useEffect(() => {
    document.addEventListener('keydown', onPressValidator)
    document.addEventListener('keyup', onPressValidator)
    return () => {
      document.removeEventListener('keydown', onPressValidator)
      document.removeEventListener('keyup', onPressValidator)
    }
  }, []) //eslint-disable-line
  function onPressValidator(event) {
    if (event.type === 'keydown') {
     
        if([...alphaNum, 'BACKSPACE'].some(e => e === event.key.toUpperCase()) 
        && document.activeElement !== searchRef.current){
            // setSearch(prev => `${prev}${event.key}`)
            searchRef.current.focus()
        }else{
            onPress(event.key, event.key)
        }
    } else if (event.type === 'keyup') {
      onPress(event.key, null)
    }
  }

  function onPress(key, value) {
    
    if(specialKeys.some(e => e === key)){
        setSpecialKeyPressed(value)
    }
  }

  function focusBusy() {
    let focusedElement = document.activeElement
    let isInput = focusedElement.nodeName.toLowerCase() === 'input'
    let isNotSearch = focusedElement.getAttribute('type') !== 'search'
    return isInput && isNotSearch
  }
  useEffect(() => {
    if (specialKeyPressed && lista.length > 0 && !focusBusy()) {
      let index = hovered ? lista.map(e=>e.id).indexOf(hovered.id) : -1
      const up = { is: specialKeyPressed === 'ArrowUp', val: index > 0 ? lista[index - 1] : lista[index] }
      const down = {
        is: specialKeyPressed === 'ArrowDown',
        val: index < lista.length - 1 ? lista[index + 1] : lista[index],
      }
      const enter = { is: specialKeyPressed === 'Enter' && (hovered || lista.length === 1) }

      if (enter.is) {
          const current = hovered ? hovered : lista[0]
            checkUncheck(current, !String(current.id).includes('s'))
      } else {
        setHovered(up.is ? up.val : down.val)
      }
    }
  }, [specialKeyPressed]) //eslint-disable-line

  function filtroVisivel(e) {
    return e.visivel
  }

  function itemDoubleClick(e) {}
  function openContext(e) {}
const [selectedAdded, setSelectedAdded] = useState(0)
  const listaRef = useRef()

function checkUncheck(e, check){
    if(check){
        setSelected([...selected, { ...e, id: e.id+'s'+ (selectedAdded + 1)}])
        setSelectedAdded(prev => prev + 1)
    }else{
        setSelected(prev => prev.filter(p => p.id !== e.id))
    }
    setSearch('')
}
const searchRef = useRef()
  return (
    <Container className='container pizza'>
      <select className='tamanho' defaultValue={'Selecione o tamanho...'}>
        <option key={0} disabled>
          Selecione o tamanho...
        </option>
        {tamanhos.filter(filtroVisivel).map(e => (
          <option key={e.id} disabled={!e.ativo}>
            {e.nome}
          </option>
        ))}
      </select>
      <div className='middle'>
        <SearchBar _ref={searchRef} value={search} setValue={setSearch} />
        <ul className='lista-sabores' ref={listaRef}>
          {lista.map(e => {
            return (
              <li
                key={e.id}
                className={`sabor ${
                        hovered && misc.equals(hovered.id, e.id) 
                        ? ' ativo' : ''}
                    ${
                        selected.some(s => misc.equals(s.id, e.id)) 
                        ? ' selecionado' : ''
                    }`}
                onDoubleClick={() => itemDoubleClick(e)}
                onMouseEnter={() => setHovered(e)}
                onMouseLeave={() => setHovered(null)}
                onContextMenu={event => {
                  event.preventDefault()
                  openContext(e)
                }}
              >
                <div className='inicio'>
                    <p className='numero'>{e.numero}º</p>
                  <input
                    type={'checkbox'}
                    defaultChecked={selected.some(s => misc.equals(s.id, e.id))}
                    onChange={event => {
                      if (event.target.checked) {
                        checkUncheck(e, true)
                        event.target.checked = false
                      } else {
                        checkUncheck(e, false)
                      }
                    }}
                  ></input>
                </div>
                <div className='centro'>
                  <section>
                    <span className='tipo' style={{ color: e.tipo.cor }}>{`(${Format.formatAbrev(
                      e.tipo.nome
                    )}) `}</span>
                    <span className='nome'>{e.nome}</span>
                  </section>
                  <p>{e.ingredientes.map(e => e.nome).join(', ')}</p>
                </div>
                <button className='botao' onClick={() => openContext(e)}>
                  <FontAwesomeIcon icon={icons.faEllipsisV} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div className='bottom'></div>
    </Container>
  )
}

const Container = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;

  select {
    width: 100%;
    padding: 10px;
    font-size: 22px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .middle {
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 50px;
    .lista-sabores {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-height: 50px;
      width: 100%;

      @media (min-width: 550px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: max-content;
        row-gap: 5px;
        column-gap: 5px;
      }

      overflow-y: auto;
      height: 100%;

      .sabor {
        display: flex;
        align-items: center;
        padding: 5px;
        gap: 5px;
        border: 1px solid black;
        background-color: ${cores.brancoEscuro};
        flex-basis: 70px;

        * {
        pointer-events: none;
      }
      .inicio {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;

        .numero{
            font-size: 10px;
            font-style: italic;
        }
        input {
              pointer-events: all;
              width: 30px;
              height: 30px;
              cursor: pointer;
            }
      }
      .centro {
        flex-grow: 2;

        span {
          font-weight: 600;
          font-size: 17px;
        }

        p {
          font-size: 13px;
          font-weight: 600;
        }
      }
      button {
        background-color: transparent;
        border: none;
        outline: none;
        font-size: 20px;
        padding: 5px 15px;
        cursor: pointer;
        pointer-events: fill;
      }
      &.ativo {
        background-color: ${cores.cinzaEscuro};
        * {color: white;}
      }
      &.selecionado {
        background-color: ${cores.verde};
        * {color: white;}
        &.ativo {
        background-color: lime;
      }
      }
      }
    }
  }

  .bottom {
    flex-shrink: 0;
    height: 50px;
    border-top: 1px solid black;
    background-color: red;
  }
`
