import React from 'react';
import { TabControl } from '../../../components/TabControl';
import CadPizzasProvider from '../../../context/cadPizzasContext';

import PizzasProvider from '../../../context/pizzasContext';
import TabControlProvider from '../../../context/tabControlContext';

import Ingredientes from './ingredientes';
import Sabores from './sabores';
import Tamanhos from './tamanhos';


function Pizzas() {
    const tabs = [
        { link: "/cad/pizzas/sabores", titulo: "Sabores", elemento: <Sabores /> },
        { link: "/cad/pizzas/tamanhos", titulo: "Tamanhos", elemento: <Tamanhos /> },
        { link: "/cad/pizzas/ingredientes", titulo: "Ingredientes", elemento: <Ingredientes /> },
      ];
  return (
    <TabControlProvider tabs={tabs}>
        <PizzasProvider>
            <CadPizzasProvider>
              <TabControl />
            </CadPizzasProvider>
        </PizzasProvider>
    </TabControlProvider>
  )
}

export default Pizzas;