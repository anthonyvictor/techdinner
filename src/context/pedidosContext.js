import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as Format from '../util/Format'
import Axios from "axios";

const PedidoContext = createContext();

export default function PedidosProvider({children}){
  return (
      <PedidosProvider2>
        {children}
      </PedidosProvider2>
  )
}

function PedidosProvider2({ children }) {
  const [pedidos, setPedidos] = useState([]);
  const [caixa, setCaixa] = useState([])
  const [entrega, setEntrega] = useState([])
  const [aplicativo, setAplicativo] = useState([]) 
  const [arquivados, setArquivados] = useState([]) 
  const [semTipo, setSemTipo] = useState([])

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
          Axios.get(`${process.env.REACT_APP_API_URL}/pedidos`).then(r=>
              {if(montado) {
                let _pedidos = r.data
                setPedidos(_pedidos)
                if(_pedidos.length > 0){
                  const payload = {
                    ids: [...new Set(_pedidos.map(ped => ped.cliente?.id).filter(x => x > 0))]
                  }
                  axios({
                    url: `${process.env.REACT_APP_API_URL}/clientes/imagens`, 
                    method: 'post',
                    data: payload
                  }).then(e => {
                    if(montado){
                      setClientesImagens(e.data)
                    }
                  })
                }
                let a = [
                  _pedidos.filter(p => p.tipo === 'CAIXA'),
                  _pedidos.filter(p => p.tipo === 'ENTREGA'),
                  _pedidos.filter(p => p.tipo === 'APLICATIVO'),
                  _pedidos.filter(p => !!p.arq)
                ]
                setSemTipo(_pedidos.filter(p => a.flat().map(a => a.id).includes(p.id) === false))
                setCaixa(a[0])
                setEntrega(a[1])
                setAplicativo(a[2])
                setArquivados(a[3])
              } 
            }
          )
      }   
      getAll()
      return () => {montado = false}
  }, [atualizar,])

  function refresh(){
    setAtualizar(prev => prev + 1)
  }

  return (
    <PedidoContext.Provider value={{ 
      pedidos, setPedidos, 
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
