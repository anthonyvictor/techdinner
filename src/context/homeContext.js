import React, { createContext, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRotas } from './rotasContext'
import * as cores from '../util/cores'
import { useApi } from '../api'
import { FecharButton } from '../components/FecharButton'
import { usePedidos } from './pedidosContext'

const HomeContext = createContext()

function HomeProvider(props) {
  const [curr, setCurr] = useState(null)
  const [tabs, setTabs] = useState([])
  const { setCurrentRoute } = useRotas()
  const [selectBox, setSelectBox] = useState(null)
  const [entregadorPadrao, setEntregadorPadrao] = useState(null)
  const {novo} = usePedidos()
  const {api} = useApi()

  const [filtroExibicao, setFiltroExibicao] = useState('')

  useEffect(() => {
    let montado = true
    api().get('entregadores/padrao').then(e => montado && setEntregadorPadrao(e.data))
    return () => {montado = false}
  }, [])

  useEffect(() => {
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

  function fecharPedido(tab) {
    if (curr && curr.id === tab.id) {
      if (tabs.length >= 2) {
        setCurr(prev => tabs[tabs.map(e => e.id).indexOf(prev.id) - 1])
      } else {
        setCurr(null)
      }
    }
    setTabs(prev => prev.filter(e => e.id !== tab.id))
  }

  function closeSelectBox() {
    setCurrentRoute('/pedido' + (curr && curr.id ? `/${curr.id}` : ''))
    setSelectBox(null)
  }

  function askForCloseSelectBox(e, skipAsk=false){
    
    if (e && e.target !== e.currentTarget) return

    e.preventDefault()
    e.stopPropagation()
    
    if(skipAsk || window.confirm('Deseja realmente fechar esta tela?')){
      closeSelectBox()
    
    }
  }

  function openSelectBox(element) {
    setSelectBox(
      <SelectBox className='absolute-black' 
      onDoubleClick={e => askForCloseSelectBox(e, true)}>
        <FecharButton fechar={e => askForCloseSelectBox(e, true)} />
        {element}
      </SelectBox>
    )
  }

  async function novoPedido(){
    const res = await novo()
    if(res){
      setCurr(res)
    }
  }

  return (
        <HomeContext.Provider
        value={{
        curr, 
        setCurr,
        novoPedido,
        tabs,
        setTabs,
        showLista: props.showLista,
        setShowLista: props.setShowLista,
        fecharPedido,
        openSelectBox, closeSelectBox,
        entregadorPadrao,
        filtroExibicao, setFiltroExibicao

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
    overflow: hidden;
    *{user-select: none;}
    
    > .close-button{
      position: absolute;
      right: 2%;
      top: 2%;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      background-color: white;
      
      @media (hover: hover) and (pointer: fine){
        &:hover{
          background-color: yellow;
        }
      }
      
    }
    
    @keyframes baixo-cima{
      from{
        transform: translateY(100%);
        opacity: 0;
      }
      to{
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    > .container {
      /* position: relative; */
      animation: baixo-cima 0.15s ease-out;
      background-color: ${cores.branco};
      padding: 10px;
      border-radius: 20px;
      box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      gap: 2px;

      &.entregador{
        width: min(400px, 80%);
        height: 150px;
        h1{
          margin: auto 0;

        }
        select{
          width: 100%;
          font-size: 18px;
          padding: 5px 0;
        }
        button{
          width: 100%;
          height: 50px;
        }
      }

      &.endereco{
        width: 80%;
        height: 80%;
        > section{
          flex-direction: column;
          align-items: center;
          border: none;
          box-shadow: none;

          #endereco-right {
            width: 100%;
            height: 100%;
            *{width: 100%;}
          }
        }
        > button{
            width: 80%;
            height: 50px;
            background-color: ${cores.verde};
            font-size: 18px;
            cursor: pointer;
            border: 2px solid black;
          }
      }

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
            border: 1px solid black;
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
            &.disabled {
              pointer-events: none;
              color: gray;
              cursor: default;
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

        .lista-clientes, .cadastro-clientes{
          flex-grow: 2;
        }

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

        @media (max-width: 550px){
          width: 80%;
          height: 300px;
          min-height: 250px;
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

      .rodape{
            width: 100% ;
            padding: 10px;
            border-top: 1px solid gray;
            text-align: center;
            font-size: 10px;
            color: gray;
            padding: 0 10px;
        }
      
    }
    
`
