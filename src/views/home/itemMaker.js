import React from 'react';
import BebidasProvider from '../../context/bebidasContext';
import OutrosProvider from '../../context/outrosContext';
import PizzasProvider from '../../context/pizzasContext';
import Bebida from './bebida';
import Outro from './outro';
import Pizza from './pizza';
import Recente from './recente';

export default function ItemMaker(props) {
  const tipo = (props.item && props.item.tipo) ? props.item.tipo : props.tipo
  switch(tipo){
    case 0:
     return <PizzasProvider>
       <Pizza item={props.item} />
     </PizzasProvider>
    break;

    case 1:
     return <BebidasProvider>
       <Bebida item={props.item} />
     </BebidasProvider>
    break;

    case 2:
      //hamburguer
      return (
        <></>
       )
    break;

    case 3:
      return <OutrosProvider>
        <Outro item={props.item} />  
      </OutrosProvider>
    break;

    case 4:
      //promocao
      return (
        <></>
       )
    break;

    case 5:
      return (
        <Recente />
      )
    break;
    
    default:
      return (
       <></>
      )
  }
}


