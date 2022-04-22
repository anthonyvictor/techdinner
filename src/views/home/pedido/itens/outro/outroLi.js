import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faIceCream } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { formatReal } from '../../../../../util/Format';
import { useContextMenu } from '../../../../../components/ContextMenu';
import { useOutro } from '.';
import * as cores from '../../../../../util/cores'

export const OutroLi = ({outro}) => {

    const {contextMenu} = useContextMenu()
    const {
      ativarDesativar, currentSelected, setCurrentSelected, avancar, 
      currentHovered, setCurrentHovered, currentHoveredRef,
      isHovered, isSelected, isActive,
      isHoverLocked, setIsHoverLocked,
    } = useOutro()

    function openContext(){
        contextMenu([
          { title: 'Ativar/Desativar', click: () => ativarDesativar(outro) }
        ])
      }

    const ImagemOuIcone = () => {
        return (
            <div className='img'>
            {
                (outro?.imagem) ? 
                <img src={outro.imagem} alt='' />
                : <FontAwesomeIcon className='icone' icon={faIceCream} />
            }
        </div>
        )
    }

    function getDescricao(){
        return outro.nome
    }
    const [clicks, setClicks] = useState(0)
    

    useEffect(() => {
      const timer = setTimeout(() => {
        setClicks(0)
      }, 1000);

      if(isActive(outro)){
        if(clicks === 2){
          avancar(outro)
        }else if(clicks === 1){
          setCurrentSelected(outro)
        }
      }
      
      return () => clearTimeout(timer)
    }, [clicks])
    
    const [myClassName, setMyClassName] = useState(getClassName())
    
    useEffect(() => {setMyClassName(getClassName())}, [currentHovered, currentSelected])

    function getClassName () {
        if (outro) {
            const hovered = isHovered(outro) ? ' hovered' : ''
            const selecionado = isSelected(outro) ? ' selected' : ''
            const clicavel = !isActive(outro) ? ' inactive' : ''
            return 'outro' + hovered + selecionado + clicavel
        }
        return 'outro'
    }
   
    return (
        <Container key={outro.id}
        ref={isHovered(outro) ? currentHoveredRef : undefined}
        className={myClassName}
        onMouseEnter={() => !isHoverLocked && setCurrentHovered(outro)}
        onMouseLeave={() => setIsHoverLocked(false)}
        onClick={() => setClicks(prev => prev + 1)}
        onContextMenu={event => {
            event.preventDefault()
            openContext()
        }}>
            
            <div className='inicio'>
                <ImagemOuIcone />
            </div>

            <div className='centro'>
                <label className='nome'>{getDescricao()}</label>
                <div className='bottom'>
                    <span>Preço: {formatReal(outro.valor)}</span>
                </div>
            </div>

            <button className="botao" onClick={openContext}>
                    <FontAwesomeIcon icon={faEllipsisV} />
            </button>

        </Container>
    )
}

const Container = styled.li`
    user-select: none;
    min-width: 10px;




      display: flex;
      align-items: center;
      padding: 5px;
      gap: 5px;
      border: 1px solid black;
      background-color: ${cores.brancoEscuro};
      flex-basis: 70px;

      &.selected {
        background-color: ${cores.verde};
      }

      &.inactive {
        color: gray;
      }

      * {
        pointer-events: none;
      }

      .ckb {
        pointer-events: fill;
      }

      .inicio{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      .centro {
        flex-grow: 2;
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

      &.hovered {
        background-color: ${cores.cinzaEscuro};
        * {
          color: white !important;
        }
      }


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
          object-fit: scale-down;
          background-color: white;
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
`


