import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { SearchBar } from "../../../components/SearchBar";
import ImageViewer from "../../../components/ImageViewer";

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
import { useContextMenu } from "../../../context/contextMenuContext";



export default function ListaCli(props) {
  const {setCurrentRoute} = useRotas()
  const {curr, setCurr, lista, setLista} = useCadCli();
  const [search, setSearch] = useState("");
  const { clientes } = useClientes();
  const {contextMenu, fechar} = useContextMenu()
  const [imageView, setImageView] = useState(null);
  const [filtered, setFiltered] = useState([])
  

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
      touch:() => verImagemMobile(cliente), 
      enabled: misc.isNEU(cliente.imagem), visible: true}
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
    console.log('abrir')
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

    if (curr && curr.id === cliente.id) {
      setCurrentRoute(props.tabs[1])
    } else if ((preenchido && window.confirm("Deseja cancelar a edição atual?")) ||
      !preenchido) {
      setCurr(cliente)
      setCurrentRoute(props.tabs[1])
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
      throw new NotImplementedError();
    }
  }

  function openFilter() {}


  function verImagem(cliente) {
    window.open(cliente.imagem);
  }
  function verImagemMobile(cliente) {
    setImageView(
      <ImageViewer
        imagem={cliente.imagem}
        setShowImageViewer={() => {
          setImageView(null);
        }}
        nome={cliente.nome}
      />
    );
  }

  function isPhoneEqual(a){
    return a.contatos.some(c => misc.equals(format.formatPhoneNumber(c), format.formatPhoneNumber(search)))
  }

  function ordem(a,b){
    // if(a.id === search && b.id !== search) return 1
    // if(a.id !== search && b.id === search) return -1

    // // if(isPhoneEqual(a) && !isPhoneEqual(b)) return 1
    // // if(!isPhoneEqual(a) && isPhoneEqual(b)) return -1

    // if(!misc.isNEU(a.ultPedido) && misc.isNEU(b.ultPedido)) return -1
    // if(misc.isNEU(a.ultPedido) && !misc.isNEU(b.ultPedido)) return 1


    // if(a.nome === search && b.nome !== search) return 1
    // if(a.nome !== search && b.nome === search) return -1

    // const da = new Date(a.ultPedido).getTime()
    // const db = new Date(b.ultPedido).getTime()
    // const d = new Date()


    // console.log('pedido a:',Date.parse(a.ultPedido),'   pedido b:',b.ultPedido, a> b)
    // // Date.parse(a.ultPedido) > Date.parse(b.ultPedido)
    // if(Date.parse(a.ultPedido) > Date.parse(b.ultPedido)) return 1
    // if(Date.parse(a.ultPedido) < Date.parse(b.ultPedido)) return -1

    // if(a.valorGasto > b.valorGasto) return 1
    // if(a.valorGasto < b.valorGasto) return -1


    
    if(a.id > b.id) return 1
    if(a.id < b.id) return -1

  }

  useEffect(() => {
    setFiltered(clientes.filter(e => misc.filtro({...e, imagem: ''}, search, true, true)))      
  }, [search])//eslint-disable-line

  useEffect(() => {
    if(filtered){
      setLista(
        filtered.sort(ordem).map((cliente) => (
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
      );
    }
  }, [filtered])//eslint-disable-line


  return (
    <Estilo>
      <SearchBar value={search} setValue={setSearch} filter={openFilter} />

      <ListaProvider fullDataArray={filtered} itemDoubleClick={itemClick} itemRightClick={openContext} >
        <Lista >
          {lista}
        </Lista>
      </ListaProvider>
      {imageView}
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
      &.novo{
        color: ${cores.verdeEscuro};
        font-size: 12px;
        font-weight: 600;
      }
    }

    img {
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
