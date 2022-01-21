import React, {useContext, useState, createContext} from "react";


const ClientesContext = createContext()


export default function ClientesProvider({ children }) {

    const [clientes, setClientes] = useState([
        {id: 5519, nome: 'Carlos Henrique',
        img: '',
        tags: ['Filho de dona Quinha'], 
        contato: ['98855-8855','98855-4455'], 
        endereco: {
            logradouro: 'Rua fodase',
            numero: '21', 
            local: 'casa do caralho',
            cep: "40195745",
            bairro: "Ondina",
            taxa: 5,
        },
        pedidos: 20,
        ultPedido: '17/12/2021',
        valorGasto: 255.54
        },
        
        {id: 5520, nome: 'Julia Andrade',
        img: '',
        tags: ['Loira', 'Usa óculos'], 
        contato: ['98585-5566'], 
        endereco: {
            logradouro: 'Ladeira da puta que pariu',
            numero: '544', 
            local: 'ed. Fodase, ap 545',
            cep: "40110220",
            bairro: "Ondina",
            referencia: 'Ao lado do posto Shell',
            taxa: 5,
        },
        pedidos: 0,
        ultPedido: null,
        valorGasto: 0
        },

        {id: 5521, nome: 'João Gomes',
        img: '',
        tags: [], 
        contato: ['98888-5562','99758-1231'], 
        endereco: null,
        pedidos: 1,
        ultPedido: '18/12/2021',
        valorGasto: 50
        },

        {id: 5522, nome: 'Kevi Jonny',
        img: 'https://pbs.twimg.com/media/EVhhRzkXYAIP2WU?format=jpg&name=large',
        tags: ['Cantor'], 
        contato: ['98828-8585', '99992-5899','98875-8845','98855-4455'], 
        endereco: {
            logradouro: 'Rua das prostitutas pra casar',
            numero: '200', 
            cep: "41252555",
            bairro: "Barra",
            referencia: 'No escurinho do cinema',
            taxa: 8,
        },
        pedidos: 31,
        ultPedido: '05/12/2021',
        valorGasto: 350.00
        },

        {id: 5523, nome: 'Junior Brumado',
        img: 'https://www.bahianoticias.com.br/fotos/esportes_noticias/51008/IMAGEM_NOTICIA_5.jpg?checksum=1555325719',
        tags: [], 
        contato: ['98520-5422'],
        endereco: {
            logradouro: 'Rua Grosmipildo Santiago',
            local: 'Banco do Pau Duro',
            cep: "40110220",
            bairro: "Ondina",
            taxa: 3,
        },
        pedidos: 20,
        ultPedido: '01/01/2020',
        valorGasto: 255.54
        },

        {id: 5524, nome: 'Alle Pjtx',
        img: 'https://pbs.twimg.com/media/FDnIElFWEAcYu5Z?format=jpg&name=900x900',
        tags: ['Atriz daquele site', 'Morena', 'Bonita'], 
        contato: ['99588-5225','98855-4455', '99588-5858'], 
        endereco: {
            logradouro: 'Ladeira da puta que pariu',
            numero: '544', 
            local: 'ed. Fodase, ap 545',
            cep: "40110220",
            bairro: "Ondina",
            referencia: 'Ao lado do posto Shell',
            taxa: 5,
        },
        pedidos: 5,
        ultPedido: '12/05/2019',
        valorGasto: 205
        },
        {id: 5525, nome: 'Lauraro Martinez',
        img: 'https://static-wp-tor15-prd.torcedores.com/wp-content/uploads/2021/09/lautaromartinez.jpeg',
        tags: ['Joga no internacional de Porto alegre'], 
        contato: ['99982-5625','98954-4277', '98881-5118'], 
        endereco: {
            logradouro: 'Rua das amarguras',
            cep: "40110220",
            bairro: "Federação",
            referencia: 'Ao lado da casa de  Claudinho e Buceta',
            taxa: 6,
        },
        pedidos: 0,
        ultPedido: null,
        valorGasto: 0
        },
        {id: 5526, nome: 'Pelé Garrincha',
        img: 'https://s2.glbimg.com/3yYiyOpBqQhoTCxa8uzd9nx_IH4=/512x320/smart/e.glbimg.com/og/ed/f/original/2012/11/08/neymar.jpg',
        tags: ['Milior do mundo'], 
        contato: ['99558-5412'], 
        endereco: null,
        pedidos: 2,
        ultPedido: '01/01/2020',
        valorGasto: 50
        },
        {id: 5527, nome: 'Xana Gata',
        img: 'https://images.shazam.com/coverart/t531950618_s400.jpg',
        tags: ['Cantora', 'Safada'], 
        contato: ['71 98828-5845'], 
        endereco: null,
        pedidos: 0,
        ultPedido: null,
        valorGasto: 0
        },
        {id: 5528, nome: 'Mari Fernandez',
        tags: ['Aquela parada loca q eu faço com vc kkk'], 
        contato: ['988775566'], 
        endereco: {
            logradouro: 'Rua Chile',
            cep: "40520123",
            bairro: "Graça",
            referencia: 'Em frente a padaria',
            taxa: 8,
        },
        pedidos: 1,
        ultPedido: '07/12/2019',
        valorGasto: 25
        },
        {id: 5529, nome: 'Tony Garrido',
        img: 'https://cf.shopee.com.br/file/422e122df2ee0aa47c0005d4ee8c7e2f',
        contato: ['99212223'], 
        endereco: {
            logradouro: 'Ladeira do Xaponã',
            numero: '2545', 
            cep: "40110220",
            bairro: "Rio Vermelho",
            taxa: 7,
        },
        pedidos: 20,
        ultPedido: '03/01/2020',
        valorGasto: 325
        },
    ])

    return(
        <ClientesContext.Provider value={{clientes, setClientes}}>
            {children}
        </ClientesContext.Provider>
    )
}

export const useClientes = () => {
    return useContext(ClientesContext)
} 