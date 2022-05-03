import React, { createContext, useCallback, useContext} from 'react';
import styled from 'styled-components';

import { cores } from '../../../util/cores'
import { removeAccents } from '../../../util/misc';

import { useHome } from '../../../context/homeContext';
import { usePedidos } from '../../../context/pedidosContext';

import { Topo } from './topo';
import { BoxCLiente } from './cliente';
import { BoxEndereco } from './endereco';
import { BoxItens } from './itens';
import { BoxPagamentos } from './pagamento';
import { Rodape } from './rodape';
import { useApi } from '../../../api';
import { useMessage } from '../../../components/Message';
import { getOnly1Id } from '../../../util/pedidoUtil';


const PedidoContext = createContext()

export const Pedido = () => {

    const { curr, setCurr, fecharPedido, closeSelectBox } = useHome()
    const { refresh } = usePedidos();
    const { api } = useApi()
    const { message } = useMessage()

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
      if(response.data){
        setCurr(response.data) 
        refresh()
      }
      
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
            const res = await api().post('pedidos/update/taxa', payload)
            
            setCurr(res.data)
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

    async function mudarPagamento(newPagamentos, pagamento=null) {
      // if pagamento is set, the array (newPagamentos) will replace old pagamento
        
      console.log('aaaa', newPagamentos, pagamento)

      closeSelectBox()
        let ped = {
            id: curr.id,
        }
        const payload = {
            pedido: ped,
            novosPagamentos: newPagamentos,
            pagamentoAntigo: pagamento
        }
        const response = await api().post('pedidos/update/pagamento', payload) 

        if(response?.data){
          setCurr(response.data)
          refresh()
        }
    }

    const mudarObservacoes = useCallback(async (newObservacoes) => {
      closeSelectBox()
        let ped = {
            id: curr.id,
        }
        const payload = {
            pedido: ped,
            novoObservacoes: newObservacoes,
        }
        const response = await api().post('pedidos/update/observacoes', payload) 

          setCurr({
            ...curr,
            observacoes: response?.data?.observacoes
          })
          refresh()
      
    })

    
    async function cancelar() { //motivo
      try{
        closeSelectBox()
        // if(!motivo || String(motivo).replace(/[\s]+/g,'') === ''){
        //   message('error', 'Motivo não definido!')
        //   return
        // }
          let ped = {
              id: curr.id,
              tipo: curr.tipo,
          }
  
          const payload = {
              pedido: ped,
              // motivo: motivo
          }
          const response = await api().put('pedidos/cancelar', payload) 
  
          if(response.status === 200){
            fecharPedido(curr)
            refresh()
          }else{
            throw new Error('Erro no servidor!')
          }
        }catch(err){
          console.error(err, err.stack)
          message('error', 'Ocorreu algum erro no servidor!')
      }
    }

    async function finalizar(entregador) {
      try{
        closeSelectBox()

          // let ped = removeImagens(curr)
          const ped = curr.tipo === 'ENTREGA' 
          ? {...curr, endereco: {
              ...curr.endereco, 
              entregador: (entregador ?? {
                id: curr.endereco?.entregador?.id,
                nome: curr.endereco?.entregador?.nome
              })}}
          : curr
          
          const payload = {
              pedido: ped,
              
          }
          const response = await api().put('pedidos/finalizar', payload) 
  
          if(response.status === 200){
            fecharPedido(curr)
            refresh()
          }else{
            throw new Error('Erro no servidor!')
          }
        }catch(err){
          console.error(err, err.stack)
          message('error', err.message)
      }
    }

    return (
      <PedidoContext.Provider value={{

        mudarTipo, mudarCliente, 
        mudarEndereco, mudarTaxa, mudarEntregador, 
        mudarItem, copiarItem, excluirItem, 
        mudarPagamento, mudarObservacoes,
        cancelar, finalizar, 

      }}>
          {curr ? <Pedido2 /> : <></>}
      </PedidoContext.Provider>
    )
}

export const usePedido = () => {
  return useContext(PedidoContext)
}

function Pedido2() {
  const {curr} = useHome()
  return(
    <Container pedido={curr}>
      <div className='locker' />
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

${(props) => !(props?.pedido?.arq?.dataInic !== null)}{
  .locker{
    display: block;
    position: absolute;
    z-index: 999;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%:;   
    background-color: rgba(0,0,0,.2);
  }
}

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




