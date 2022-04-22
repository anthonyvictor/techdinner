import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { SearchBar } from "../../../components/SearchBar";
import { useImageViewer } from "../../../components/ImageViewer";

import * as apis from "../../../apis";
import * as msg from "../../../util/Mensagens";
import * as format from "../../../util/Format";
import * as misc from "../../../util/misc";
import * as cores from "../../../util/cores";

import { useClientes } from "../../../context/clientesContext";
import { useCadCli } from "../../../context/cadClientesContext";
import { useRotas } from "../../../context/rotasContext";
import ListaProvider from "../../../context/listaContext";
import {Lista} from '../../../components/Lista'

import { NotImplementedError } from "../../../exceptions/notImplementedError";
import { useContextMenu } from "../../../components/ContextMenu";
import axios from "axios";
import { useApi } from "../../../api";


export default function ListaCli(props) {
  const {setCurrentRoute} = useRotas()
  const {curr, setCurr, lista, setLista, images, setImages} = useCadCli();
  const [search, setSearch] = useState("");
  const { clientes, setClientes, getImages } = useClientes();
  const {contextMenu} = useContextMenu()
  const [filtered, setFiltered] = useState([])
  const { imageView } = useImageViewer()
  const {api} = useApi()
  

  useEffect(() => {
    window.onbeforeunload = (e) => {
      // if([imagem,nome,contatos,tags,endereco].join.length > 0){
      //   e.preventDefault();
      // e.returnValue = window.confirm("Deseja realmente sair?");
      // }
    };
    window.history.pushState(null, null, document.URL);
    window.onpopstate = (e) => {
      e.preventDefault();
      return (e.returnValue = "Não é permitido sair!!!");
    };
  })//handle reload

  function openContext(cliente) {
    contextMenu([
      {title: 'Editar', 
      click:() => editar(cliente), 
      enabled: true, visible: true},

      {title: 'Copiar', 
      click:() => openContextCopiar(cliente), 
      enabled: true, visible: true},

      {title: 'Mensagem', 
      click:() => openContextMensagem(cliente), 
      enabled: true, visible: true},

      {title: 'Excluir', 
      click:() => excluir(cliente), 
      enabled: true, visible: true},

      {title: 'Ver imagem', 
      click:() => verImagem(cliente),
      enabled: cliente.imagem, 
      visible: true}
    ])
  }
  function itemClick(e){
    if(props.retorno){
      props.retorno(e)
    }else{
      editar(e)
    }
  }

  const c_all = (cliente) => {
    return `Cliente: ${cliente.nome}
    \nContato: ${cliente.contato.join(", ")}
    \nEndereço: ${format.formatEndereco(cliente.endereco, false, true)}`
  }

  function openContextCopiar(cliente) {
    contextMenu([
      {title: 'iD', 
      text: cliente.id,
      enabled: true, visible: true},

      {title: 'Nome', 
      text: cliente.nome,
      enabled: true, visible: true},

      {title: 'Contato', 
      text: cliente.contato.join(", "),
      enabled: true, visible: true},

      {title: 'Endereço', 
      text: format.formatEndereco(cliente.endereco,true, true),
      enabled: true, visible: !!cliente.endereco},

      {title: 'Tudo', 
      text: c_all(cliente),
      enabled: true, visible: !!cliente.endereco}
    ])
  }

 
  function whatsappMessage(phoneNumber){
    if (phoneNumber !== "") {
      apis.sendWhatsAppMessage(`Olá, ${msg.Cumprimento()}`, phoneNumber);
    }
  }


  function openContextMensagem(cliente) {
    if (cliente.contato.length > 1) {

      contextMenu(cliente.contato.map(e => 
        { return{
          title: format.formatPhoneNumber(e, false), 
          click:() => whatsappMessage(e), 
          enabled: true, visible: true
        }}
      ))
    } else {
      whatsappMessage(cliente.contato[0]);
    }
  }

  function editar(cliente) {
    let preenchido = !misc.isNEU(misc.joinObj(curr))
    const change = () => {props.changeTab ? props.changeTab() : setCurrentRoute(props.tabs[1])}
    if (curr && curr.id === cliente.id) {
      change()
    } else if ((preenchido && window.confirm("Deseja cancelar a edição atual?")) ||
      !preenchido) {
      setCurr(cliente)
      change()
    }
  }

  function excluir(cliente) {
    if (cliente.pedidos && Number.parseInt(cliente.pedidos) > 0) {
      alert("Impossível excluir, este cliente já realizou pedidos!");
    } else if (
      window.confirm(
        "Deseja REALMENTE excluir este cliente? Seus dados serão PERMANENTEMENTE apagados."
      )
    ) {
      const payload ={
        data: {id: cliente.id}
      }
      api().delete('clientes/excluir', payload)
      .then(()=>{
        setClientes(prev => prev.filter(e=> e.id !== cliente.id))
      })
      .catch(e=>{
        alert(`Erro: ${e}`)
      })
    }
  }

  function openFilter() {}


  function verImagem(cliente) {
    
    imageView({
      title: cliente.nome,
      image: cliente.imagem,
    })

    //  window.open(format.convertImageToBase64(images.filter(i => i.id === cliente.id)[0].imagem));
  }

  // function isPhoneEqual(a){
  //   return a.contatos.some(c => misc.equals(format.formatPhoneNumber(c), format.formatPhoneNumber(search)))
  // }
  const nomeTags = (e) => [e.nome, ...e.tags.map(tag => `${e.nome} ${tag} ${e.nome}`)].join(' ')
  
  function ordem(a,b,maxID){
  
    const ult = (e) => 
    e.ultPedido ? Number(e.ultPedido.split('/')
    .reverse().join('') ?? 0) : 0 
    const i = (e) => e.includes(pTexto) 

    const _nomeExato = () => 
    pTexto.length > 0 ?
    a.nome === pTexto && b.nome !== pTexto  ? -1
    : b.nome === pTexto && a.nome !== pTexto ? 1 : null
    : null

    const _nomeTags = () => 
    pTexto.length > 3 ?
    i(nomeTags(a)) && !i(nomeTags(b)) ? -1
    : !i(nomeTags(a)) && i(nomeTags(b)) ? 1 : null
    : null
    
    const _novo = () => 
    pTexto.length > 3 ?
    (a.pedidos === 0 && Number(maxID) - Number(a.id) < 51) ? -1
    : (b.pedidos === 0 && Number(maxID) - Number(b.id) < 51) ? 1 : null
    : null

    const _pedidos = () => 
    pTexto.length >= 3 ?
    a.pedidos > b.pedidos ? -1 
    : a.pedidos < b.pedidos ? 1 : null
    : null

    const _ultPed = () => 
    pTexto.length > 3 ?
    ult(a) > ult(b) ? -1 
    : ult(a) < ult(b) ? 1 : null
    : null

    const _id = () => 
    pTexto.length < 4 ?
    a.id > b.id ? -1
    : a.id < b.id ? 1 : null
    : null

    let order = 
    _nomeExato() ?? _nomeTags() ?? 
    _novo() ?? _pedidos() ?? 
    _ultPed() ?? _id() ?? 0

    return order
  }
const [pTexto, setPTexto] = useState('')

function filtro(obj, searcString, pNumero, pPhone) {
  if (searcString !== "") {
  let txt = misc.joinObj(obj)     

    let val = txt.toUpperCase().replace(/[^a-z0-9]/gi, "");

    const p1 = val.includes(pTexto)

    const p2 = val.includes(pNumero)

    const p3 = !misc.isNEU(pPhone) && val.includes(pPhone)

    const p4 = misc.removeConjuncoes(val).includes(misc.removeConjuncoes(pTexto))

    return p1 || p2 || p3 || p4
  } else {
    return true;
  }
}

useEffect(() => {
  let pNumero = pTexto.replace(/[^0-9]/gi)
  let pPhone = format.formatPhoneNumber(pNumero, false)

  let step1 = [...clientes].filter(e => 
    filtro({
      id: e.id, 
      nomeTags: nomeTags(e),
      contato: e.contato,
      endereco: e.endereco
    }, 
    pTexto, pNumero, pPhone))
  let maxID = step1.length > 0 
  ? step1.map(e => e.id).reduce((max, val) => max > val ? max : val)
  : 0
  let step2 = step1.sort((a,b)=>ordem(a,b,maxID))
  let step3 = step2.slice(0, 10)
  setFiltered(step3)      
},[pTexto, clientes])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPTexto(misc.removeAccents(search)
    .toUpperCase().replace("  ", " ")
    .replace("  ", " ").replace(/[^a-z0-9]/gi, ""))
    }, 700);

    return() => clearTimeout(timer)
  }, [search])//eslint-disable-line

  useEffect(() => {
    if(filtered){

      // function fillImages(){
      //   getImages(filtered.map(e => e.id)).then(imgs => {
      //     setImages(prev => [
      //       ...prev,
      //       ...imgs.filter(img => prev.map(p => p.id).includes(img.id) === false )
      //     ])
      //   })
      // }
  
      // const timer = setTimeout(() => {fillImages()}, 1500);
      
      setLista(true);
      // return () => clearTimeout(timer);
    }else{
      setLista(false)
    }
  }, [filtered])//eslint-disable-line

  return (
    <Estilo className="lista-clientes">
      <SearchBar value={search} setValue={setSearch} filter={openFilter} />

      <ListaProvider fullDataArray={filtered} itemDoubleClick={itemClick} itemRightClick={openContext} >
        <Lista >
          {lista && 
            filtered.map((cliente) => (
              <li className="cli-li" key={cliente.id}>
    
                <div className="inicio">
                  {cliente.imagem && <img src={cliente.imagem} alt="imagem" />}
                  <label className={`id${misc.isNEU(cliente.valorGasto) ? ' novo' : ''}`}>{cliente.id}</label>
                </div>
    
                <div className="centro">
                  <div className="info">
                    <label className="nome">{cliente.nome}</label>
                    <span className="contato">, {cliente.contato.map(e => format.formatPhoneNumber(e)).join(", ")}</span>
                    <span className="tags">
                      {!misc.isNEU(cliente.tags) && ", " + cliente.tags.join(", ")}
                    </span>
    
                    <p className="endereco">
                      {format.formatEndereco(cliente.endereco, false, true)}
                    </p>
    
                    <div className="bottom-info">
                      {cliente.endereco?.taxa > 0 && (
                        <span>
                          Taxa: {format.formatReal(cliente.endereco.taxa)}
                        </span>
                      )}
    
                      {!misc.isNEU(cliente.pedidos) && cliente.pedidos > 0 && (
                        <span>Pedidos: {cliente.pedidos}</span>
                      )}
    
                      {!misc.isNEU(cliente.valorGasto) &&
                        cliente.valorGasto > 0 && (
                          <span>{format.formatReal(cliente.valorGasto)}</span>
                        )}
    
                      {!misc.isNEU(cliente.ultPedido) && (
                        <span>Últ. pedido: {cliente.ultPedido}</span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))
          }
        </Lista>
      </ListaProvider>
    </Estilo>
  );
}





const Estilo = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100% ;
  height: 100% ;
  flex-grow: 2;

  .inicio {
    font-size: 10px;
    min-width: 40px;

    .id{
      user-select: none;
      &.novo{
        color: ${cores.verdeEscuro};
        font-size: 12px;
        font-weight: 600;
      }
    }

    img {
      user-select: none;
      border-radius: 50%;
      border: 2px solid black;
      width: 40px;
      min-height: 40px;
      min-width: 40px;
      height: 40px;
      object-fit: cover;
    }
  }

  .centro{
    user-select: none;
    .info {
      flex-grow: 2;
      label {
        font-weight: 600;
        font-size: 15px;
      }

      .tags {
        font-size: 12px;
      }

      .contato {
        font-weight: 600;
        font-size: 13px;
      }

      .bottom-info {
        font-size: 12px;
        font-style: italic;
        span:after {
          content: " | ";
        }

        span:last-child:after {
          content: "";
        }
      }
    }
  }

  .botao {
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 20px;
    padding: 5px 15px;
    cursor: pointer;
    pointer-events: fill;
  }

  @media (max-width: 550px) {
    #lista {
      .cli-li {
        padding: 10px 2px;
        .container {
          .info {
            .endereco {
              font-size: 12px;
            }
            .bottom-info {
              font-size: 10px;
            }
          }
        }
      }
    }
  }
`;
