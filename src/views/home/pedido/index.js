import React, { createContext, useContext} from 'react';
import styled from 'styled-components';
import axios from 'axios';

import * as cores from '../../../util/cores'
import { isNEU, join } from '../../../util/misc';

import { useHome } from '../../../context/homeContext';
import { usePedidos } from '../../../context/pedidosContext';

import { Topo } from './topo';
import { BoxCLiente } from './cliente';
import { BoxEndereco } from './endereco';
import { BoxItens } from './itens';
import { BoxPagamentos } from './pagamento';
import { Rodape } from './rodape';


const PedidoContext = createContext()

export const Pedido = () => {

    const { curr, setCurr, fecharSelectBox } = useHome()
    const { refresh } = usePedidos();

    async function mudarTipo(newTipo){
      fecharSelectBox()
      let ped = {
        id: curr.id,
        tipo: curr.tipo,
        cliente: { id: curr.cliente.id },
      }
      const payload = {
        pedido: ped,
        novoTipo: newTipo
      }
    
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}/pedidos/update/tipo`,
        method: 'POST',
        data: payload
      })
      setCurr(prev => {return{ ...response.data, cliente: prev.cliente }})//...prev,
      refresh()
    }

    async function mudarCliente(newCliente){
      fecharSelectBox()
      let ped = {
        id: curr.id,
        tipo: curr.tipo,
        cliente: { id: curr.cliente.id },
      }
      const payload = {
        pedido: ped,
        novoCliente: {
          ...newCliente,
          nome: newCliente.nome && String(newCliente.nome).toUpperCase()
        }
      }
    
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}/pedidos/update/cliente`,
        method: 'POST',
        data: payload
      })
      setCurr(response.data) 
      refresh()
      
    }

    async function mudarEndereco(newEndereco) {
        fecharSelectBox()
        let ped = {
            id: curr.id,
            endereco: curr?.endereco,
        }
        const payload = {
            pedido: ped,
            novoEndereco: newEndereco,
        }
        const resp = await axios({
            url: `${process.env.REACT_APP_API_URL}/pedidos/update/endereco`,
            method: 'POST',
            data: payload,
        })

        setCurr({
            ...curr,
            endereco: {
                ...newEndereco,
                entregador: resp?.data?.endereco?.entregador || curr?.endereco?.entregador,
                taxa: newEndereco.bairro.taxa,
                saida: curr.endereco?.saida,
            },
        })
        refresh()
    }

    async function mudarTaxa(newTaxa) {
            let ped = {
                id: curr.id,
            }
            const payload = {
                pedido: ped,
                novaTaxa: newTaxa,
            }
            await axios({
                url: `${process.env.REACT_APP_API_URL}/pedidos/update/taxa`,
                method: 'POST',
                data: payload,
            })

            setCurr({
                ...curr,
                endereco: {
                    ...curr.endereco,
                    taxa: newTaxa,
                },
            })
            refresh()
    }

    async function mudarEntregador(newEntregador) {
        fecharSelectBox()
        let ped = {
            id: curr.id,
        }
        const payload = {
            pedido: ped,
            novoEntregador: newEntregador,
        }
        await axios({
            url: `${process.env.REACT_APP_API_URL}/pedidos/update/entregador`,
            method: 'POST',
            data: payload,
        })

        setCurr({
            ...curr,
            endereco: {
                ...curr.endereco,
                entregador: newEntregador,
            },
        })
        refresh()
    }

    function mudarObservacoes(newObservacoes){
      alert('não implementado')  
    }


    function getSaboresDescritos(sabores, quebra=', '){
      const joinTipoAdd = (ingredientes) => ingredientes.map(i => i.tipoAdd ? i.tipoAdd : '').join('')
      const getIngredientesDiferentes = (ingredientes) => ingredientes.filter(i => i.tipoAdd && i.tipoAdd !== '').map(i => `${i.tipoAdd} ${i.nome}`).join(', ')
    
      let saboresDiferentes = sabores.filter(e => joinTipoAdd(e.ingredientes) !== '')
      let outrosSabores = sabores.filter(e => joinTipoAdd(e.ingredientes) === '')
      let r = saboresDiferentes.map(e => `${e.nome} (${getIngredientesDiferentes(e.ingredientes)})`).join(quebra)
      r = join([r, outrosSabores.map(e => e.nome).join(quebra)], quebra)
      return r
    }

    return (
      <PedidoContext.Provider value={{

        mudarTipo, mudarCliente, 
        mudarEndereco, mudarTaxa, mudarEntregador, 
        mudarObservacoes,
        getSaboresDescritos,

      }}>
          {curr ? <Pedido2 /> : <></>}
      </PedidoContext.Provider>
    )
}

export const usePedido = () => {
  return useContext(PedidoContext)
}

function Pedido2() {

  return(
    <Container>
      <Topo />
      <div className='middle-container'>
        <BoxCLiente />
        <BoxEndereco />
        <BoxItens />
        <BoxPagamentos />
      </div>
      <Rodape />
    </Container>
  )
}

export default Pedido;

const Container = styled.div`
background-color: ${cores.branco};
display: flex;
flex-direction: column;
height: 100%;
overflow: hidden;
user-select: none;
position: relative;

label,p{
  pointer-events:none;
}

@keyframes aparecer{
        from{opacity: 0}
        to{opacity: 1}
    } 

.middle-container{
  height: 100vh ;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 20px;
  @media (min-width: 1000px){
    padding: 10px 50px;
  }

}


@media print{
  img{display: none}
  .box{
    min-height: 0;
  }
  *{
    box-shadow: none!important;
  }
  .middle-container{
    gap: 5px;
  }
}

@media (max-width: 760px){
  > .top-container{
    height: 60px;

    *{
      height: 100% ;
      display: flex;
      text-align: center;
      vertical-align: middle;
      justify-content: center;
      align-items: center;
      font-size: 12px;
    }
  }
}
`




