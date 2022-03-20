import React, {createContext, useContext, useEffect, useState} from 'react';
import { Itens } from './itens';
import { formatReal } from '../../../../util/Format';
import styled from 'styled-components';
import { box } from '../box';
import { join } from '../../../../util/misc';
import * as cores from '../../../../util/cores'
import { useHome } from '../../../../context/homeContext';
import { Item } from './itemLi';
import { ItemButton } from './selectBoxItensButton';
import { usePedido } from '..';


const BoxItensContext = createContext()

export const BoxItens = () => {

    const { openSelectBox } = useHome()
    const {insertUpdateItem} = usePedido()

      function openSelectBoxItens(item){
        openSelectBox(<Itens item={item} callback={insertUpdateItem} />)
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
    const {getSaboresDescritos} = usePedido()
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
        getItensAgrupados()  
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

      function getItensAgrupados(){
        if(curr){
            const _itens = [...curr.itens]
            let pizzas = []
            let bebidas = []
            let outros = []
            for(let item of _itens){
              if(item.tipo === 0){
                  //pizza
                  let achou = false
                  for(let p of pizzas){
                    if(item.pizza.tamanho.nome === p.pizza.tamanho.nome
                      && getSaboresDescritos(item.pizza.sabores) === getSaboresDescritos(p.pizza.sabores)
                      && item.observacoes === p.observacoes){
                        if(p.id){p.ids = [p.id]}
                        p.ids = [...p.ids, item.id]
                        p.valor += item.valor
                        delete p.id
                        achou = true
                        break;
                      }
                  }
                  if(!achou){pizzas.push({...item})}   
                }else if(item.tipo === 1){
                  //bebida
                  let achou = false
                  for(let b of bebidas){
                    if(item.bebida.id === b.bebida.id
                      && item.bebida.tamanho === b.bebida.tamanho
                      && item.bebida.sabor === b.bebida.sabor
                      && item.bebida.tipo === b.bebida.tipo
                      && item.observacoes === b.observacoes){
                        if(b.id){b.ids = [b.id]}
                        b.ids = [...b.ids, item.id]
                        b.valor += item.valor
                        delete b.id
                        achou = true
                        break;
                      }
                  }
                  if(!achou){bebidas.push({...item})}    
                }else if(item.tipo === 2){
                  const a = 'hamburguer'
                }else if(item.tipo === 3){
                  //outro
                  let achou = false
                  for(let o of outros){
                    if(item.outro.id === o.outro.id
                      && item.outro.nome === o.outro.nome
                      && item.observacoes === o.observacoes){
                        if(o.id){
                          o.ids = [o.id]
                        }
                        o.ids = [...o.ids, item.id]
                        o.valor += item.valor
                        delete o.id
                        achou = true
                        break;
                      }
                  }
                  if(!achou){outros.push({...item})}    
              }
            }
            setItensAgupados([...pizzas, ...bebidas, ...outros])
        }else{
              setItensAgupados([])
        }
      }

    return(
        <Container className={myClassName}>

        <div className='top itens'>
            <button className='principal' onClick={() => openMenu()}>ITENS</button>
            <button className='secondary' onClick={() => toggleIsCollapsed()}>_</button>
          </div>

          <div className='content'>
            <ul className='itens-ul'>
              {itensAgrupados.map(i => <Item key={i.id} item={i} />)}
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