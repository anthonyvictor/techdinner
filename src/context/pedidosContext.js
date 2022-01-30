import React, { createContext, useContext, useState } from "react";
import { useClientes } from "./clientesContext";
import { useLocais } from "./locaisContext";

const PedidoContext = createContext();

export default function PedidosProvider({ children }) {
  const {clientes} = useClientes()
  const [pedidos, setPedidos] = useState([
    {
      id: 98,
      cliente: clientes[12],
      tipo: "ENTREGA",
      endereco: {
        id: 1,
        logradouro: 'Rua Leopoldo da Desgraça', 
        cep: "40195745",
        bairro: 'Pituba',
        taxa: 4,
        local: 'Hotel Bahia Bella',
        numero: '1660'    
      },
      dataInic: new Date(2021, 11, 10, 0, 31, 30),
      valor: 155.9,
      valorPago: 0,
      taxaEntrega: 5,
      impr: 1
    },

    {
      id: 850,
      cliente: {},//clientes[5],
      tipo: "CAIXA",
      dataInic: new Date(2021, 11, 10, 0, 10, 30),
      valor: 20,
      valorPago: 10,
      taxaEntrega: 0,
      impr: 1
    },

    {
      id: 540,
      cliente: clientes[15],
      tipo: "APLICATIVO",
      dataInic: new Date(2021, 11, 9, 22, 0, 30),
      valor: 65.72,
      valorPago: 65.72,
      taxaEntrega: 0,
      impr: 0
    },

    {
      id: 1015,
      cliente: clientes[3],
      tipo: "CAIXA",
      dataInic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
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
        numero: '1660'    
      },
      dataInic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
      impr: 0
    },
    {
      id: 1017,
      cliente: clientes[16],
      tipo: "CAIXA",
      dataInic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
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
