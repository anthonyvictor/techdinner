import axios from "axios";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as Format from '../util/Format'

const PedidoContext = createContext();

export default function PedidosProvider({children}){
  return (
      <PedidosProvider2>
        {children}
      </PedidosProvider2>
  )
}

function PedidosProvider2({ children }) {
  const [_pedidos, set_Pedidos] = useState([]);
  const [atualizar, setAtualizar] = useState(0)
  const [clientesImagens, setClientesImagens] = useState([])

  function getImagem(id){
    if(id && clientesImagens.filter(i => i.id === id)[0]){
     return Format.convertImageToBase64(clientesImagens.filter(i => i.id === id)[0].imagem)
    }
    return null
  }
    // useEffect(() => {
    //   if(clientesImagens){
    //     setPedidos(_pedidos => _pedidos.map(p => {
    //       console.log(clientesImagens.filter(i => i.id === p.cliente.id)[0])
    //       return{
    //       ...p,
    //       cliente: {
    //         ...p.cliente,
    //         imagem: (p.cliente?.id && clientesImagens.filter(i => i.id === p.cliente.id).length > 0) 
    //         ? (p.cliente?.id && Format.convertImageToBase64(clientesImagens.filter(i => i.id === p.cliente.id)[0].imagem)) 
    //         : null
    //       }
    //     }}))
    //   }
    // }, [clientesImagens])
    
  useEffect(() => {
      let montado = true
      async function getAll(){
        let r = await axios({
          url: `${process.env.REACT_APP_API_URL}/pedidos`,
          method: 'GET'
        })
        if(montado) {
          let _peds = r.data
          set_Pedidos(_peds)
        } 
      } 
      getAll(montado)
      return () => {montado = false}
  }, [atualizar,])

  // axios({
  //   url: `${process.env.REACT_APP_API_URL}/clientes/imagens`, 
  //   method: 'post',
  //   data: payload
  // }).then(e => {
  //   if(montado){
  //     setClientesImagens(e.data)
  //   }
  // })

  const pedidos = useMemo(() => 
   {
    //  console.log(_pedidos.map(e => e.valor).join(', '))
     return  _pedidos
   }
, [_pedidos])

  const semTipo = useMemo(() => 
    pedidos.filter(p => !['CAIXA', 'ENTREGA', 'APLICATIVO'].includes(p.tipo))
  , [pedidos])


  const caixa = useMemo(() => 
    pedidos.filter(p => p.tipo === 'CAIXA')
  , [pedidos])


  const entrega = useMemo(() => 
    pedidos.filter(p => p.tipo === 'ENTREGA')
  , [pedidos])


  const aplicativo = useMemo(() => 
    pedidos.filter(p => p.tipo === 'APLICATIVO')
  , [pedidos])

  const arquivados = useMemo(() => 
    pedidos.filter(p => !!p.arq)  
  , [pedidos])


  function refresh(){
    setAtualizar(prev => prev + 1)
  }

  return (
    <PedidoContext.Provider value={{ 
      pedidos, 
      refresh, getImagem,
      semTipo, caixa, entrega,
      aplicativo, arquivados
    }}>
      {children}
    </PedidoContext.Provider>
  );
}

export const usePedidos = () => {
  return useContext(PedidoContext);
};
