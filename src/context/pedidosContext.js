import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useApi } from "../api";
import { useMessage } from "../components/Message";
import { arrayer } from "../util/misc";

const PedidosContext = createContext();

export default function PedidosProvider({ children }) {
  const [_pedidos, set_Pedidos] = useState([]);
  const [atualizar, setAtualizar] = useState(0)
  const [st, sst] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const {api} = useApi()
  const {message} = useMessage()
  
    // useEffect(() => {
    //   if(clientesImagens){
    //     setPedidos(_pedidos => _pedidos.map(p => {
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
      const montado = true
      async function checkUpdates(){
        try{
          let payload = {
            pedidos: pedidos.map(e => {
                return {
                  id: e.id,
                  valor: e.valor,
                  itens: e.itens.map(e => e.id),
                  endereco: {cep: e?.endereco?.cep, taxa: e?.endereco?.taxa},
                  cliente: {id: e?.cliente?.id, nome: e?.cliente?.nome},
                  pagamentos: e.pagamentos.map(e => ({valorPago: e.valorPago, status: e.status})),
                  impr: e.impr,
                  arq: e.arq
                }
              })
          
          }
          let response = await api().post('pedidos/checkupdates', payload)
  
          if(montado) {
            if(response.data.willUpdate === true){
             refresh()
             if(response.data.arqDiff){
               message('info', 'Um pedido foi arquivado/desarquivado')
             }
            }
    
          } 
        }catch(err){
          sst(1)
        }
      } 

      if(seconds > 0 && st === 0){
        checkUpdates()
      }
    }, [seconds])
    
  useEffect(() => {
      let montado = true
      async function getAll(){
        let response = await api().get('pedidos')

        if(montado) {
          let _peds = response.data
          set_Pedidos(arrayer(_peds))
        } 
      } 
      getAll(montado)
      return () => {montado = false}
  }, [atualizar])
  
  useEffect(() => {
      let montado = true
      let delay, interval
      if(montado){
          interval = setInterval(() => {
              setSeconds(prev => prev + 1)
          }, 10 * 1000)
      }
      
      return () => {
        montado = false
        clearTimeout(delay)
        clearInterval(interval)
      }

  }, [])

  

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
