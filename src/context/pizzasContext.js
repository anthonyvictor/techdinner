import React, { createContext, useContext, useState } from 'react';

const PizzasContext = createContext()

function PizzasProvider({children}) {
    const [tipos, setTipos] = useState([
        {id: 1, nome: 'Tradicional', cor: '#233791'},
        {id: 2, nome: 'Especial', cor: '#239132'},
        {id: 3, nome: 'Gourmet', cor: '#91238e'}
    ])

    const [ingredientes, setIngredientes] = useState([
        {id: 1, nome: 'Calabresa'}, {id: 2, nome: 'Frango'}, {id: 3, nome: 'Requeijao'}, 
        {id: 4, nome: 'Mussarela'}, {id: 5, nome: 'Oregano'}, {id: 6, nome: 'Presunto'}, 
        {id: 7, nome: 'Cheddar'}
    ])

    const [sabores, setSabores] = useState([
        {id: 1, nome: 'Frango', numero: 1,
        tipo: tipos[0], ativo: true, visivel: true,
        ingredientes: [ingredientes[1], ingredientes[2], 
        ingredientes[3], ingredientes[4]]},

        {id: 2, nome: 'Calabresa', numero: 2,
        tipo: tipos[0], ativo: true, visivel: false,
        ingredientes: [ingredientes[0], ingredientes[1], ingredientes[2]]},

        {id: 6, nome: 'Mussarela', numero: 3,
        tipo: tipos[0], ativo: true, visivel: true,
        ingredientes: [ingredientes[2], ingredientes[3]]},

        {id: 8, nome: 'Portuguesa', numero: 4,
        tipo: tipos[0], ativo: true, visivel: true,
        ingredientes: [ingredientes[1], ingredientes[3], 
        ingredientes[5], ingredientes[6]]},

        {id: 9, nome: 'Atum', numero: 5,
        tipo: tipos[1], ativo: true, visivel: true,
        ingredientes: [ingredientes[2], ingredientes[3], 
        ingredientes[5], ingredientes[6]]},

        {id: 13, nome: '4 Queijos', numero: 6,
        tipo: tipos[1], ativo: false, visivel: true,
        ingredientes: [ingredientes[2], ingredientes[3], 
        ingredientes[5], ingredientes[6]]},

        {id: 14, nome: 'Camarao', numero: 25,
        tipo: tipos[2], ativo: true, visivel: false,
        ingredientes: [ingredientes[0],ingredientes[1],ingredientes[2], 
        ingredientes[3],ingredientes[4], ingredientes[5], ingredientes[6]]},
    ])

    const [tamanhos, setTamanhos] = useState([
        {id: 1, nome: 'Media', visivel: false, ativo: true},
        {id: 2, nome: 'Grande', visivel: true, ativo: true},
        {id: 3, nome: 'Familia', visivel: true, ativo: true}
    ])

    const [valores, setValores] = useState([
        {id: 1, tamanho: tamanhos[0], tipo: tipos[0], valor: 35},
        {id: 2, tamanho: tamanhos[1], tipo: tipos[0], valor: 25},
        {id: 3, tamanho: tamanhos[0], tipo: tipos[1], valor: 30},
        {id: 4, tamanho: tamanhos[1], tipo: tipos[1], valor: 28},
        {id: 5, tamanho: tamanhos[2], tipo: tipos[0], valor: 23},
        {id: 6, tamanho: tamanhos[2], tipo: tipos[1], valor: 33}
    ])

    

  return (
      <PizzasContext.Provider value={{
          sabores, setSabores,
          tamanhos, setTamanhos,
          ingredientes, setIngredientes,
          tipos, setTipos,
          valores, setValores
        }}>
            {children}
        </PizzasContext.Provider>
  )
}

export default PizzasProvider;

export const usePizzas = () => {
    return useContext(PizzasContext)
}