import React, { createContext, useContext, useState } from 'react';

const BebidasContext = createContext()
//https://hiperideal.vteximg.com.br/arquivos/ids/168636-1000-1000/1619888.jpg
function BebidasProvider({children}) {
    const [bebidas, setBebidas] = useState([
        {
            id: 1, nome: 'Pepsi',
            imagem: '',
            tipo: 'Refrigerante',
            sabor: '',
            tamanho: 1000,
            valor: 5,
            ativo: true,
            visivel: true,
            vendidos: 350
        },
        {
            id: 2, nome: 'Kuat',
            imagem: 'https://deskontao.agilecdn.com.br/5533_1.jpg',
            tipo: 'Refrigerante',
            sabor: '',
            tamanho: 1000,
            valor: 6,
            ativo: false,
            visivel: true,
            vendidos: 89
        },
        {
            id: 3, nome: 'Fanta',
            imagem: 'https://static.distribuidoracaue.com.br/media/catalog/product/cache/1/thumbnail/600x800/9df78eab33525d08d6e5fb8d27136e95/r/e/refrigerante-fanta-laranja-2-litros.jpg',
            tipo: 'Refrigerante',
            sabor: 'Laranja',
            tamanho: 2000,
            valor: 8.5,
            ativo: true,
            visivel: true,
            vendidos: 45
        },
        {
            id: 5, nome: 'Schin',
            imagem: 'https://apoioentrega.vteximg.com.br/arquivos/ids/458697/1903.jpg',
            tipo: 'Refrigerante',
            sabor: 'Limao',
            tamanho: 2000,
            valor: 5,
            ativo: true,
            visivel: true,
            vendidos: 57
        },
        {
            id: 6, nome: 'Del Valle',
            imagem: 'https://sushiboxrs.com.br/wp-content/uploads/2017/02/manga.png',
            tipo: 'Suco',
            sabor: 'Frutas Citricas',
            tamanho: 350,
            valor: 5,
            ativo: true,
            visivel: true,
            vendidos: 15
        },
        {
            id: 10, nome: 'Itaipava',
            imagem: 'https://a-static.mlcdn.com.br/1500x1500/cerveja-itaipava-lata-350ml-pack-com-12-unidades/distribuidoravitalli/621p/83dd0222e2178ffbf51bdd8a3bf87c2a.jpg',
            tipo: 'Cerveja',
            sabor: '',
            tamanho: 350,
            valor: 4,
            ativo: true,
            visivel: true,
            vendidos: 100
        }
    ])
  return (
      <BebidasContext.Provider value={{bebidas, setBebidas}} >
          {children}
      </BebidasContext.Provider>
  )
}

export default BebidasProvider;

export const useBebidas = () => {
    return useContext(BebidasContext)
}