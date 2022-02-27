import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as cores from '../../util/cores'
import { useHome } from '../../context/homeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import * as misc from '../../util/misc';
import * as pedidoUtil from '../../util/pedidoUtil'
import * as Format from '../../util/Format';
import { useContextMenu } from '../../components/ContextMenu';
import * as apis from '../../apis'
import * as msg from '../../util/Mensagens'
import ListaCli from '../cadastros/clientes/lista'
import Cadastro from '../cadastros/clientes/cadastro';
import CadCliProvider from '../../context/cadClientesContext'
import { useRotas } from '../../context/rotasContext';
import ItemMaker from './itemMaker';
import Pagamento from './pagamento';
import axios from 'axios';
import { usePedidos } from '../../context/pedidosContext';
import { useImageViewer } from '../../components/ImageViewer';
import ClientesProvider from '../../context/clientesContext';
// import { useAsk } from '../../context/asksContext';

function Pedido() {
  const {curr, setCurr, fechar, openSelectBox, fecharSelectBox} = useHome()
  const {contextMenu} = useContextMenu()
  const { refresh, getImagem } = usePedidos();
  const [mapa, setMapa] = useState(null)
  const [showMapa, setShowMapa] = useState(false)
  const [itensAgrupados, setItensAgupados] = useState([])
  const {setCurrentRoute, location} = useRotas()
  const {imageView} = useImageViewer()

  const boxCliente = useRef()
  const boxEndereco = useRef()
  const boxAplicativo = useRef()
  const boxItens = useRef()
  const boxPagamento = useRef()

  function openSelectBoxTipo(){
    openSelectBox(
        <div className='container tipo'>
          <h4>Selecione o tipo:</h4>
          <ul className='tipo-lista'>
            <li className='caixa' key={0} onClick={() => mudarTipo(0)}>CAIXA</li>
            <li className='entrega' key={1} onClick={() => mudarTipo(1)}>ENTREGA</li>
          </ul>
        </div>
    )
    function mudarTipo(tipo){
      if(tipo === 3){alert('aplicativo')}

      fecharSelectBox()
    }
  }
  function mudarObservacoes(){
    const resp = window.prompt('Digite a observação do pedido', curr.observacoes)
    alert('VAI MUDAR')
  }
  
  useEffect(() => {
    fecharSelectBox()
    if(curr && curr.endereco){
      if(showMapa){
        {apis.enderecoToUrl(curr.endereco)
          .then(url => setMapa(
            <div className='mapa'>
              <button className='show-mapa'
              onClick={() => setShowMapa(false)}>
                Ocutar mapa
              </button>
              <div className="mapouter">
                <div className="gmap_canvas">
                  <iframe title='fodase' id="gmap_canvas"
                    src={`${url}&t=&z=16&ie=UTF8&iwloc=A&output=embed`} 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0"
                    align="middle">
                  </iframe>
                </div>
              </div>
            </div>
        ))
      .catch(() => setMapa(null))} 
      }else{
        setMapa(
          <div className='mapa'>
            <button className='show-mapa'
            onClick={() => setShowMapa(true)}>
              Mostrar mapa
            </button>
          </div>
        )
      }
    }
  },[curr, showMapa])

function getPedNum(){
  return curr.numero + 'º pedido' // cliente?.pedidos ? `${curr.cliente.pedidos + 1}º pedido` : '1º pedido'
}

function getAlertStyle(){
  if(curr?.cliente?.pedidos === 0){
    return {backgroundColor: 'green'}
  }else if(curr?.cliente?.valorPendente > 0){
    return {backgroundColor: 'red'}
  }else if(curr?.cliente?.listaNegra){
    return {backgroundColor: 'black'}
  }else{
    return {display: 'none'}
  }
}

function getEntregadorPadrao(){
 return 'PADRÃO'
}

async function confirmacao(tipo, resolve){
  if((curr.valor - getValorPago()) < 0){
    alert('Há pagamentos que excedem o valor total do pedido!')  
    return ''
  }
  let ms = '`' + '`' + '`' //monoespaçado
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
  }

  if(_contato && !misc.isNEU(curr?.cliente) && !misc.isNEU(curr.cliente.contato)){
    _contato = `\n\n*NUMERO(S) PARA CONTATO:* 📲`
    _contato += `\n${curr.cliente.contato.map(e => Format.formatPhoneNumber(e)).join(', ')}`
  }

  if(_endereco && !misc.isNEU(curr.endereco)){ 
    _endereco = `\n\n*ENDEREÇO:* 🛵`
    _endereco += `\n${Format.formatEndereco(curr.endereco, false, true, false)}`
    _endereco += `\n*Taxa de entrega: ${Format.formatReal(curr.endereco.taxa)}*`
  }

  if(_itens && !misc.isNEU(curr?.itens)){
    let _pizzas='',_bebidas='',_outros=''
    for(let i of curr.itens){
      let _obs = !misc.isNEU(i.observacoes) 
      ? `\nObservações: *${i.observacoes}*` : ''
      let _preco = `\nPreço: *${Format.formatReal(i.valor)}*`
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
        _bebidas += `\n\n_${[i.bebida.nome, i.bebida.sabor ?? '', 
        Format.formatLitro(i.bebida.tamanho)]
        .filter(e => e !== '').join(' ')}_`
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
    _itens = '\n\n' + [_pizzas,_bebidas,_outros]
    .filter(e => e !== '').join('\n\n')
  }

  if(_pagamento){
    _pagamento = '\n\n-------------------------'
    _pagamento += `\n*TOTAL: ${Format.formatReal(curr.valor)}* 💰`
    _pagamento += '\n--------------------------'
    if(!misc.isNEU(curr.pagamentos)){
      _pagamento += `\n\n*PAGAMENTO* 📝`
      for(let p of curr.pagamentos){
        _pagamento += `\n\n${Format.formatReal(p.valorPago)}`
        switch(p.tipo){
          case 0: //ESPECIE
            _pagamento += '- _EM ESPÉCIE_ 💵'
            _pagamento += `\n${p.valorPago > p.valorRecebido 
              ? 'Troco para ' + Format.formatReal(p.valorRecebido)
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
        }

        if(p.tipo === 4){
          _pagamento += `\n*_Pendente até ${p.progr.data})_*`
        } else if(p.status === 1){
          _pagamento += '\n*_Valor já pago_*'
        }
      }
    }
  }

  let r = [inicio,_endereco,_itens,_pagamento,_contato,fim].filter(e => e !== true && !misc.isNEU(e)).join('')
  // await navigator.clipboard.writeText(r)

  return r

}
function whatsappMessage(phoneNumber){
  let txt = ''
  const promise = new Promise(resolve => contextMenu([
    {title: 'Saudações',
     click: () => {txt = `Olá, ${msg.Cumprimento()}`
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
    if (phoneNumber !== "" && txt !== '') {
      apis.sendWhatsAppMessage(txt, phoneNumber);
    }
  })
  
}

function contatoClick(contato){
  contextMenu([
    {title: 'Copiar', 
    text: Format.formatPhoneNumber(contato),
    enabled: true, visible: true},

    {title: 'Mensagem', 
    click:() => whatsappMessage(contato), 
    enabled: true, visible: true},

    {title: 'Ligar', 
    click:() => {window.open(`tel:${Format.formatPhoneNumber(contato).replace(/[-)(\s)]/,'')}`)}, 
    enabled: true, visible: true} 
])
}

function getSaboresDescritos(sabores,quebra=', '){
  const joinTipoAdd = (ingredientes) => ingredientes.map(i => i.tipoAdd ? i.tipoAdd : '').join('')
  const getIngredientesDiferentes = (ingredientes) => ingredientes.filter(i => i.tipoAdd && i.tipoAdd !== '').map(i => `${i.tipoAdd} ${i.nome}`).join(', ')

  let saboresDiferentes = sabores.filter(e => joinTipoAdd(e.ingredientes) !== '')
  let outrosSabores = sabores.filter(e => joinTipoAdd(e.ingredientes) === '')
  let r = saboresDiferentes.map(e => `${e.nome} (${getIngredientesDiferentes(e.ingredientes)})`).join(quebra)
  r = [r, outrosSabores.map(e => e.nome).join(quebra)].filter(e => e !== '').join(quebra)
  return r
}

function getValorPago(){
  return curr.pagamentos.filter(e => e.status === 1).reduce((a,b) => a + b, 0) || 0
}

const [clienteTab, setClienteTab] = useState(null)
const clienteLinks = ['/pedido/clientes/lista','/pedido/clientes/cad']
const clienteElementos = [

<ClientesProvider>
  <ListaCli retorno={mudarCliente} tabs={clienteLinks} />
</ClientesProvider>, 

<ClientesProvider>
  <Cadastro retorno={mudarCliente} tabs={clienteLinks} />
</ClientesProvider>

] 
const semCadastro = useRef()
function openSelectBoxCliente(tipo){
  switch (tipo){
    case 'alterar':
      setCurrentRoute(clienteLinks[0])
      setClienteTab(clienteElementos[0])
      break
    case 'editar':
      setCurrentRoute(clienteLinks[1])
      setClienteTab(clienteElementos[1])
      break
    case 'semcadastro':
      openSelectBox(
        <form className='container semcadastro'>
          <h4 className='titulo'>Informe o nome do cliente, lembrando que este método serve 
            apenas para identificar o pedido, e não é válido como cadastro!</h4>
          <input ref={semCadastro} type={'text'} className='nome' required={true} 
          autoFocus={!misc.isMobile()}
          defaultValue={curr?.cliente?.nome || ''} />
          <button type='submit' onClick={(e) => {
            e.preventDefault()
            if(semCadastro.current.value.length > 2){
              mudarCliente({nome: semCadastro.current.value})
            }else{
              alert('Digite um nome válido!')
            }
          }}>Salvar</button>
        </form>
      )
      break
  }
}
async function mudarCliente(novoCliente){
  alert(novoCliente.nome)
  fecharSelectBox()
  let ped = {
    id: curr.id,
    tipo: curr.tipo,
    cliente: { id: curr.cliente.id },
  }
  const payload = {
    pedido: ped,
    novoCliente: {
      ...novoCliente,
      nome: novoCliente.nome && String(novoCliente.nome).toUpperCase()
    }
  }

  const response = await axios({
    url: `${process.env.REACT_APP_API_URL}/pedidos/updatecliente`,
    method: 'POST',
    data: payload
  })
  setCurr(prev => {return{ ...prev, ...response.data }})
  refresh()
  
}
useEffect(() => {
  if(clienteTab){
    openSelectBox(
      <CadCliProvider cliente={clienteTab?.type?.name === 'Cadastro' 
      ? curr.cliente
      : null}>
      <div className='container cliente'>
        {clienteTab}
      <div className='tabs-buttons'>
        <button onClick={() => setClienteTab(clienteElementos[0])}>LISTA</button>
        <button onClick={() => setClienteTab(clienteElementos[1])}>CADASTRO</button>
      </div>
      </div>
      </CadCliProvider>
    )
  }
},[clienteTab])

function removerCliente(){
  if(window.confirm('Deseja remover o cliente deste pedido? Informações de endereço também serão removidas.')){
    mudarCliente({id: null, nome: null})
  }
}

function openTopClienteMenu(){
  contextMenu([
    {title: 'Alterar', 
    click:() => openSelectBoxCliente('alterar'),
    enabled: true, visible: true},

    {title: 'Editar', 
    click:() => openSelectBoxCliente('editar'), 
    enabled: true, visible: !!curr?.cliente?.id},

    {title: 'Remover',
    click:() => removerCliente(), 
    enabled: true, visible: !misc.isNEU(curr?.cliente)},

    {title: 'Sem cadastro', 
    click:() => openSelectBoxCliente('semcadastro'), 
    enabled: true, visible: true},

    {title: 'Fidelidade', 
    click:() => openSelectBoxCliente('fidelidade'), 
    enabled: false, visible: !!curr?.cliente?.id} 
])
}
function openPizzasMenu(item){
  openSelectBox(
    <ItemMaker fechar={fecharSelectBox} tipo={0} item={item} />
  )
}
function openBebidasMenu(item){
  openSelectBox(
    <ItemMaker fechar={fecharSelectBox} tipo={1} item={item} />
  )
}
function openOutrosMenu(item){
  openSelectBox(
    <ItemMaker fechar={fecharSelectBox} tipo={3} item={item} />
  )
}
function openRecentesMenu(){}

function openTopItensMenu(){
  openSelectBox(
    <div className='container itens'>
     <button style={{backgroundColor: '#ed4300'}} onClick={() => openPizzasMenu()}>
      <div className='top'>
       <FontAwesomeIcon icon={icons.faPizzaSlice} />
       </div>
       <label style={{pointerEvents: 'none'}}>Pizzas</label>
     </button>
     <button style={{backgroundColor: '#e88b00'}} onClick={() => openBebidasMenu()}>
      <div className='top'>
       <FontAwesomeIcon icon={icons.faGlassCheers} />
       </div>
       <label style={{pointerEvents: 'none'}}>Bebidas</label>
     </button>
     <button style={{backgroundColor: '#a1522d'}} onClick={() => openOutrosMenu()}>
      <div className='top'>
       <FontAwesomeIcon icon={icons.faIceCream} />
       </div>
       <label style={{pointerEvents: 'none'}}>Outros</label>
     </button>
     <button className='disabled' style={{backgroundColor: '#0c6b00'}} onClick={() => openRecentesMenu()}>
      <div className='top'>
       <FontAwesomeIcon icon={icons.faHistory} />
       </div>
       <label style={{pointerEvents: 'none'}}>Recentes</label>
     </button>
     <button className='disabled' style={{backgroundColor: '#961a90'}} onClick={() => {}}>
       <div className='top'>
       <FontAwesomeIcon icon={icons.faPizzaSlice} />
       <FontAwesomeIcon icon={icons.faGlassCheers} />
       </div>
       <label style={{pointerEvents: 'none'}}>Combos</label>
     </button>
    </div>
  )
}

function openTopPagamentoMenu(pagamento){
  openSelectBox(
    <Pagamento fechar={fecharSelectBox} pedido={curr} pagamento={pagamento} />
  )
}

function editarItem(item){
  switch(item.tipo){
    case 0:
      openPizzasMenu(item)
      break
    case 1:
      openBebidasMenu(item)
      break
    case 3: 
      openOutrosMenu(item)
      break
    case 5:
      openRecentesMenu(item)
      break
    default:
      alert('não implementado')
  }
}

useEffect(() => {
  if(curr){
    const _itens = [...curr.itens]
    let pizzas = []
    let bebidas = []
    let outros = []
    for(let item of _itens){
      if(item.tipo === 0){
          //pizza
          let achou = false
          for(let p of pizzas){
            if(item.pizza.tamanho.nome === p.pizza.tamanho.nome
              && getSaboresDescritos(item.pizza.sabores) === getSaboresDescritos(p.pizza.sabores)
              && item.observacoes === p.observacoes){
                if(p.id){p.ids = [p.id]}
                p.ids = [...p.ids, item.id]
                p.valor += item.valor
                delete p.id
                achou = true
                break;
              }
          }
          if(!achou){pizzas.push({...item})}   
        }else if(item.tipo === 1){
          //bebida
          let achou = false
          for(let b of bebidas){
            if(item.bebida.id === b.bebida.id
              && item.bebida.tamanho === b.bebida.tamanho
              && item.bebida.sabor === b.bebida.sabor
              && item.bebida.tipo === b.bebida.tipo
              && item.observacoes === b.observacoes){
                if(b.id){b.ids = [b.id]}
                b.ids = [...b.ids, item.id]
                b.valor += item.valor
                delete b.id
                achou = true
                break;
              }
          }
          if(!achou){bebidas.push({...item})}    
        }else if(item.tipo === 2){
          const a = 'hamburguer'
        }else if(item.tipo === 3){
          //outro
          let achou = false
          for(let o of outros){
            if(item.outro.id === o.outro.id
              && item.outro.nome === o.outro.nome
              && item.observacoes === o.observacoes){
                if(o.id){
                  o.ids = [o.id]
                }
                o.ids = [...o.ids, item.id]
                o.valor += item.valor
                delete o.id
                achou = true
                break;
              }
          }
          if(!achou){outros.push({...item})}    
      }
    }
    setItensAgupados([...pizzas, ...bebidas, ...outros])
  }else{setItensAgupados([])}
}, [curr]) 


function contextMenuItem(i){
  contextMenu([
    {title:'Editar', click:()=> editarItem(i)},
    {title:'Copiar...', click: () =>{
      const cp = (qtd) => {alert(`Copiar ${qtd}x`)}
      contextMenu([
        {title:'Acres. mais 1',click:() => cp(1)},
        {title:'Acres. mais 2',click:() => cp(2)},
        {title:'Acres. mais 3',click:() => cp(3)},
        {title:'Acres. mais 4',click:() => cp(4)},
      ])
    }},
    {title:'Excluir',click:()=>{alert('EXCLUIR')}},
  ])
}

  return curr
  ? (
    <Container pedido={curr}
    corTipo={!misc.isNEU(curr.tipo) ? cores.tipo(curr.tipo) : 'transparent'}>
      <div className='top-container'>
        <div className='id'>
          {curr.id > 0 ? `Pedido #${curr.id}` : 'Pedido Novo!'}
        </div>
        <div className='data'>
          {!misc.isMobile() && 'Data: '}
          {curr.dataInic 
          ? new Date(curr.dataInic).toLocaleDateString()
          : new Date().toLocaleDateString('pt-BR')}
        </div>
        <div className='tipo'>
          {!misc.isMobile() 
          && <label>Tipo:</label>}
          <button className='tipo-botao'
          style={curr.tipo && {backColor: cores.tipo(curr.tipo)}}
          onClick={() => openSelectBoxTipo()}
          >
            {!misc.isNEU(curr.tipo)
            ? <>
            <FontAwesomeIcon icon={pedidoUtil.IcoTipo(curr.tipo)} />
            <label>{curr.tipo}</label>
            </>
            : <>
            <FontAwesomeIcon icon={icons.faQuestion} />
            <label>ALTERAR</label>
            </>}
          </button>
        </div>
        <div className='botoes'>
          <button className='opcoes'>
            <FontAwesomeIcon icon={icons.faEllipsisV} />
          </button>
          {!misc.isMobile() 
          && <button className='close' onClick={() => fechar(curr)}>
            <FontAwesomeIcon icon={icons.faTimes} />
          </button>}
        </div>
      </div>

      <div className='middle-container'>

        <div ref={boxCliente} className='cliente-container box'>
          <div className='top cliente'>
            <button className='principal' onClick={() => openTopClienteMenu()}>CLIENTE</button>
            <button className='secondary' onClick={() => boxCliente.current.classList.toggle('collapsed')}>_</button>
          </div>
          <div className='content'>
            <div className='img-id'>
              {
              curr.cliente?.imagem
              ? <img src={curr.cliente.imagem} alt='' 
                onClick={() => imageView({title: curr.cliente.nome, image: curr.cliente.imagem})}/>
              : curr.cliente?.nome
              ? <FontAwesomeIcon className='icon' icon={icons.faUser} />
              : <FontAwesomeIcon className='icon' icon={icons.faTimes} />
              }
              {curr.cliente?.id && <p>{curr.cliente.id}</p>}
            </div>
            <div className='info'>
              <div className='top'>
                {curr.cliente?.id
                && <span className='alert' style={getAlertStyle()}></span>}
                <span className='nome'>{curr.cliente?.nome || 'SEM CLIENTE!'}</span>
              </div>
              <div className='middle'>
                <label className='tags'>{curr.cliente?.tags?.length > 0
                && curr.cliente.tags.join(', ')}</label>
                {curr?.cliente?.id
                ? <label className='pedido'>{getPedNum()}</label>
                : curr.cliente.nome
                ? <label className='sem-cadastro'>Sem cadastro!!</label>
                : <label className='sem-cadastro'>Altere o cliente para liberar ações do pedido.</label>}
              </div>
              <div className='contatos-container'>
                <ul className='contatos'>{curr.cliente?.contato?.length > 0
                  && curr.cliente.contato.map(e => (
                    <li key={e}
                    onClick={() => contatoClick(e)}
                    >{Format.formatPhoneNumber(e)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {curr.tipo === 'ENTREGA' && 
        <div ref={boxEndereco} className={`endereco-container box${showMapa ? ' large' : ''}`}>
        <div className='top endereco'>
            <button className='principal'>ENDEREÇO</button>
            <button className='secondary' onClick={() => boxEndereco.current.classList.toggle('collapsed')}>_</button>
          </div>
            {curr.endereco &&
              <div className='content'>
                <div className='info'>
                  <div className='top'>
                    <p className='endereco'>
                        {Format.formatEndereco(curr.endereco, false)}
                      </p>
                  </div>
                    <div className='bottom'>
                      <button className={curr.endereco.taxa !== curr.endereco.bairro.taxa ? 'alert' : undefined}
                      title={curr.endereco.taxa !== curr.endereco.bairro.taxa ? 'Taxa atual diferente da original!' : ''}>
                        Taxa: {Format.formatReal(curr.endereco.taxa)}
                      </button>
                      <button className={curr.endereco.entregador.id !== getEntregadorPadrao()  ? 'alert' : undefined}
                      title={curr.endereco.taxa !== curr.endereco.bairro.taxa ? 'Entregador diferente do padrão!' : ''}>
                        Entregador:{curr.endereco.entregador.nome}
                      </button>
                  </div>
                </div>
                  {mapa} 
              </div>
            }
        </div>}

        {curr.tipo === 'APLICATIVO' &&
        <div ref={boxAplicativo} className='aplicativo-container box'>
        <div className='top aplicativo'>
            <button className='principal'>APLICATIVO</button>
            <button className='secondary' onClick={() => boxAplicativo.current.classList.toggle('collapsed')}>_</button>
          </div>
        </div>}

        <div ref={boxItens} className={`itens-container box
        ${curr.itens && itensAgrupados.length > 5 ? 'superlarge' 
        : curr.itens && itensAgrupados.length > 2 ? 'large' 
        : curr.itens && itensAgrupados.length > 1 ? 'big' : ''}`}>
        <div className='top itens'>
            <button className='principal' onClick={() => openTopItensMenu()}>ITENS</button>
            <button className='secondary' onClick={() => boxItens.current.classList.toggle('collapsed')}>_</button>
          </div>
          <div className='content'>
            <ul className='itens-ul'>
              {curr.itens && itensAgrupados
              .map(i => (              
                <li key={i.id ? i.id : i.ids.join(',')}
                onDoubleClick={() => editarItem(i)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  contextMenuItem(i)
                }}
                >
                  <div className='inicio'>
                    <input type={'checkbox'} />
                    {i.tipo === 0 
                    ? <FontAwesomeIcon icon={icons.faPizzaSlice} /> 
                    : i.tipo === 1 
                    ? i.bebida.imagem 
                    ? <img src={Format.convertImageToBase64(i.bebida.imagem)} /> 
                    : <FontAwesomeIcon icon={icons.faGlassCheers} />
                    : i.tipo === 2
                    ? i.hamburguer.imagem
                    ? <img src={Format.convertImageToBase64(i.hamburguer.imagem)} /> 
                    : <FontAwesomeIcon icon={icons.faHamburger} /> 
                    : i.tipo === 3
                    ? i.outro.imagem 
                    ? <img src={Format.convertImageToBase64(i.outro.imagem)} /> 
                    : <FontAwesomeIcon icon={icons.faIceCream} /> 
                    : <FontAwesomeIcon icon={icons.faUtensils} /> }
                  </div>
                  <div className='centro'>
                    <label className='titulo'>
                      {i.ids ? `x(${i.ids.length}) ` : ''}
                      {i.tipo === 0 
                      ? `Pizza${i.ids ? 's tam.' : ''} ${i.pizza.tamanho.nome}, 
                      ${i.pizza.sabores.length} 
                      sabor${i.pizza.sabores.length > 1 ?'es':''}` 
                      : i.tipo === 1 
                      ? [i.bebida.nome, i.bebida.sabor ?? '', 
                      Format.formatLitro(i.bebida.tamanho)].filter(e => e !== '').join(' ') 
                      : i.tipo === 2
                      ? 'HAMBURGUER'
                      : i.tipo === 3
                      ? i.outro.nome 
                      : 'ITEM DESCONHECIDO' }
                    </label>
                    <p className='info-secundarias'>
                      {i.tipo === 0 
                        ? getSaboresDescritos(i.pizza.sabores)
                        : i.tipo === 1 
                        ? i.bebida.tipo
                        : i.tipo === 2
                        ? 'HAMBURGUER'
                        : '' }
                    </p>
                    <p className='info-secundarias observacoes'>
                      {i.observacoes}
                    </p>
                  </div>
                  <div className='fim'>
                    <label className='valor-item'>
                      {Format.formatReal(i.valor)}
                    </label>
                    <button className='opcoes-item' 
                    onClick={() => contextMenuItem(i)}>
                      <FontAwesomeIcon icon={icons.faEllipsisV} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
            {curr?.itens?.length > 0 &&
            <label className='bottom'>
              Total de itens: {curr.itens.length} | {
              Format.formatReal(curr.itens.reduce((a, b) => a + b.valor, 0))}
            </label>}
        </div>

        <div ref={boxPagamento} className={`pagamento-container box
        ${curr?.pagamentos?.length > 5 ? 'superlarge' 
        : curr?.pagamentos?.length > 2 ? 'large' 
        : curr?.pagamentos?.length > 0 ? 'big' : ''}`}>
          <div className='top pagamento'>
            <button className='principal' onClick={() => openTopPagamentoMenu()}>PAGAMENTO</button>
            <button className='secondary' onClick={() => boxPagamento.current.classList.toggle('collapsed')}>_</button>
          </div>
          <div className='content'>
            <div className='valores'>
              <span>
                <h3 className='pago'>{Format.formatReal(getValorPago())}</h3>
                <h6>Valor Pago</h6>
              </span>
              <span>
              <h2 className='pendente'>{Format.formatReal(curr.valor - getValorPago())}</h2>
                <h6>Valor Pendente</h6>
              </span>
              <span>
                <h3 className='total'>{Format.formatReal(curr.valor)}</h3>
                <h6>Valor Total</h6>
              </span>
            </div>
            <ul className='pagamentos-ul'>
                {curr?.pagamentos?.map(e => 
                  <li key={e.id} className={e.status === 1 ? 'pago' : 'pendente'} >
                    <div className='inicio'>
                        {
                        e.tipo === 0 
                        ? <FontAwesomeIcon icon={icons.faMoneyBillWaveAlt} />
                        : e.tipo === 1 
                        ? <FontAwesomeIcon icon={icons.faCreditCard} />
                        : e.tipo === 2
                        ? <FontAwesomeIcon icon={icons.faGlobe} />
                        : e.tipo === 3
                        ? <FontAwesomeIcon icon={icons.faExchangeAlt} />
                        : e.tipo === 4
                        ? <FontAwesomeIcon icon={icons.faCalendarCheck} />
                        : e.tipo === 5
                        ? <FontAwesomeIcon icon={icons.faQuestion} />
                        : <FontAwesomeIcon icon={icons.faCommentDollar} /> 
                        }
                    </div>
                    <div className='centro'>
                        <div className='info-secundarias'>
                          <p>Cód.{e.id}</p>
                          <p>{`Add ${pedidoUtil.getDataPagamentoDescrito(e.dataAdicionado)}`}</p>
                          {e.status === 1 && e.dataRecebido && <p>{`Receb. ${pedidoUtil.getDataPagamentoDescrito(e.dataRecebido)}`}</p>}
                        </div>
                        <label className='titulo'>
                          {`${Format.formatReal(e.valorPago)} - ${
                            e.tipo === 0 
                            ? 'EM ESPÉCIE'
                            : e.tipo === 1 
                            ? 'NO CARTÃO'
                            : e.tipo === 2
                            ? 'VIA PIX'
                            : e.tipo === 3
                            ? 'TRANSFERÊNCIA BANCÁRIA'
                            : e.tipo === 4
                            ? `AGENDADO P/ ${e.progr.data}` 
                            : e.tipo === 5
                            ? 'NÃO INFORMADO'
                            : 'DESCONHECIDO PELO SISTEMA'} ${
                              e.status === 1
                              ? '(PAGO)'
                              : '(PENDENTE)'
                            }`
                          }
                        </label>
                        {e.valorRecebido && e.valorPago < e.valorRecebido && 
                        <div className='info-secundarias bottom'>
                          <p>{`Troco para ${Format.formatReal(e.valorRecebido)}`}</p>
                          <p>{`(${Format.formatReal(e.valorRecebido - e.valorPago)} de troco)`}</p>
                        </div>}
                    </div>
                    <div className='fim'>
                      <button className='opcoes-item'>
                        <FontAwesomeIcon icon={icons.faEllipsisV} />
                      </button>
                    </div>
                  </li>
                  )}
            </ul>
          </div>
          {curr?.pagamentos?.length > 0 &&
            <label className='bottom'>
              Total de pagamentos: {curr.pagamentos.length} | {
              Format.formatReal(curr.pagamentos.reduce((a, b) => a + b.valorPago, 0))}
            </label>}
        </div>

      </div>

      <button className={`observacoes-container${!curr.observacoes ? ' collapsed': ''}`}
      type='button' 
      onClick={() => mudarObservacoes()}>
        <label>Observações:</label>
        <p className='observacoes'>{curr.observacoes ?? 'Adicionar observação.'}</p>
      </button>

      <div className='bottom-container'>
        
      <button className='bot-button cancelar'>
          <FontAwesomeIcon className='icon' icon={icons.faTrash} />
          <div className='info-botao'>
            <label>Cancelar</label>
          </div>
        </button>

        <button className='bot-button imprimir'>
          <FontAwesomeIcon className='icon' icon={icons.faPrint} />
          <div className='info-botao'>
            <label>Imprimir</label>
            {curr.impr > 0 
            && <label className='bottom'>
              {` (${curr.impr + 1}º vez)`}</label>}
          </div>
        </button>


        <button className='bot-button finalizar'>
          <FontAwesomeIcon className='icon' icon={icons.faClipboardCheck} />
          <div className='info-botao'>
            <label>Finalizar</label>
          </div>
        </button>

      </div>

    </Container>
  )
  : (<></>)
}

export default Pedido;

const Container = styled.div`
background-color: ${cores.branco};
display: flex;
flex-direction: column;
height: 100%;//calc(100vh - 50px) ;
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

.top-container{
  overflow: hidden;
  display: flex;
  background-color: whitesmoke;
  border-bottom: 1px solid gray;
  padding: 2px;
  flex-shrink: 0;
  *{color: ${cores.cinzaEscuro};}
  align-items: center;
  &>div{
    display: flex;
    justify-content: center;
    user-select: none;
    gap: 5px;
    padding: 0 5px;
  }
  .id{
    flex-grow: 1;
  }
  .data{
    flex-grow: 2;
  }
  .tipo{
    flex-grow: 3;
    align-items: center;
    display: flex;
    justify-content: center;

    .tipo-botao{
      border: none;
      background-color: transparent;
      margin-left: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      padding: 5px;
      cursor: pointer;

      @media (hover: hover) and (pointer: fine) {
        &:hover { *{color: black;} }
      }
      
      *{
        pointer-events: none;
        color: ${props => props.corTipo};
        font-size: 15px;
        font-weight: 600;
      }
    }
  }
  > .botoes{
    flex-grow: 0;
    width: 120px;
    display: flex;
    gap: 2px;

    @media (max-width: 760px){
      width: 60px;
    }

    button{
      border: none;
      background-color: transparent;
      cursor: pointer;
      flex-grow: 2;
      *{pointer-events: none;}
      &:hover{
        *{color: black}
      }
    }
  }
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
  
  .box{
    display: flex;
    flex-direction: column;
    background-color: whitesmoke;
    box-shadow: 0 2px 8px rgba(0,0,0,.5);
    min-height: 180px;
    border: 1px solid black;
    border-radius: 10px;
    overflow: hidden;

    &.hidden{
      display: none;
    }
    &.collapsed{
      min-height: 30px;
      max-height: 30px;
      height: 30px;
    }
    >.top{
      flex-shrink: 0;
      flex-grow: 0;
      background-color: white;
      border-bottom: 1px  solid black;
      height: 30px;
      display: flex;
      padding: 0 10px;
      .principal{
        flex-grow: 2;
        text-align: center;
        vertical-align: middle;
        line-height: 30px;
        border: none;
        background-color: transparent;
        cursor: pointer;
        &:hover{
          font-size: 17px;
          font-weight: 600;
        }
      }
      .secondary{
        background-color: whitesmoke;
        width: 50px;
        border: none;
        cursor: pointer;
      }
      &.cliente{background-color: ${cores.vermelho}}
      &.endereco{background-color: ${cores.azul}}
      &.aplicativo{background-color: ${cores.roxo}}
      &.itens{background-color: ${cores.amarelo}}
      &.pagamento{background-color: ${cores.verde}}
    }
  }


  .cliente-container{
    min-height: 140px;

    ${(props) => !(!props.pedido.cliente.id || props.pedido.cliente.id < 1)}{
      min-height: 120px;
      }

    .content{
      gap: 10px;
      padding: 5px;
      display: flex;
      align-items: center;
      flex-grow: 2;
      .img-id{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100% ;
        width: 70px;
        flex-shrink: 0;
        img{
          border: 2px solid black;
          border-radius: 50% ;
          width: 70px ;
          height: 70px ;
          object-fit: cover;
          cursor: pointer;
        }
        .icon{
          font-size: 60px;
        }
        p{
          font-size: 10px;
        }
      }
      .info{
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .top{
          display: flex;
          .alert{
            display: inline-block;
            background-color: green;
            width: 20px;
            height: 20px;
            border-radius: 50% ;
            border: 1px solid black;
            margin-right: 10px;
          }
          .nome{
            line-height: 100% ;
            display: inline-block;
            font-size: 20px;
          }
        }

        .middle{
          *{
            display: block;
          }
          .tags{
            font-size: 13px;
          }
          .pedido{
            font-size: 13px;
            font-style: italic;
          }
        }

        .contatos-container{
          padding: 0 10px 0 0;
          overflow-x: auto;
          display: flex;
          .contatos{
            gap: 10px;
            flex-shrink: 0;
            flex-grow: 0;
            list-style: none;
            display: flex;
            li{
              *{pointer-events: none;}
              flex-shrink: 0;
              flex-grow: 0;
              border: 1px solid black;
              padding: 3px;
              cursor: pointer;

              &:hover{
                background-color: ${cores.branco};
              }

            }
          }
        }

      }
    }
  }

  .endereco-container{
    &.large:not(.collapsed){
      min-height: 400px;
    }
    .content{
      flex-grow: 2;
      padding: 5px;
      display: flex;
      flex-direction: column;
      gap: 5px;

      .info{
        flex-grow: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .top{
          display: flex;
          flex-grow: 2;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 20px;
        }
        .bottom{
          display: flex;
          justify-content: space-between;
        > button{
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            height: 30px;
            padding: 0 10px;
            background-color: transparent;
            border: none;
            font-size: 15px;

            &.alert{
              color: red;
              font-weight: 600;
            }
          }
        }
      }

      .mapa{
        display: flex;
        flex-direction: column;
        button{
          background-color: transparent;
          border: none;
          cursor: pointer;
          &:hover{
            color: blue;
          }
        }
        .mapouter{
        width: 100% ;
        height: 250px ;
        overflow: hidden;
        border: 1px solid black;
        border-radius: 10px;
      }
      .gmap_canvas {
        overflow:hidden;
        background:none!important;
      }
      iframe{
        height: 250px ;
        width: 100% ;
      }

      }

    }
  }

  .itens-container{
    display: flex; 
    min-height: 145px;
    &.big:not(.collapsed){
      min-height: 215px;
    }
    &.large:not(.collapsed){
      min-height: 290px;
    }
    &.superlarge:not(.collapsed){
      min-height: 400px;
    }
    .content{
      flex-grow: 2;
      display: flex;
      overflow-y: auto;
      .itens-ul{
        display: flex;
        flex-direction: column;
        padding: 0 5px 5px 5px;
        overflow-y: auto;
        flex-grow: 2;
        li{
          display: flex;
          gap: 5px;
          padding: 5px;
          flex-shrink:0;
          flex-basis: 70px;
          border-bottom: 1px solid black;
          *{pointer-events: none;}
            &:hover{ 
              background-color: ${cores.branco}; 
            }
          .inicio{
            display: flex;
            align-items: center;
            gap: 5px;
            input{
              pointer-events: all;
            }
            img{
              width: 40px;
              height: 40px;
            }
            svg{
              width: 30px;
              height: 30px;
              margin: 0 5px 0 5px;
            }
          }
          .centro{
            flex-grow: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            label{
              font-weight: 600;
            }
            .info-secundarias{
              font-size: 12px;
              font-style: italic;

              &.observacoes{
                color: red;
                font-weight: 600;
                font-size: 11px;
              }
            }
            @media (max-width: 550px){
              label{
                font-weight: 600;
                font-size: 14px;
              }
              .info-secundarias{
                font-size: 11px;
                font-style: italic;
              }
            }
          }
          .fim{
            display: flex;
            gap: 10px;
            align-items: center;
            label{
              font-weight: 600;
              font-size: 18px;
            }
            button{
              font-size: 20px;
              height: 100% ;
              background-color: transparent;
              border: none;
              cursor: pointer;
              pointer-events: all;
              width: 40px;
            }
          }

        }
      }
    }
    .bottom{
      display: flex;
      padding: 5px;
      background-color: ${cores.branco};
      border-top: 1px solid black;
      color: ${cores.cinzaDark};
    }
  }

  .pagamento-container{
    display: flex; 
    min-height: 90px;
    &.big:not(.collapsed){
      min-height: 180px;
    }
    &.large:not(.collapsed){
      min-height: 280px;
    }
    &.superlarge:not(.collapsed){
      min-height: 400px;
    }
    .content{
      display: flex;
      flex-direction: column;
      flex-grow: 2;
      overflow-y: auto;
      gap: 5px;
      .valores{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6% ;

        >span{
          display: flex;
          flex-direction: column;
          justify-content: center;
          *{text-align: center;}
        }

        .pago{color: ${cores.verdeEscuro}}
        .pendente{color: darkred}
        /* .total{color: ${cores.cinzaDark}} */
      }
      .pagamentos-ul{
        display: flex;
        flex-direction: column;
        padding: 0 5px 5px 5px;
        overflow-y: auto;
        flex-grow: 2;

        li{
          display: flex;
          gap: 5px;
          padding: 5px;
          flex-shrink:0;
          flex-basis: 50px;
          border-bottom: 1px solid black;
          *{pointer-events: none;}
          &:hover{ 
              background-color: ${cores.branco}; 
            }
          .inicio{
            display: flex;
            align-items: center;
            gap: 5px;
            svg{
              width: 30px;
              height: 30px;
              margin: 0 5px 0 5px;
            }
          }
          .centro{
            flex-grow: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .info-secundarias{
              display: flex;
              gap: 5px;

              p{
                font-size: 10px;
                font-style: italic;
                :not(:last-child){
                  &::after{
                    content: ' | '
                  }
                }
              }
              @media (max-width: 550px){ 
                &:not(.bottom){
                  display: none;
                }          
              }
            }
            .titulo{
              font-weight: bolder;
              @media (max-width: 550px){
                font-size: 14px;
              }
            }
          }
          .fim{
            display: flex;
            gap: 10px;
            align-items: center;
            label{
              font-weight: 600;
              font-size: 18px;
            }
            button{
              font-size: 20px;
              height: 100% ;
              background-color: transparent;
              border: none;
              cursor: pointer;
              pointer-events: all;
              width: 40px;
              *{color: black!important;}
            }
          }
          &.pago{
            *{color: ${cores.verdeEscuro}}
          }
          &.pendente{
            *{color: ${cores.vermelhoDark}}
          }
        }
      }
    }

    > .bottom{
      display: flex;
      padding: 5px;
      background-color: ${cores.branco};
      border-top: 1px solid black;
      color: ${cores.cinzaDark};
    }
  }

}

.observacoes-container{
  display: flex;
  flex-direction: column;
  padding: 3px;
  border: none;
  border-top: 1px solid black;
  gap: 5px;
  height: 80px;
  overflow: auto;
  cursor: pointer;
  font-weight: 600;
  color: red;
  background-color: whitesmoke;

  &.collapsed{
    color: black;
    font-weight: normal;
    height: 65px;
  }

  *{
    width: 100%;
    pointer-events: none;
    text-align:  center;
  }
  &:hover{
      color: darkblue;
      font-weight: 600;
    }
  label{
    font-size: 10px;
  }
  .observacoes{
    flex-grow: 2;
    font-size: 14px;
    @media (max-width: 550px){font-size: 12px;}
  }
}

> .bottom-container{
  flex-basis: 60px;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: whitesmoke;
  display: flex;
  gap: 10px;
  padding: 5px 10px;

  @media print{
    display: none;
  }

  .bot-button{
    height: 100% ;
    flex-grow: 1;
    border: 2px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    *{pointer-events: none;}
    .icon{
      font-size: 18px;
    }
    .info-botao{
      display: flex;
      flex-direction: column;
      .bottom{
        font-size: 10px;
        font-weight: 600;
      }
    }
    &.cancelar{
      background-color: ${cores.vermelho};
    }
    &.imprimir{
      background-color: ${cores.amarelo};
    }
    &.finalizar{
      background-color: ${cores.verde};
    }
    &:hover{
      color: white;
      &.cancelar{
      background-color: ${cores.vermelhoDark};
    }
    &.imprimir{
      background-color: ${cores.amareloDark};
    }
    &.finalizar{
      background-color: ${cores.verdeDark};
    }
    }
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



