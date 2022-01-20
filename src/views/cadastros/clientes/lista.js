import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faFilter } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useClientes } from "../../../context/clientesContext";
import { Estilo } from "./listaStyle";
import * as format from "../../../util/Format";
import { copiar as copiarMisc, isNEU, removeAccents } from "../../../util/misc";
import ContextMenu from "../../../components/contextMenu";
import { useCadCli } from "../../../context/cadClientesContext";
import { useTabControl } from "../../../context/tabControlContext";
import CopyView from "../../../components/CopyView";
import ImageViewer from '../../../components/ImageViewer'
import * as apis from '../../../apis' 
import * as msg from '../../../util/Mensagens'

export default function Lista() {
  const { setCurrentTab, tabs } = useTabControl();

  const {
    id,
    setId,
    imagem,
    setImagem,
    nome,
    setNome,
    contato,
    setContato,
    tag,
    setTag,
    contatos,
    setContatos,
    tags,
    setTags,
    endereco,
    setEndereco,
    limpar,
  } = useCadCli();

  useEffect(() => {
    window.onbeforeunload = (e) => {
      e.preventDefault();

      e.returnValue = window.confirm("Deseja realmente sair?");
    };
    window.history.pushState(null, null, document.URL);
    window.onpopstate = (e) => {
      e.preventDefault();
      return (e.returnValue = "Vai se fuder");
    };
  });

  const [search, setSearch] = useState("");

  const { clientes } = useClientes();

  function filtro(txt) {
    let pesqTexto = removeAccents(search)
      .toUpperCase()
      .replace("  ", " ")
      .replace("  ", " ")
      .replace(/[^a-z0-9\,]/gi, "");

    let pesqNumero = pesqTexto.replace(/[^0-9\,]/gi);

    let pesqPhone = format.formatNumber(
      format.formatPhoneNumber(pesqNumero, false)
    );

    let val = txt.toUpperCase().replace(/[^a-z0-9\,]/gi, "");
    return (
      val.includes(pesqTexto) ||
      val.includes(pesqNumero) ||
      (!isNEU(pesqPhone) && val.includes(pesqPhone))
    );
  }

  const [contextMenu, setContextMenu] = useState(null);

  function closeContext(){
    setCurrentContato('')
    setCopyView(null)
    setContextMenu(null)
  }

  function openContext(cliente) {
    setContextMenu(
      <ContextMenu close={() => closeContext()}>
        <li onClick={() => editar(cliente)}>Editar</li>

        <li onClick={() => openContextCopiar(cliente)}>Copiar</li>

        <li onClick={() => openContextMensagem(cliente)}>Mensagem</li>

        <li onClick={() => excluir(cliente)}>Excluir</li>

        <li className={isNEU(cliente.img) && 'disabled'} 
        onClick={() => verImagem(cliente)}
        onTouchStart={(e) => verImagemMobile(e, cliente)}>Ver imagem</li>
      </ContextMenu>
    )}

    function copiar(e, txt){
      if (!isNEU(txt)){
        setContextMenu(null)
        copiarMisc(txt)
      }else{
        alert('Dados inválidos para copiar')
      }
    }

    function copiarMobile(e, txt){
      e.preventDefault()
      if (!isNEU(txt)){
        setCopyView(<CopyView txt={txt} />)
      }else{
        alert('Dados inválidos para copiar')
      }
      
    }

    const [copyView, setCopyView] = useState(null)

    function openContextCopiar(cliente) {
      setContextMenu(
        <ContextMenu close={() => closeContext()}>  
          <li 
          onTouchStart={(e) => copiarMobile(e, cliente.id)}
          onClick={(e) => copiar(e, cliente.id)}
          >iD</li>

          <li 
          onTouchStart={(e) => copiarMobile(e, cliente.nome)}
          onClick={(e) => copiar(e, cliente.nome)}
          >Nome</li>
  
          <li 
          onTouchStart={(e) => copiarMobile(e, cliente.contato.join(', '))}
          onClick={(e) => copiar(e, cliente.contato.join(', '))}
          >Contato</li>
  
          <li 
          onTouchStart={(e) => copiarMobile(e, format.formatEndereco(cliente.endereco,{withTaxa: true, withLocal: true}))}
          onClick={(e) => copiar(e, format.formatEndereco(cliente.endereco,{withTaxa: true, withLocal: true}))}
          className={!cliente.endereco && 'disabled'} 
          >Endereço</li>
        </ContextMenu>
      );
  }

  const [currentContato, setCurrentContato]= useState('')
  useEffect(() => {
    if(currentContato !== ''){
      apis.sendWhatsAppMessage(`Olá, ${msg.Cumprimento()}`, currentContato)
    }
  },[currentContato])

  function openContextMensagem(cliente) {
    setCurrentContato('')
    if(cliente.contato.length > 1){
      setContextMenu(
        <ContextMenu close={() => closeContext()}> 

          {cliente.contato.map(e => (
            <li 
            onClick={() => {setCurrentContato(e)}}
            >{format.formatPhoneNumber(e, false)}</li>
          ))}
        </ContextMenu>
      )
    }else{
       setCurrentContato(cliente.contato[0])
    }
    
  }

  function editar(cliente) {
    setContextMenu(null);

    let preenchido = [id, nome, imagem, contatos.join(), 
      tags.join(), endereco].some((e) => !isNEU(e))

    if (id === cliente.id) {
    
      setCurrentTab(tabs[1].elemento);
    
    } else if ((preenchido 
      && window.confirm("Deseja cancelar a edição atual?"))
      || !preenchido) {

        setId(cliente.id);
        setNome(cliente.nome);
        setImagem(cliente.img);
        setContatos(cliente.contato);
        setTags(cliente.tags);
        setEndereco(cliente.endereco);
        setCurrentTab(tabs[1].elemento);

    }

  }

  function excluir(cliente) {
    setContextMenu(null)
    if(cliente.pedidos && Number.parseInt(cliente.pedidos) > 0){
      alert('Impossível excluir, este cliente já realizou pedidos!')
    }else if(window.confirm('Deseja REALMENTE excluir este cliente? Seus dados serão PERMANENTEMENTE apagados.')){
      throw new Error('Não implementado')
    }
  }

  const [imageView, setImageView] = useState(null)
  function verImagem(cliente){
    setContextMenu(null)
    window.open(cliente.img)
  }
  function verImagemMobile(e, cliente){
    e.preventDefault()
    setContextMenu(null)
    setImageView(<ImageViewer 
      imagem={cliente.img}
      setShowImageViewer={() => {setImageView(null)}}
      nome={cliente.nome} />)
  }


  return (
    <Estilo className="">
      
      <div className="pesquisa">
        <input
          type="text"
          placeholder="Procure um cliente..."
          autoFocus={true}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
        />
        <button className="filtro"
        onClick={()=>{throw new Error('Não implementado')}}>
          <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
        </button>
      </div>

      {clientes &&
        clientes
          .filter((cliente) => search !== ""
              ? filtro(JSON.stringify(cliente))
              : cliente.nome === cliente.nome
          )
          .map((cliente) => (
            <li
              key={cliente.id}
              onContextMenu={(e) => {
                e.preventDefault();
                openContext(cliente);
              }}
            >
              <div className="container">
                <div className="img-id">
                  {cliente.img && <img src={cliente.img} alt="imagem" />}
                  <label className="id">{cliente.id}</label>
                </div>
                <div className="info">
                  <label className="nome">{cliente.nome}</label>
                  <span className="contato">, {cliente.contato.join(", ")}</span>
                  <span className="tags">{!isNEU(cliente.tags) && ', ' + cliente.tags.join(', ')}</span>

                  <p className="endereco">{format.formatEndereco(cliente.endereco,{withLocal: true})}</p>

                  <div className="bottom-info">
                    {cliente.endereco?.taxa > 0 && (
                      <span>Taxa: {format.formatReal(cliente.endereco.taxa)}</span>
                    )}

                    {cliente.pedidos > 0 ? (
                      <span>Pedidos: {cliente.pedidos}</span>
                    ) : (
                      <span>Nenhum pedido</span>
                    )}

                    {cliente.valorGasto > 0 && (
                      <span>{format.formatReal(cliente.valorGasto)}</span>
                    )}

                    {cliente.ultPedido && (
                      <span>Últ. pedido: {cliente.ultPedido}</span>
                    )}
                  </div>
                </div>
                <button className="botao" onClick={(e) => openContext(cliente)}>
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
              </div>
            </li>
          ))}

      {contextMenu}
      {copyView}
      {imageView}

    </Estilo>
  );
}
