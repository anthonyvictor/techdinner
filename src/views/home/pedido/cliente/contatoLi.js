import React from "react";
import { useHome } from "../../../../context/homeContext";
import { sendWhatsAppMessage } from '../../../../apis';
import { Cumprimento } from '../../../../util/Mensagens';
import { formatPhoneNumber, formatEndereco, formatReal, formatLitro } from '../../../../util/Format';
import { isNEU, join } from '../../../../util/misc';
import { usePedido } from "..";
import { useContextMenu } from "../../../../components/ContextMenu";
import { getValorPendente } from "../../../../util/pedidoUtil";

export const Contato = ({contato}) => {

    const { curr } = useHome()
    const {getSaboresDescritos} = usePedido()
    const { contextMenu } = useContextMenu()

    async function confirmacao(tipo, resolve){
        if((getValorPendente(curr)) < 0){
          alert('Há pagamentos que excedem o valor total do pedido!')  
          return ''
        }
        let ms = '`'.repeat(3) //monoespaçado
        let inicio = 'CONFIRMANDO '
        let fim =`\n\n${ms}CONFIRMA AS INFORMAÇÕES ACIMA?${ms}`
        let _endereco = false, _itens = false
        let _pagamento = false, _contato = false
      
        switch(tipo){
          case 'tudo':
            inicio += 'PEDIDO:';
            [_endereco,_itens,_pagamento,_contato] = new Array(4).fill(true)
            break;
          case 'endereco':
            inicio += 'ENDEREÇO:' 
            _endereco = true
            break;
          case 'itens':
            inicio += 'ITENS DO PEDIDO:'
            _itens = true
            break;
          case 'pagamento':
            inicio += 'PAGAMENTO:'
            _pagamento = true
            break;
          case 'contato':
            inicio += 'NÚMEROS PARA CONTATO:'
            _contato = true
            break;
          default:
            inicio += '-------'
        }
      
        if(_contato && !isNEU(curr?.cliente) && !isNEU(curr.cliente.contato)){
          _contato = `\n\n*NUMERO(S) PARA CONTATO:* 📲`
          _contato += `\n${curr.cliente.contato.map(e => formatPhoneNumber(e)).join(', ')}`
        }
      
        if(_endereco && !isNEU(curr.endereco)){ 
          _endereco = `\n\n*ENDEREÇO:* 🛵`
          _endereco += `\n${formatEndereco(curr.endereco, false, true, false)}`
          _endereco += `\n*Taxa de entrega: ${formatReal(curr.endereco.taxa)}*`
        }
      
        if(_itens && !isNEU(curr?.itens)){
          let _pizzas='',_bebidas='',_outros=''
          for(let i of curr.itens){
            let _obs = !isNEU(i.observacoes) 
            ? `\nObservações: *${i.observacoes}*` : ''
            let _preco = `\nPreço: *${formatReal(i.valor)}*`
            if(i.tipo === 0){
              //pizza
              if(_pizzas.length === 0){_pizzas = `*PIZZAS* 🍕`}
              _pizzas += `\n\n_Pizza ${i.pizza.tamanho.nome} (${
                i.pizza.sabores.length} sabor${
                  i.pizza.sabores.length > 1 && 'es'})_`
              _pizzas += `\n${getSaboresDescritos(i.pizza.sabores,'\n')}`
              _pizzas += [_obs,_preco].join('')
            }else if(i.tipo === 1){
              //bebida
              if(_bebidas.length === 0){_bebidas = `*BEBIDAS* 🥤`}
              _bebidas += `\n\n_${
                join(
                  [
                    i.bebida.nome, i.bebida.sabor ?? '', 
                    formatLitro(i.bebida.tamanho)
                  ], 
                  ' '
                )
            }_`
              _bebidas += [_obs,_preco].join('')
            }else if(i.tipo === 2){
              //hamburguer
              
            }else if(i.tipo === 3){
              //outro
              if(_outros.length === 0){_outros = `*OUTROS* 🍦`}
              _outros += `\n\n${i.outro.nome}`
              _outros += [_obs,_preco].join('')
            }
          }
          _itens = '\n\n' + join([_pizzas,_bebidas,_outros], '\n\n')
        }
      
        if(_pagamento){
          _pagamento = '\n\n-------------------------'
          _pagamento += `\n*TOTAL: ${formatReal(curr.valor)}* 💰`
          _pagamento += '\n--------------------------'
          if(!isNEU(curr.pagamentos)){
            _pagamento += `\n\n*PAGAMENTO* 📝`
            for(let p of curr.pagamentos){
              _pagamento += `\n\n${formatReal(p.valorPago)}`
              switch(p.tipo){
                case 0: //ESPECIE
                  _pagamento += '- _EM ESPÉCIE_ 💵'
                  _pagamento += `\n${p.valorPago > p.valorRecebido 
                    ? 'Troco para ' + formatReal(p.valorRecebido)
                    : '*(Não precisa de troco)*'}`
                    break;
                case 1: //CARTAO
                  _pagamento += curr.tipo === 'APLICATIVO' 
                    ? ' - _PELO APP_ 📲' : ' - _NO CARTÃO_ 💳'
                    break;
                case 2: //ONLINE (PIX?)
                  _pagamento += ' - _VIA PIX_ 🌐'
                  break;
                case 3: //TRANSFERENCIA
                  _pagamento += ' - _TRANSFERÊNCIA BANCÁRIA_ 🔁'
                  break;
                case 4: //AGENDADO
                  _pagamento += ' - _AGENDADO_ 📅'
                  break;
                case 5: //NÃO CONFIRMADO
                  _pagamento += ' - _NÃO INFORMADO_ ❓'
                  break;
                default:
                  break;
              }
      
              if(p.tipo === 4){
                _pagamento += `\n*_Pendente até ${p.progr.data})_*`
              } else if(p.status === 1){
                _pagamento += '\n*_Valor já pago_*'
              }
            }
          }
        }
      
        let r = [inicio,_endereco,_itens,_pagamento,_contato,fim].filter(e => e !== true && !isNEU(e)).join('')
        // await navigator.clipboard.writeText(r)
      
        return r
      
      }
    

    function whatsappMessage(){
        let txt = ''
        const promise = new Promise(resolve => contextMenu([
          {title: 'Saudações',
           click: () => {txt = `Olá, ${Cumprimento()}`
          resolve('solved')}
          },
          {title: 'Pedido saiu',
           click: () => {
             txt = `Olá, seu pedido já está pronto.${['ENTREGA','APLICATIVO'].includes(curr.tipo.toUpperCase()) ? ' O entregador já está à caminho!' : ''}`
             resolve('solved')}
          },
          {title: 'Confirmações',
           click: () => contextMenu([
             {title:'Tudo', click: () => confirmacao('tudo').then(e => {
              txt = encodeURI(e)
             resolve('solved')
            })},
      
             {title:'Endereço', click: () => confirmacao('endereco').then(e => {
               txt = encodeURI(e) 
              resolve('solved')
            })},
      
             {title:'Itens', click: () => confirmacao('itens').then(e => {
              txt = encodeURI(e)
             resolve('solved')
            })},
      
             {title:'Pagamento', click: () => confirmacao('pagamento').then(e => {
              txt = encodeURI(e)
              resolve('solved')
            })},
      
             {title:'Contato', click: () => confirmacao('contato').then(e => {
              txt = encodeURI(e)
             resolve('solved')
            })},
      
            ])
          }
        ]))
        promise.then(() => {
          if (contato !== "" && txt !== '') {
            sendWhatsAppMessage(txt, contato);
          }
        })
        
      }

      function call() {
        window.open(`tel:${formatPhoneNumber(contato).replace(/[-)(\s)]/,'')}`)
      }

    function openContextMenu(){
        contextMenu([
          {title: 'Copiar', text: formatPhoneNumber(contato)},
          {title: 'Mensagem', click:() => whatsappMessage()},
          {title: 'Ligar', click:() => call()} 
      ])
      }

    return (
        <li key={contato} onClick={() => openContextMenu()}>
            {formatPhoneNumber(contato)}
        </li>
    )
}