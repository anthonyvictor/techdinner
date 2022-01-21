import React, { createContext, useContext, useState } from "react";

const PedidoContext = createContext();

export default function PedidoProvider({ children }) {
  const [pedidos, setPedidos] = useState([
    {
      id: 98,
      cli_nome: "Antonio Fagundes Lima",
      cli_img: "https://pbs.twimg.com/profile_images/1291386378195017733/Swnj1R8g_400x400.jpg",
      tipo: "ENTREGA",
      data_inic: new Date(2021, 11, 10, 0, 31, 30),
      valor: 155.9,
      valorPago: 0,
      taxaEntrega: 5,
      impr: 1
    },

    {
      id: 850,
      cli_nome: "Ana Eulioteria",
      cli_img: "https://campanhademulher.org/files/2020/10/ANA-JULIA.png",
      tipo: "CAIXA",
      data_inic: new Date(2021, 11, 10, 0, 10, 30),
      valor: 20,
      valorPago: 10,
      taxaEntrega: 0,
      impr: 1
    },

    {
      id: 540,
      cli_nome: "Carlos dos Santos",
      cli_img: "https://images-na.ssl-images-amazon.com/images/S/amzn-author-media-prod/me6b414jf6m5tulb2elg17ntja._SX450_.jpg",
      tipo: "APLICATIVO",
      data_inic: new Date(2021, 11, 9, 22, 0, 30),
      valor: 65.72,
      valorPago: 65.72,
      taxaEntrega: 0,
      impr: 0
    },

    {
      id: 1015,
      cli_nome: "Pedro Motoboy",
      cli_img: "https://imagem.band.com.br/f_477772.jpg",
      tipo: "CAIXA",
      data_inic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
      impr: 0
    },
    {
      id: 1016,
      cli_nome: "Jesus Marcos",
      cli_img: "https://www.infomoney.com.br/wp-content/uploads/2019/06/mark-zuckerberg-bloomberg-1.jpg",
      tipo: "ENTREGA",
      data_inic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
      impr: 0
    },
    {
      id: 1017,
      cli_nome: "Pedro Motoboy",
      cli_img: "https://imagem.band.com.br/f_477772.jpg",
      tipo: "CAIXA",
      data_inic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
      impr: 0
    },
    {
      id: 1018,
      cli_nome: "Pedro Motoboy",
      cli_img: "https://imagem.band.com.br/f_477772.jpg",
      tipo: "CAIXA",
      data_inic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
      impr: 0
    },
    {
      id: 1019,
      cli_nome: "Pedro Motoboy",
      cli_img: "https://imagem.band.com.br/f_477772.jpg",
      tipo: "CAIXA",
      data_inic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
      impr: 0
    },
    {
      id: 1020,
      cli_nome: "Pedro Motoboy",
      cli_img: "https://imagem.band.com.br/f_477772.jpg",
      tipo: "CAIXA",
      data_inic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
      impr: 0
    },
    {
      id: 1021,
      cli_nome: "Pedro Motoboy",
      cli_img: "https://imagem.band.com.br/f_477772.jpg",
      tipo: "CAIXA",
      data_inic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
      impr: 0
    },
    {
      id: 1022,
      cli_nome: "Pedro Motoboy",
      cli_img: "https://imagem.band.com.br/f_477772.jpg",
      tipo: "CAIXA",
      data_inic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
      impr: 0
    },
    {
      id: 1023,
      cli_nome: "Pedro Motoboy",
      cli_img: "https://imagem.band.com.br/f_477772.jpg",
      tipo: "CAIXA",
      data_inic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
      impr: 0
    },
    {
      id: 1024,
      cli_nome: "Pedro Motoboy",
      cli_img: "https://imagem.band.com.br/f_477772.jpg",
      tipo: "CAIXA",
      data_inic: new Date(2021, 11, 10, 0, 1, 30),
      valor: 10,
      valorPago: 0,
      taxaEntrega: 0,
      impr: 0
    },
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