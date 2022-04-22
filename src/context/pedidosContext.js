import axios from "axios";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useApi } from "../api";
import { useMessage } from "../components/Message";
import * as Format from '../util/Format'

const PedidosContext = createContext();

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
  const {api} = useApi()
  const {message} = useMessage()
  
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

        let response = await api().get('pedidos')

        if(montado) {
          let _peds = response.data
          set_Pedidos(_peds)
        } 
      } 
      getAll(montado)
      return () => {montado = false}
  }, [atualizar,])

  async function novo(){
    const res = await api().post('pedidos/novo')
    
    if(res?.data){
      refresh()
      return res.data
    }else{
      message('error', `Não foi possível iniciar um novo pedido!`)
      // console.error(err, err.stack)
      return null
    }    
  }

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
    <PedidosContext.Provider value={{ 
      pedidos, novo,
      refresh,
      semTipo, caixa, entrega,
      aplicativo, arquivados
    }}>
      {children}
    </PedidosContext.Provider>
  );
}

export const usePedidos = () => {
  return useContext(PedidosContext);
};
