import React, { createContext, useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPizzaSlice, faGlassCheers, faIceCream, 
    faHamburger, faUtensils, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { convertImageToBase64, formatLitro, formatReal } from '../../../../util/Format';
import { isNEU, join } from "../../../../util/misc";
import styled from "styled-components";
import * as cores from '../../../../util/cores'
import { useContextMenu } from '../../../../components/ContextMenu';
import { useBoxItens } from ".";
import { usePedido } from "..";

const ItemContext = createContext()

export const Item = ({item}) => {
    const [itemState] = useState(item)
    return (
        <ItemContext.Provider value={{
            item: itemState
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
    const {getSaboresDescritos} = usePedido()
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
      openSelectBoxItens(item)
    }

      function copiar(){
        const cp = (qtd) => {
            alert('não implementado')
        }
        contextMenu([
          {title:'Acres. mais 1',click:() => cp(1)},
          {title:'Acres. mais 2',click:() => cp(2)},
          {title:'Acres. mais 3',click:() => cp(3)},
          {title:'Acres. mais 4',click:() => cp(4)},
        ])
      }

      function excluir(){
        alert('não implementado')
      }

    function openContextMenu(){
        contextMenu([
          {title:'Editar', click:() => editar()},
          {title:'Copiar...', click: () => copiar()},
          {title:'Excluir', click:() => excluir()},
        ])
      }

    return (
        <Container key={item.id ?? item.ids.join(',')}
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

                    <label className='titulo'>{getTitulo()}</label>
                    <p className='info-secundarias'>{getInfoSecundarias()}</p>
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