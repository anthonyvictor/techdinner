import React, { createContext, useContext, useState } from "react";
import ClientesProvider, { useClientes } from "./clientesContext";

const PedidoContext = createContext();

export default function PedidosProvider({children}){
  return (
    <ClientesProvider>
      <PedidosProvider2>
        {children}
      </PedidosProvider2>
    </ClientesProvider>
  )
}

function PedidosProvider2({ children }) {
  const {clientes} = useClientes()
  const [pedidos, setPedidos] = useState([
    {
      id: 98,
      cliente: clientes[12],
      tipo: "ENTREGA",
      endereco: {
        id: 1,
        logradouro: 'Avenida Oceanica', 
        cep: "40170010",
        bairro: 'Ondina',
        taxa: 4,
        local: 'Hotel Pier Sul',
        numero: '3001',
        entregador: {id: 1, nome: 'JOSIAS'} 
      },
      itens: [
        {id: 52552, tipo: 0, descricao: '(4) MEDIA', 
          valor: 25, observacoes: 'SEM AZEITONAS', 
          pizza: {id: 105545, 
            tamanho: {id: 4, nome: 'MEDIA'},
            sabores: [
              {
                 id:"67",
                 nome:"FRANGO",
                 ingredientes:[
                   {id: 1, nome: 'Calabresa', tipoAdd:'Pouco/a'}, 
                   {id: 2, nome: 'Frango', tipoAdd:''}, 
                   {id: 3, nome: 'Requeijao', tipoAdd:'Sem'}
                  ]
              },
              {
                 id:"21",
                 nome:"CALABRESA",
                 ingredientes:[
                  {id: 1, nome: 'Calabresa', tipoAdd:''}, 
                  {id: 5, nome: 'Cebola', tipoAdd:'Com'}, 
                  {id: 8, nome: 'Oregano', tipoAdd:''}            
                  ]
              }
            ]
          }
        },

        {id: 52553, tipo: 1, descricao: '(15) PEPSI', 
          valor: 7.5, observacoes: 'MANDAR 3 COPOS', 
          bebida: {
            id: 15, nome: 'PEPSI',
            imagem: 'https://apoioentrega.vteximg.com.br/arquivos/ids/458697/1903.jpg',
            tipo: 'Refrigerante',
            tamanho: 2000
          }
        },

        {id: 52557, tipo: 1, descricao: '(15) PEPSI', 
          valor: 7.5, observacoes: 'MANDAR 3 COPOS', 
          bebida: {
            id: 15, nome: 'PEPSI',
            imagem: 'https://apoioentrega.vteximg.com.br/arquivos/ids/458697/1903.jpg',
            tipo: 'Refrigerante',
            sabor: 'Limao',
            tamanho: 2000
          }
        },

        {id: 52554, tipo: 0, descricao: '(5) GRANDE', 
          valor: 35, 
          pizza: {id: 105546, 
            tamanho: {id: 5, nome: 'GRANDE'},
            sabores: [
              {
                 id:"67",
                 nome:"FRANGO",
                 ingredientes:[
                   {id: 1, nome: 'Calabresa', tipoAdd:''}, 
                   {id: 2, nome: 'Frango', tipoAdd:''}, 
                   {id: 3, nome: 'Requeijao', tipoAdd:''}
                  ]
              },
              {
                 id:"25",
                 nome:"DELICIA DA BAHIA",
                 ingredientes:[
                  {id: 1, nome: 'Calabresa', tipoAdd:''}, 
                  {id: 9, nome: 'Mussarela', tipoAdd:''}, 
                  {id: 8, nome: 'Oregano', tipoAdd:'Bastante'}, 
                  {id: 3, nome: 'Requeijao', tipoAdd:''}            
                  ]
              },
              {
                id:"28",
                nome:"ROMEU E JULIETA",
                ingredientes:[
                 {id: 13, nome: 'Goiabada', tipoAdd:''}, 
                 {id: 9, nome: 'Mussarela', tipoAdd:''}
                ]
             }
            ]
          }
        }

      ],
      pagamentos: [
        {id: 545334, tipo: 0, valorPago: 10, valorRecebido: 20, 
        dataAdicionado: '25/11/2021 20:23:00', dataRecebido: '25/11/2021 20:25:00', status: 1},
        
        {id: 545335, tipo: 1, valorPago: 5, 
          dataAdicionado: '25/11/2021 19:25:00', status: 0},

        {id: 545336, tipo: 2, valorPago: 5, 
        dataAdicionado: '25/11/2021 19:27:00', dataRecebido: '25/11/2021 19:27:00', status: 1},   
      ],
      dataInic: new Date(2021, 11, 10, 0, 31, 30),
      valor: 79,
      valorPago: 0,
      impr: 1,
      observacoes: 'MANDAR CONDIMENTOS PQ DA ULTIMA VEZ VEIO SEM E SE VIER DNV VAI DEIXAR DE PEDIR'
    },

    {
      id: 850,
      cliente: {},//clientes[5],
      tipo: "CAIXA",
      itens: [
        {id: 52558, tipo: 0, descricao: '(8) FAMILIA', 
          valor: 45, 
          pizza: {id: 105568, 
            tamanho: {id: 8, nome: 'FAMILIA'},
            sabores: [
              {
                 id:"67",
                 nome:"FRANGO",
                 ingredientes:[
                   {id: 1, nome: 'Calabresa', tipoAdd:''}, 
                   {id: 2, nome: 'Frango', tipoAdd:''}, 
                   {id: 3, nome: 'Requeijao', tipoAdd:''}
                  ]
              },
              {
                 id:"25",
                 nome:"DELICIA DA BAHIA",
                 ingredientes:[
                  {id: 1, nome: 'Calabresa', tipoAdd:''}, 
                  {id: 9, nome: 'Mussarela', tipoAdd:''}, 
                  {id: 8, nome: 'Oregano', tipoAdd:'Bastante'}, 
                  {id: 3, nome: 'Requeijao', tipoAdd:''}            
                  ]
              },
              {
                id:"28",
                nome:"ROMEU E JULIETA",
                ingredientes:[
                 {id: 13, nome: 'Goiabada', tipoAdd:''}, 
                 {id: 9, nome: 'Mussarela', tipoAdd:''}
                ]
             }
            ]
          }
        },

        {id: 52559, tipo: 0, descricao: '(8) FAMILIA', 
          valor: 45, 
          pizza: {id: 105569, 
            tamanho: {id: 8, nome: 'FAMILIA'},
            sabores: [
              {
                 id:"67",
                 nome:"FRANGO",
                 ingredientes:[
                   {id: 1, nome: 'Calabresa', tipoAdd:''}, 
                   {id: 2, nome: 'Frango', tipoAdd:''}, 
                   {id: 3, nome: 'Requeijao', tipoAdd:''}
                  ]
              },
              {
                 id:"25",
                 nome:"DELICIA DA BAHIA",
                 ingredientes:[
                  {id: 1, nome: 'Calabresa', tipoAdd:''}, 
                  {id: 9, nome: 'Mussarela', tipoAdd:''}, 
                  {id: 8, nome: 'Oregano', tipoAdd:'Bastante'}, 
                  {id: 3, nome: 'Requeijao', tipoAdd:''}            
                  ]
              },
              {
                id:"28",
                nome:"ROMEU E JULIETA",
                ingredientes:[
                 {id: 13, nome: 'Goiabada', tipoAdd:''}, 
                 {id: 9, nome: 'Mussarela', tipoAdd:''}
                ]
             }
            ]
          }
        }
      ],
      dataInic: new Date(2021, 11, 10, 0, 10, 30),
      valor: 20,
      valorPago: 10,
      impr: 1
    },

    {
      id: 540,
      cliente: clientes[15],
      tipo: "APLICATIVO",
      dataInic: new Date(2021, 11, 9, 22, 0, 30),
      valor: 65.72,
      valorPago: 65.72,
      impr: 0
    },

    {
      id: 1015,
      cliente: {nome: 'ORELHA'},//clientes[3],
      tipo: "CAIXA",
      dataInic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      impr: 0
    },
    {
      id: 1016,
      cliente: clientes[4],
      tipo: "ENTREGA",
      endereco: {
        id: 550,
        logradouro: 'Avenida Vasco da Gama', 
        cep: "40195745",
        bairro: 'Rio Vermelho',
        taxa: 7,
        numero: '1660',
        entregador: {id: 1, nome: 'JOSIAS'}
      },
      itens: [
        {id: 52568, tipo: 3, descricao: '(1) BAURU', 
          valor: 5, observacoes: 'FRANGO', 
          outro: {
            id: 1, nome: 'BAURU',
            imagem: 'https://apoioentrega.vteximg.com.br/arquivos/ids/458697/1903.jpg'
          }
        },
        {id: 52569, tipo: 3, descricao: '(1) BAURU', 
          valor: 5, observacoes: 'FRANGO', 
          outro: {
            id: 1, nome: 'BAURU',
            imagem: 'https://apoioentrega.vteximg.com.br/arquivos/ids/458697/1903.jpg'
          }
        },
        {id: 52570, tipo: 3, descricao: '(1) BAURU', 
          valor: 5, observacoes: 'FRANGO', 
          outro: {
            id: 1, nome: 'BAURU',
            imagem: 'https://apoioentrega.vteximg.com.br/arquivos/ids/458697/1903.jpg'
          }
        },
        {id: 52571, tipo: 3, descricao: '(1) BAURU', 
          valor: 5, observacoes: 'FRANGO', 
          outro: {
            id: 1, nome: 'BAURU',
            imagem: 'https://apoioentrega.vteximg.com.br/arquivos/ids/458697/1903.jpg'
          }
        }
      ],
      pagamentos : [
        {id: 545337, tipo: 5, valorPago: 10, dataAdicionado: '01/02/2022 23:27:00'}
      ],
      dataInic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      impr: 0
    },
    {
      id: 1017,
      cliente: clientes[16],
      tipo: "CAIXA",
      dataInic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      impr: 0
    }
  ]);

  return (
    <PedidoContext.Provider value={{ pedidos, setPedidos }}>
      {children}
    </PedidoContext.Provider>
  );
}

export const usePedidos = () => {
  return useContext(PedidoContext);
};
