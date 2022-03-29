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
    const {getSaboresDescritos, getOnly1Item} = usePedido()
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
            let pizzasGrupo = []
            let bebidasGrupo = []
            let outrosGrupo = []
            for(let item of _itens){
              if(item.tipo === 0){
                  //pizza
                  let achou = false
                  for(let grupo of pizzasGrupo){
                    if(item.pizza.tamanho.nome === grupo.pizza.tamanho.nome
                      && getSaboresDescritos(item.pizza.sabores) === getSaboresDescritos(grupo.pizza.sabores)
                      && item.observacoes === grupo.observacoes && item.pizza.valor === getOnly1Item(grupo)?.valor){
                        if(grupo.id){grupo.ids = [grupo.id]}
                        grupo.ids = [...grupo.ids, item.id]
                        grupo.valor += item.valor
                        delete grupo.id
                        achou = true
                        break;
                      }
                  }
                  if(!achou){pizzasGrupo.push({...item})}   
                }else if(item.tipo === 1){
                  //bebida
                  let achou = false
                  for(let grupo of bebidasGrupo){
                    if(item.bebida.id === grupo.bebida.id
                      && item.bebida.tamanho === grupo.bebida.tamanho
                      && item.bebida.sabor === grupo.bebida.sabor
                      && item.bebida.tipo === grupo.bebida.tipo
                      && item.observacoes === grupo.observacoes
                      && item.bebida.valor ===  getOnly1Item(grupo)?.valor){
                        if(grupo.id){grupo.ids = [grupo.id]}
                        grupo.ids = [...grupo.ids, item.id]
                        grupo.valor += item.valor
                        delete grupo.id
                        achou = true
                        break;
                      }
                  }
                  if(!achou){bebidasGrupo.push({...item})}    
                }else if(item.tipo === 2){
                  const a = 'hamburguer'
                }else if(item.tipo === 3){
                  //outro
                  let achou = false
                  for(let grupo of outrosGrupo){
    
                    if(item.outro.id === grupo.outro.id
                      && item.outro.nome === grupo.outro.nome
                      && item.observacoes === grupo.observacoes
                      && item.outro.valor === getOnly1Item(grupo)?.valor){
                        if(grupo.id){
                          grupo.ids = [grupo.id]
                        }
                        grupo.ids = [...grupo.ids, item.id]
                        grupo.valor += item.valor
                        delete grupo.id
                        achou = true
                        break;
                      }
                  }
                  if(!achou){outrosGrupo.push({...item})}    
              }
            }
            setItensAgupados([...pizzasGrupo, ...bebidasGrupo, ...outrosGrupo].sort((a,b) => {
              const maxA = a?.ids?.reduce((max, current) => max > current ? max : current) ?? a.id
              const maxB = b?.ids?.reduce((max, current) => max > current ? max : current) ?? b.id
              if(maxA > maxB) return -1
              if(maxA < maxB) return 1
              return 0
            }))
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