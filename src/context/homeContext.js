import React, { createContext, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRotas } from './rotasContext'
import * as cores from '../util/cores'

const HomeContext = createContext()

function HomeProvider(props) {
  const [curr, setCurr] = useState(null)
  const [tabs, setTabs] = useState([])
  const { setCurrentRoute } = useRotas()
  const [selectBox, setSelectBox] = useState(null)

  useEffect(() => {
    // console.log('VERIFICA SE JÁ TEM ALGUMA TAB COM O CLICADO SE N TIVER ELE ADICIONA',curr)
    if (curr) {
      if (tabs.length === 0 || !tabs.some(e => e.id === curr.id)) {
        //se n tiver tabs ou se nenhuma tab for a current
        setTabs(prev => [...prev, curr]) //adiciona a current nas tabs
      }
      setCurrentRoute('/pedido/' + curr.id)
    } else {
      setCurrentRoute('/home')
    }
  }, [curr])

  function fechar(tab) {
    if (curr && curr.id === tab.id) {
      if (tabs.length >= 2) {
        setCurr(prev => tabs[tabs.map(e => e.id).indexOf(prev.id) - 1])
      } else {
        setCurr(null)
      }
    }
    setTabs(prev => prev.filter(e => e.id !== tab.id))
  }

  function fecharSelectBox(e) {
    if (e && e.target !== e.currentTarget) {
      return
    }
    setCurrentRoute('/pedido' + (curr && curr.id ? `/${curr.id}` : ''))
    setSelectBox(null)
  }

  function openSelectBox(element) {
    setSelectBox(
      <SelectBox className='absolute-black' onMouseDown={e => fecharSelectBox(e)}>
        {element}
      </SelectBox>
    )
  }

  return (
        <HomeContext.Provider
      value={{
        curr,
        setCurr,
        tabs,
        setTabs,
        showLista: props.showLista,
        setShowLista: props.setShowLista,
        fechar,
        openSelectBox,
        fecharSelectBox,
      }}
    >
      {props.children}
      {selectBox}
    </HomeContext.Provider>
  )
}

export default HomeProvider

export const useHome = () => {
  return useContext(HomeContext)
}

const SelectBox = styled.div`
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;

    > .container {
      animation: aparecer 0.2s linear;
      background-color: ${cores.branco};
      padding: 10px;
      border-radius: 20px;
      box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &.tipo {
        width: 220px;
        height: 200px;
        flex-grow: 0;
        flex-shrink: 0;

        .tipo-lista {
          flex-grow: 2;
          list-style: none;
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 10%;
          padding: 10px;
          li {
            font-size: 22px;
            font-weight: 600;
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            cursor: pointer;

            &:hover {
              font-size: 25px;
            }
            &.caixa {
              background-color: ${cores.cinza};
            }
            &.entrega {
              background-color: ${cores.azul};
            }
          }
        }
      }
      &.cliente {
        width: 85%;
        height: 90%;
        @media (max-width: 760px) {
          height: 80%;
          width: 95%;
        }
        flex-shrink: 0;
        flex-grow: 0;
        overflow: hidden;
        gap: 5px;
        /* *{flex-shrink: 2!important} */

        .tabs-buttons {
          display: flex;
          width: 100%;
          height: 50px;
          gap: 20px;
          flex-shrink: 0;
          flex-grow: 0;
          padding: 0 20px;

          button {
            border: none;
            background-color: transparent;
            border-bottom: 1px solid black;
            flex-grow: 1;
            font-size: 18px;
            font-weight: 900;
            cursor: pointer;

            &:hover {
              color: ${cores.azulDark};
            }
          }
        }
      }
      &.semcadastro {
        width: 350px;
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 20px;
        gap: 5px;
        .titulo {
          text-align: center;
        }
        input {
          width: 100%;
          font-size: 16px;
          padding: 5px;
        }
        button {
          height: 50px;
          flex-grow: 0;
          flex-shrink: 0;
          font-size: 18px;
          width: 90%;
        }
      }
      &.itens {
        display: grid;
        grid-template-columns: 50% 50%;
        column-gap: 5px;
        row-gap: 5px;
        grid-auto-rows: auto;
        width: 60%;
        height: 70%;
        @media (max-width: 550px) {
          width: 80%;
          height: 300px;
        }
        button {
          width: 100%;
          height: 100%;
          border: 2px solid black;
          border-radius: 10px;
          cursor: pointer;
          color: white;

          &.disabled {
          }

          svg {
            font-size: 35px;
          }

          label {
            font-size: 20px;
            font-weight: 900;
            transition: font-size 0.1s linear;
          }
          &:hover:not(.disabled) {
            label {
              font-size: 25px;
            }
          }
          &.disabled {
            cursor: initial;
            pointer-events: none;
            * {
              color: rgba(0, 0, 0, 0.3);
            }
          }
        }
        button:last-child {
          grid-column: 1 / span 2;
        }
      }
    }
`
