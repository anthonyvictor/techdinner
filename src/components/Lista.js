import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import * as misc from '../util/misc'
import * as cores from '../util/cores'
import { useLista } from '../context/listaContext';

export const Lista = (props) => {
  const {allowMultiSelect, onConfirm, selectedDataArray} = useLista()
  // mustRefresh &&
  function getIsSelected(id){
    return allowMultiSelect ? selectedDataArray.some(e => misc.equals(e.id, id)) : false
  }
  return (
    <Container className={'lista-component'}>
        
          {props.children && (props.children.length > 0) && 
          <ul>
          {props.children
          .sort((a, b) => !(getIsSelected(a.key) ^ getIsSelected(b.key)) ? 0 : getIsSelected(a.key) ? -1 : 1)
          .map(e => <Item key={e.key} MyKey={e.key}>{e.props.children}</Item>)}
          </ul>
          }
        
        {allowMultiSelect && <button id='confirmar' type='button' onClick={() => onConfirm()}>Confirmar</button>}
    </Container>
    )
}

const Item = (props) => {
  const {MyKey, children} = props
  const {fullDataArray, selectedDataArray, allowMultiSelect, 
         hoveredData, setHoveredData,
         onItemClick, onRightClick} = useLista()
  const liRef = useRef()
  const [isSelected, setIsSelected] = useState(getIsSelected())

  function getIsSelected(){
    return allowMultiSelect ? selectedDataArray.some(e => misc.equals(e.id, MyKey)) : false
  }

  function getData(){
    return fullDataArray.filter(e => misc.equals(e.id, MyKey))[0]
  }

  useEffect(() => {
    setIsSelected(getIsSelected())
  }, [selectedDataArray]) //eslint-disable-line

  useEffect(() => {
      if(hoveredData && misc.equals(hoveredData.id, MyKey)){
        liRef.current.classList.add('ativo')
      }else{
        liRef.current.classList.remove('ativo')
      }
  }, [hoveredData]) //eslint-disable-line

  return(
        <li key={MyKey} ref={liRef} className={isSelected ? 'lista-component-li selected' : 'lista-component-li'}
            onDoubleClick={(e) => onItemClick(e, getData())} 
            onClick={(e) => onItemClick(e, getData())} 
            onContextMenu={(e) => onRightClick(e, getData())}
            onMouseEnter={() => setHoveredData(getData())} 
            onMouseLeave={() => setHoveredData(null)}>

                {allowMultiSelect && <input className='ckb' type={'checkbox'} readOnly checked={isSelected} />}

                {children}

                <button className="botao" onClick={(e) => onRightClick(e, getData())}>
                    <FontAwesomeIcon icon={faEllipsisV} />
                </button>

            </li>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: stretch;
  position: relative;
  overflow: hidden;
  gap: 5px;

  ul {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
    gap: 5px;
    .lista-component-li {
      display: flex;
      align-items: center;
      padding: 5px;
      gap: 5px;
      border: 1px solid black;
      background-color: ${cores.brancoEscuro};
      flex-basis: 50px;

      &.selected {
        background-color: ${cores.verde};
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

      &.ativo {
        background-color: ${cores.cinzaEscuro};
        * {
          color: white !important;
        }
      }
    }
  }

  #confirmar {
    flex-shrink: 0;
    height: 50px;
    cursor: pointer;
    background-color: ${cores.cinza};
    border: 1px solid black;
    font-size: 20px;

    &:hover {
      color: white;
      background-color: ${cores.cinzaEscuro};
    }
  }
`;


