import React, {createContext, useContext, useEffect, useState} from 'react';
import { Itens } from './itens';
import { formatReal } from '../../../../util/Format';
import styled from 'styled-components';
import { box } from '../box';
import { join } from '../../../../util/misc';
import { cores } from '../../../../util/cores'
import { useHome } from '../../../../context/homeContext';
import { Item } from './itemLi';
import { ItemButton } from './selectBoxItensButton';
import { usePedido } from '..';
import { getItensAgrupados } from '../../../../util/pedidoUtil';


const BoxItensContext = createContext()

export const BoxItens = () => {

    const { openSelectBox } = useHome()
    const {mudarItem} = usePedido()

      function openSelectBoxItens(item){
        openSelectBox(<Itens item={item} callback={mudarItem} />)
      }

    return (
        <BoxItensContext.Provider value={{
            openSelectBoxItens,
        }}>
            <BoxItens2 />
        </BoxItensContext.Provider>
    )
}

export const useBoxItens = () => {
    return useContext(BoxItensContext)
}

const BoxItens2 = () => {
    const [itensAgrupados, setItensAgupados] = useState([])
    const {curr, openSelectBox} = useHome()
    const {openSelectBoxItens} = useBoxItens() 
  

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [fixedSize, setFixedSize] = useState('')
    const [myClassName, setMyClassName] = useState(undefined)

    useEffect(() => {
        getMyClassName()
    }, [isCollapsed, fixedSize])

    useEffect(() => {
        getFixedSize()
    }, [itensAgrupados.length])

    useEffect(() => {
        setItensAgupados(getItensAgrupados(curr))  
      }, [curr]) 

    const toggleIsCollapsed = () => {
        setIsCollapsed(prev => !prev)
    } 

    const getFixedSize = () => {
        const itensCount = itensAgrupados.length || 0

        const newSize = 
        itensCount > 5 ? 'superlarge'
        : itensCount > 2 ? 'large'
        : itensCount > 1 ? 'big' : ''

        setFixedSize(newSize) 
    }

    function getMyClassName() {
        const base = 'box'
        const collapsed = isCollapsed ? 'collapsed' : ''
        const size = !isCollapsed ? fixedSize : ''
        setMyClassName(join([base, collapsed, size], ' '))
    }

      function openMenu(){
        openSelectBox(
            <div className='container itens'>

              <ItemButton type={'pizzas'} click={openSelectBoxItens} />
              <ItemButton type={'bebidas'} click={openSelectBoxItens} />
              <ItemButton type={'outros'} click={openSelectBoxItens} />
              <ItemButton type={'recentes'} click={openSelectBoxItens} />
              <ItemButton type={'combos'} click={openSelectBoxItens} />

            </div>
          )
      }

    return(
        <Container className={myClassName}>

        <div className='top itens'>
            <button className='principal' onClick={() => openMenu()}>ITENS</button>
            <button className='secondary' onClick={() => toggleIsCollapsed()}>_</button>
          </div>

          <div className='content'>
            <ul className='itens-ul'>
              {itensAgrupados.map(i => <Item key={i.id ?? i.ids.join(',')} item={i} />)}
            </ul>
          </div>

            {curr?.itens?.length > 0 &&
            <label className='bottom'>
              Total de itens: {curr.itens.length} | {
              formatReal(curr.itens.reduce((a, b) => a + b.valor, 0))}
            </label>}
            
        </Container>
    )
}

const Container = styled(box)`
    display: flex; 
    min-height: 145px;

    >.top{background-color: ${cores.amarelo}}
      
    &.big:not(.collapsed){
      min-height: 215px;
    }
    &.large:not(.collapsed){
      min-height: 290px;
    }
    &.superlarge:not(.collapsed){
      min-height: 400px;
    }
    .content{
      flex-grow: 2;
      display: flex;
      overflow-y: auto;
      .itens-ul{
        display: flex;
        flex-direction: column;
        padding: 0 5px 5px 5px;
        overflow-y: auto;
        flex-grow: 2;

        @media (max-width: 550px){
          overflow-x: auto;
          flex-wrap: wrap;
          gap: 2px;

          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;

          &::-webkit-scrollbar{
            width: 40px;
          }

        }

      }
    }
    .bottom{
      display: flex;
      padding: 5px;
      background-color: ${cores.branco};
      border-top: 1px solid black;
      color: ${cores.cinzaDark};
    }
`