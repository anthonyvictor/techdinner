import React, { createContext, useContext} from 'react';
import styled from 'styled-components';
import axios from 'axios';

import * as cores from '../../../util/cores'
import { equals, isNEU, join, removeAccents } from '../../../util/misc';

import { useHome } from '../../../context/homeContext';
import { usePedidos } from '../../../context/pedidosContext';

import { Topo } from './topo';
import { BoxCLiente } from './cliente';
import { BoxEndereco } from './endereco';
import { BoxItens } from './itens';
import { BoxPagamentos } from './pagamento';
import { Rodape } from './rodape';
import { useApi } from '../../../api';


const PedidoContext = createContext()

export const Pedido = () => {

    const { curr, setCurr, closeSelectBox } = useHome()
    const { refresh } = usePedidos();
    const { api } = useApi()

    function getOnly1Id(item){
      return item?.id ? item.id
      : item?.ids?.length > 0 ? item.ids[0] 
      : null
    }
    function getOnly1Item(item){
      return curr.itens.find(e => equals(e.id, getOnly1Id(item)))
    }

    async function mudarTipo(newTipo){
      closeSelectBox()
      let ped = {
        id: curr.id,
        tipo: curr.tipo,
        cliente: { id: curr.cliente.id },
      }
      const payload = {
        pedido: ped,
        novoTipo: newTipo
      }
    
      const response = await api().post('pedidos/update/tipo', payload) 

      setCurr(prev => {return{ ...response.data, cliente: prev.cliente }})//...prev,
      refresh()
    }

    async function mudarCliente(newCliente){
      closeSelectBox()
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
    
      const response = await api().post('pedidos/update/cliente', payload)  
      
      setCurr(response.data) 
      refresh()
      
    }

    async function mudarEndereco(newEndereco) {
        closeSelectBox()
        let ped = {
            id: curr.id,
            endereco: curr?.endereco,
        }
        const payload = {
            pedido: ped,
            novoEndereco: newEndereco,
        }
        const resp = await api().post('pedidos/update/endereco', payload) 

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
            await api().post('pedidos/update/taxa', payload)

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
        closeSelectBox()
        let ped = {
            id: curr.id,
        }
        const payload = {
            pedido: ped,
            novoEntregador: newEntregador,
        }
        await api().post('pedidos/update/entregador', payload) 

        setCurr({
            ...curr,
            endereco: {
                ...curr.endereco,
                entregador: newEntregador,
            },
        })
        refresh()
    }

    async function mudarItem(newItem) {
        closeSelectBox()
        let ped = {
            id: curr.id,
        }

        const payload = {
            pedido: ped,
            novoItem: {
              ...newItem, 
              id: getOnly1Id(newItem), 
              observacoes: newItem?.observacoes ? removeAccents(newItem.observacoes) : null 
            },
        }
        const response = await api().post('pedidos/update/item', payload)

        if(response?.data){
          setCurr(response.data)
          refresh()
        }
    }

    async function copiarItem(item, qtd) {
        closeSelectBox()
        let ped = {
            id: curr.id,
        }
        const payload = {
            pedido: ped,
            item: {...item, id: getOnly1Id(item)},
            qtd: qtd,
        }
        const response = await api().post('pedidos/update/item/copy', payload)

        if(response?.data){
          setCurr(response.data)
          refresh()
        }
    }

    async function excluirItem(itens) {
      closeSelectBox()
      let ped = {
          id: curr.id,
      }
      
      const payload = {
          data: {
            pedido: ped,
            itens: itens,
          }
      }
      const response = await api().delete('pedidos/update/item/delete', payload)
    
      if(response?.data){
        setCurr(response.data)
        refresh()
      }
  }

    async function mudarPagamento(newPagamento) {
        closeSelectBox()
        let ped = {
            id: curr.id,
        }
        const payload = {
            pedido: ped,
            novoPagamento: newPagamento,
        }
        const response = await api().post('pedidos/update/pagamento', payload) 

        if(response?.data){
          setCurr({
            ...curr,
            itens: [
                ...curr.itens.filter(e => e.id !== response.data.item.id),
                response.data.item,
            ],
            valor: response.data.valor
          })
          refresh()
        }
    }

    async function mudarObservacoes(newObservacoes){
      closeSelectBox()
        let ped = {
            id: curr.id,
        }
        const payload = {
            pedido: ped,
            novoObservacoes: newObservacoes,
        }
        const response = await api().post('pedidos/update/observacoes', payload) 

        if(response?.data){
          setCurr({
            ...curr,
            observacoes: response.data
          })
          refresh()
        }
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
        mudarItem, copiarItem, excluirItem, 
        mudarPagamento, mudarObservacoes,
        getSaboresDescritos, 
        getOnly1Id, getOnly1Item,

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




