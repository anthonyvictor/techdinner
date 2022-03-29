import React, { createContext, useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPizzaSlice, faGlassCheers, faIceCream, 
    faHamburger, faUtensils, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { convertImageToBase64, formatLitro, formatReal } from '../../../../util/Format';
import { equals, isNEU, join } from "../../../../util/misc";
import styled from "styled-components";
import * as cores from '../../../../util/cores'
import { useContextMenu } from '../../../../components/ContextMenu';
import { useBoxItens } from ".";
import { usePedido } from "..";
import { useHome } from "../../../../context/homeContext";
import { useMessage } from "../../../../components/Message";

const ItemContext = createContext()

export const Item = ({item}) => {
    return (
        <ItemContext.Provider value={{
            item
        }}>
            <Item2 />
        </ItemContext.Provider>
    )
}

const useItem = () => {
    return useContext(ItemContext)
}

const ImagemOuIcone = () => {

    const {item} = useItem()
    const Img = ({imagem}) => <img src={convertImageToBase64(imagem)} alt='' />

    if (item.tipo === 0) return <FontAwesomeIcon icon={faPizzaSlice} /> 

    if (item.tipo === 1 && item.bebida.imagem) return <Img imagem={item.bebida.imagem} />
    if (item.tipo === 1) return <FontAwesomeIcon icon={faGlassCheers} />
    
    if (item.tipo === 2 && item.hamburguer.imagem) return <Img imagem={item.hamburguer.imagem} />
    if (item.tipo === 2) return <FontAwesomeIcon icon={faHamburger} />

    if (item.tipo === 3 && item.outro.imagem) return <Img imagem={item.outro.imagem} />
    if (item.tipo === 3) return <FontAwesomeIcon icon={faIceCream} /> 

    return <FontAwesomeIcon icon={faUtensils} /> 
}

export const Item2 = () => {

    const {item} = useItem()
    const {openSelectBoxItens} = useBoxItens()
    const {getSaboresDescritos, copiarItem, excluirItem, getOnly1Item} = usePedido()
    const {message} = useMessage()

    const {contextMenu} = useContextMenu()

    function getTitulo() {
        const x = item.ids ? `x(${item.ids.length}) ` : ''

        const pizza = item.tipo === 0 
                        ? `Pizza${item.ids ? 's tam.' : ''} ${item.pizza.tamanho.nome}, 
                        ${item.pizza.sabores.length} 
                        sabor${item.pizza.sabores.length > 1 ?'es':''}` : ''
                      
        const bebida = item.tipo === 1 
                        ? join([
                          item.bebida.nome, item.bebida.sabor ?? '', 
                          formatLitro(item.bebida.tamanho)
                        ], ' ') : ''
                        
        const hamburguer = item.tipo === 2 ? 'HAMBURGUER' : ''
        const outro = item.tipo === 3 ? item.outro.nome : ''

        const res = join([pizza, bebida, hamburguer, outro], '')

        return isNEU(res) ? 'ITEM DESCONHECIDO' : x + res
    }

    function getInfoSecundarias() {

        if(item.tipo === 0) return getSaboresDescritos(item.pizza.sabores)
        
        if(item.tipo === 1) return item.bebida.tipo
            
        if(item.tipo === 2) return 'HAMBURGUER'
        
        return ''

    }

    function editar(){
      openSelectBoxItens(getOnly1Item(item))
    }

      function copiar(){
        const cp = (qtd) => {
          const itemOne = getOnly1Item(item)
            copiarItem({
              ...itemOne, 
              bebida: {...itemOne?.bebida, imagem: ''},
              outro: {...itemOne?.outro, imagem: ''},
            }, qtd)
        }
        contextMenu([
          {title:'Acres. mais 1',click:() => cp(1)},
          {title:'Acres. mais 2',click:() => cp(2)},
          {title:'Acres. mais 3',click:() => cp(3)},
          {title:'Acres. mais 4',click:() => cp(4)},
        ])
      }

      function excluir(){
        try{
          if(window.confirm('Deseja realmente excluir este item?')){
            const maxItensContextMenu = item.ids.slice(0, 5)
            if(item.ids?.length > 1){
              contextMenu(
                maxItensContextMenu.map((e, i) => {
                 const isLast =  i + 1 === maxItensContextMenu.length
                  return {

                    title: isLast 
                    ? `TODOS (${item.ids.length} unidades)` 
                    : `${i + 1} unidade${(i + 1) > 1 ? 's' : ''}`,

                    click: () => isLast 
                    ? next(item.ids) 
                    : next(item.ids.slice(0, i + 1))

                  }
                }
                )
              )
            }else if(item.id){
              next([item.id])
            }else{
              message('error', 'Ocorreu um erro!')
              throw new Error('Ids não definidos para o escopo de exclusão')
            }
            function next(itens){
              if(itens && itens?.length > 0) excluirItem(getOnly1Item(item))
            }
          }
        }catch(err){
          console.error(err, err.stack)
        } 
      }

    function openContextMenu(){
        contextMenu([
          {title:'Editar', click:() => editar()},
          {title:'Copiar...', click: () => copiar()},
          {title:'Excluir', click:() => excluir()},
        ])
      }

    const Secundarias = () => <p className='info-secundarias'>{getInfoSecundarias()}</p>

    return (
        <Container 
                onDoubleClick={() => editar()}
                onContextMenu={(e) => {
                  e.preventDefault()
                  openContextMenu()
                }}
                >
                  <div className='inicio'>

                    <input type={'checkbox'} />
                    <ImagemOuIcone item={item} />

                  </div>

                  <div className='centro'>
                    {['1','3'].includes(String(item.tipo)) && <Secundarias />}
                    <label className='titulo'>{getTitulo()}</label>
                    {!['1','3'].includes(String(item.tipo)) && <Secundarias />}
                    <p className='info-secundarias observacoes'>{item.observacoes}</p>

                  </div>

                  <div className='fim'>

                    <label className='valor-item'>{formatReal(item.valor)}</label>

                    <button className='opcoes' 
                    onClick={() => openContextMenu()}>
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>

                  </div>

                </Container>
    )
}

const Container = styled.li`
 display: flex;
          gap: 5px;
          padding: 5px;
          flex-shrink:0;
          flex-basis: 70px;
          border-bottom: 1px solid black;

          *{pointer-events: none;}
            &:hover{ 
              background-color: ${cores.branco}; 
            }
          .inicio{
            display: flex;
            align-items: center;
            gap: 5px;
            input{
              pointer-events: all;
            }
            img{
              width: 40px;
              height: 40px;
            }
            svg{
              width: 30px;
              height: 30px;
              margin: 0 5px 0 5px;
            }
          }
          .centro{
            flex-grow: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            label{
              font-weight: 600;
            }
            .info-secundarias{
              font-size: 12px;
              font-style: italic;

              &.observacoes{
                color: red;
                font-weight: 600;
                font-size: 11px;
              }
            }
            @media (max-width: 550px){
              label{
                font-weight: 600;
                font-size: 14px;
              }
              .info-secundarias{
                font-size: 11px;
                font-style: italic;
              }
            }
          }
          .fim{
            display: flex;
            gap: 10px;
            align-items: center;
            label{
              font-weight: 600;
              font-size: 18px;
            }
            button{
              font-size: 20px;
              height: 100% ;
              background-color: transparent;
              border: none;
              cursor: pointer;
              pointer-events: all;
              width: 40px;
            }
          }

`