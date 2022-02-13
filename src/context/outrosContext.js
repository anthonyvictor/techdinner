import React, { createContext, useContext, useState } from 'react';

const OutrosContext = createContext()

function OutrosProvider({children}) {
    const [outros, setOutros] = useState([
        {
            id: 1, nome: 'Pepsi',
            imagem: '',
            valor: 5,
            ativo: true,
            visivel: true
        },
        {
            id: 12, nome: 'Bauru',
            imagem: 'https://assets.instabuy.com.br/ib.item.image.big/b-7c40e33864044f64909a922946ac3e80.jpeg',
            valor: 4.5,
            ativo: false,
            visivel: true
        },
        {
            id: 2, nome: 'Kuat',
            imagem: 'https://deskontao.agilecdn.com.br/5533_1.jpg',
            valor: 6,
            ativo: true,
            visivel: true
        },
        {
            id: 3, nome: 'Fanta',
            imagem: 'https://static.distribuidoracaue.com.br/media/catalog/product/cache/1/thumbnail/600x800/9df78eab33525d08d6e5fb8d27136e95/r/e/refrigerante-fanta-laranja-2-litros.jpg',
            valor: 8.5,
            ativo: true,
            visivel: true
        },
        {
            id: 5, nome: 'Schin',
            imagem: 'https://apoioentrega.vteximg.com.br/arquivos/ids/458697/1903.jpg',
            valor: 5,
            ativo: true,
            visivel: true
        },
        {
            id: 6, nome: 'Del Valle',
            imagem: 'https://sushiboxrs.com.br/wp-content/uploads/2017/02/manga.png',
            valor: 5,
            ativo: true,
            visivel: true
        },
        {
            id: 10, nome: 'Itaipava',
            imagem: 'https://a-static.mlcdn.com.br/1500x1500/cerveja-itaipava-lata-350ml-pack-com-12-unidades/distribuidoravitalli/621p/83dd0222e2178ffbf51bdd8a3bf87c2a.jpg',
            valor: 4,
            ativo: true,
            visivel: true
        },
        {
            id: 13, nome: 'Itaipava',
            imagem: 'https://a-static.mlcdn.com.br/1500x1500/cerveja-itaipava-lata-350ml-pack-com-12-unidades/distribuidoravitalli/621p/83dd0222e2178ffbf51bdd8a3bf87c2a.jpg',
            valor: 4,
            ativo: true,
            visivel: true
        },
        {
            id: 14, nome: 'Itaipava',
            imagem: 'https://a-static.mlcdn.com.br/1500x1500/cerveja-itaipava-lata-350ml-pack-com-12-unidades/distribuidoravitalli/621p/83dd0222e2178ffbf51bdd8a3bf87c2a.jpg',
            valor: 4,
            ativo: true,
            visivel: true
        },
        {
            id: 15, nome: 'Itaipava',
            imagem: 'https://a-static.mlcdn.com.br/1500x1500/cerveja-itaipava-lata-350ml-pack-com-12-unidades/distribuidoravitalli/621p/83dd0222e2178ffbf51bdd8a3bf87c2a.jpg',
            valor: 4,
            ativo: true,
            visivel: true
        },
        {
            id: 16, nome: 'Itaipava',
            imagem: 'https://a-static.mlcdn.com.br/1500x1500/cerveja-itaipava-lata-350ml-pack-com-12-unidades/distribuidoravitalli/621p/83dd0222e2178ffbf51bdd8a3bf87c2a.jpg',
            valor: 4,
            ativo: true,
            visivel: true
        }

    ])
  return (
      <OutrosContext.Provider value={{outros, setOutros}} >
          {children}
      </OutrosContext.Provider>
  )
}

export default OutrosProvider;

export const useOutros = () => {
    return useContext(OutrosContext)
}