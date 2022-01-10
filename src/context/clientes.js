import React, {useContext, useState, createContext} from "react";


const ClientesContext = createContext()


export default function ClientesProvider({ children }) {

    const [clientes, setClientes] = useState([
        {id: 5519, nome: 'Carlos Henrique',
        img: '',
        tags: ['Filho de dona Quinha'], 
        contato: ['98855-8855','98855-4455'], 
        endereco: 'Rua fodase, 21 casa do caralho, Ondina',
        pedidos: 20,
        ultPedido: '17/12/2021',
        valorGasto: 255.54
        },
        
        {id: 5520, nome: 'Julia Andrade',
        img: '',
        tags: ['Loira', 'Usa óculos'], 
        contato: ['98585-5566'], 
        endereco: 'Ladeira da puta que pariu, 544 ed. Fodase, ap 545, Ondina',
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
        valorGasto: 50.00
        },

        {id: 5522, nome: 'Kevi Jonny',
        img: 'https://pbs.twimg.com/media/EVhhRzkXYAIP2WU?format=jpg&name=large',
        tags: ['Cantor'], 
        contato: ['98828-8585', '99992-5899','98875-8845','98855-4455'], 
        endereco: 'Mansao Wildberger, Rua Napoleao Bonaparte, 5858 - Brotas',
        pedidos: 31,
        ultPedido: '05/12/2021',
        valorGasto: 350.00
        },

        {id: 5523, nome: 'Junior Brumado',
        img: 'https://www.bahianoticias.com.br/fotos/esportes_noticias/51008/IMAGEM_NOTICIA_5.jpg?checksum=1555325719',
        tags: [], 
        contato: ['98520-5422'], 
        endereco: 'Arena Fonte Nova, 5255 Dique',
        pedidos: 20,
        ultPedido: '01/01/2020',
        valorGasto: 255.54
        },

        {id: 5524, nome: 'Alle Pjtx',
        img: 'https://pbs.twimg.com/media/FDnIElFWEAcYu5Z?format=jpg&name=900x900',
        tags: ['Atriz daquele site', 'Morena', 'Bonita'], 
        contato: ['99588-5225','98855-4455', '99588-5858'], 
        endereco: 'Alagoas, acre',
        pedidos: 0,
        ultPedido: null,
        valorGasto: 0
        },
        {id: 5525, nome: 'Alle Pjtx',
        img: 'https://pbs.twimg.com/media/FDnIElFWEAcYu5Z?format=jpg&name=900x900',
        tags: ['Atriz daquele site', 'Morena', 'Bonita'], 
        contato: ['99588-5225','98855-4455', '99588-5858'], 
        endereco: 'Alagoas, acre',
        pedidos: 0,
        ultPedido: null,
        valorGasto: 0
        },
        {id: 5526, nome: 'Alle Pjtx',
        img: 'https://pbs.twimg.com/media/FDnIElFWEAcYu5Z?format=jpg&name=900x900',
        tags: ['Atriz daquele site', 'Morena', 'Bonita'], 
        contato: ['99588-5225','98855-4455', '99588-5858'], 
        endereco: 'Alagoas, acre',
        pedidos: 0,
        ultPedido: null,
        valorGasto: 0
        },
        {id: 5527, nome: 'Alle Pjtx',
        img: 'https://pbs.twimg.com/media/FDnIElFWEAcYu5Z?format=jpg&name=900x900',
        tags: ['Atriz daquele site', 'Morena', 'Bonita'], 
        contato: ['99588-5225','98855-4455', '99588-5858'], 
        endereco: 'Alagoas, acre',
        pedidos: 0,
        ultPedido: null,
        valorGasto: 0
        },
        {id: 5528, nome: 'Alle Pjtx',
        img: 'https://pbs.twimg.com/media/FDnIElFWEAcYu5Z?format=jpg&name=900x900',
        tags: ['Atriz daquele site', 'Morena', 'Bonita'], 
        contato: ['99588-5225','98855-4455', '99588-5858'], 
        endereco: 'Alagoas, acre',
        pedidos: 0,
        ultPedido: null,
        valorGasto: 0
        },
        {id: 5529, nome: 'aaaaaa Pjtx',
        img: 'https://pbs.twimg.com/media/FDnIElFWEAcYu5Z?format=jpg&name=900x900',
        tags: ['Atriz daquele site', 'Morena', 'Bonita'], 
        contato: ['99588-5225','98855-4455', '99588-5858'], 
        endereco: 'Alagoas, acre',
        pedidos: 0,
        ultPedido: null,
        valorGasto: 0
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