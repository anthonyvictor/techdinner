import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePedido } from '..';
import CadCliProvider from '../../../../context/cadClientesContext'
import { useHome } from '../../../../context/homeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Lista } from './lista';
import { Cadastro } from './cadastro';
import { join } from '../../../../util/misc';
import { useRotas } from '../../../../context/rotasContext';
import { useContextMenu } from '../../../../components/ContextMenu';
import { SemCadastro } from './semCadastro';
import { useImageViewer } from '../../../../components/ImageViewer';
import { box } from '../box';
import * as cores from '../../../../util/cores'
import styled from 'styled-components';
import { Contato } from './contatoLi';
import ClientesProvider from '../../../../context/clientesContext';
import { useApi } from '../../../../api';

const BoxCLienteContext = createContext()

export const BoxCLiente = () => {
    const [selectBoxClienteCurrentComponent, setSelectBoxCurrentComponent] = useState(null)
    const { mudarCliente } = usePedido()
    const selectBoxClienteRoutes = ['/pedido/clientes/lista','/pedido/clientes/cad']
    const selectBoxClienteComponents = [
        {type: 'lista', component: <Lista mudarTab={mudarTab} routes={selectBoxClienteRoutes} callback={mudarCliente} />}, 
        {type: 'cadastro', component: <Cadastro routes={selectBoxClienteRoutes} callback={mudarCliente} />}
    ] 
    const {setCurrentRoute} = useRotas()
    const { curr, openSelectBox } = useHome() 

    useEffect(() => {
      const tipo = selectBoxClienteCurrentComponent?.type
      const igual = String(tipo).toUpperCase() === 'CADASTRO'
      const currentCli = curr.cliente
      const cli = igual ? currentCli : null

      mudarSelectBox( cli )
      },[selectBoxClienteCurrentComponent])
     
      function mudarSelectBox(cli) {
        if(selectBoxClienteCurrentComponent){
            openSelectBox(
                <ClientesProvider>
                    <CadCliProvider cliente={cli}>
                        <div className='container cliente'>
                            {selectBoxClienteCurrentComponent?.component}
                            <div className='tabs-buttons'>
                                <button onClick={() => setSelectBoxCurrentComponent(selectBoxClienteComponents[0])}>LISTA</button>
                                <button onClick={() => setSelectBoxCurrentComponent(selectBoxClienteComponents[1])}>CADASTRO</button>
                            </div>
                        </div>
                    </CadCliProvider>
                </ClientesProvider>
            )
        }
      }

      function mudarTab(newTab){
        if(newTab === 'cadastro') {
            setCurrentRoute(selectBoxClienteRoutes[1])
            setSelectBoxCurrentComponent(selectBoxClienteComponents[1])
        }
        if(newTab === 'lista') {
            setCurrentRoute(selectBoxClienteRoutes[0])
            setSelectBoxCurrentComponent(selectBoxClienteComponents[0])
        }
      }
    return (
        <BoxCLienteContext.Provider value={{
            selectBoxClienteRoutes, mudarTab
        }}>
            <BoxCliente2 />
        </BoxCLienteContext.Provider>
    )
}

export const useBoxCliente = () => {
    return useContext(BoxCLienteContext)
}

const BoxCliente2 = () => {
    const {curr, openSelectBox} = useHome()
    const { contextMenu } = useContextMenu()
    const {imageView} = useImageViewer()
    const {mudarCliente, getSaboresDescritos} = usePedido()
    const {mudarTab} = useBoxCliente()

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [fixedSize, setFixedSize] = useState('')
    const [myClassName, setMyClassName] = useState(undefined)
    const {getLocalUrl} = useApi()

    useEffect(() => {
        getMyClassName()
    }, [isCollapsed, fixedSize])

    useEffect(() => {
        getFixedSize()
    }, [curr?.cliente])

    const toggleIsCollapsed = () => {
        setIsCollapsed(prev => !prev)
    } 

    const getFixedSize = () => {
        const newSize = curr?.cliente?.id > 0 ? 'big' : ''
        setFixedSize(newSize) 
    }

    function getMyClassName() {
        const base = 'box'
        const collapsed = isCollapsed ? 'collapsed' : ''
        const size = !isCollapsed ? fixedSize : ''
        setMyClassName(join([base, collapsed, size], ' '))
    }

function removerCliente(){
    if(window.confirm('Deseja remover o cliente deste pedido? Informações de endereço também serão removidas.')){
      mudarCliente({})
    }
  }

function openMenu(){
    contextMenu([
      {title: 'Alterar', 
      click:() => openSelectBoxCliente('alterar'),
      enabled: true, visible: true},
  
      {title: 'Editar', 
      click:() => openSelectBoxCliente('editar'), 
      enabled: true, visible: !!curr?.cliente?.id},
  
      {title: 'Remover',
      click:() => removerCliente(), 
      enabled: true, visible: !!curr?.cliente?.nome},
  
      {title: 'Sem cadastro', 
      click:() => openSelectBoxCliente('semcadastro'), 
      enabled: true, visible: true},
  
      {title: 'Fidelidade', 
      click:() => openSelectBoxCliente('fidelidade'), 
      enabled: false, visible: !!curr?.cliente?.id} 
  ])
  }

function openSelectBoxCliente(tipo){
  switch (tipo){
    case 'alterar':
      mudarTab('lista')
      break
    case 'editar':
      mudarTab('cadastro')
      break
    case 'semcadastro':
      openSelectBox(<SemCadastro callback={mudarCliente} />)
      break
  }
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
  
  
  const ImagemOuIcone = () => {

    if(curr?.cliente?.imagem) return <img src={getLocalUrl(curr.cliente.imagem)} alt='' 
    onClick={() => imageView({title: curr.cliente.nome, image: getLocalUrl(curr.cliente.imagem)})} />

    if (curr?.cliente?.nome) return <FontAwesomeIcon className='icon' icon={faUser} />
    
    return <FontAwesomeIcon className='icon' icon={faTimes} />
    
}

function getTags(){
    return curr?.cliente?.tags?.join(', ') || ''
}

    return(
      <Container className={myClassName}>

            <div className='top cliente'>
              <button className='principal' onClick={() => openMenu()}>CLIENTE</button>
              <button className='secondary' onClick={() => toggleIsCollapsed()}>_</button>
            </div>

            <div className='content'>

              <div className='img-id'>
                    <ImagemOuIcone />
                    {curr?.cliente?.id && <p>{curr?.cliente.id}</p>}
              </div>

              <div className='info'>

                <div className='top'>
                  {curr?.cliente?.id
                  && <span className='alert' style={getAlertStyle()}></span>}
                  <span className='nome'>{curr?.cliente?.nome || 'SEM CLIENTE!'}</span>
                </div>

                <div className='middle'>
                  <label className='tags'>{getTags()}</label>

                  {
                    curr?.cliente?.id
                    ? <label className='pedido'>{curr?.numero + 'º pedido'}</label>
                    : curr?.cliente?.nome
                    ? <label className='sem-cadastro'>Sem cadastro!!</label>
                    : <label className='sem-cliente'>Altere o cliente para liberar ações do pedido.</label>
                  }

                </div>

                <div className='contatos-container'>
                  <ul className='contatos'>
                      {curr?.cliente?.contato?.map(contato => <Contato key={contato} contato={contato} />)}
                  </ul>
                </div>

              </div>

            </div>
          </Container>
    )
  }


const Container = styled(box)`
min-height: 120px;

&.big:not(.collapsed) {
    min-height: 140px;
}

  >.top{background-color: ${cores.vermelho}}
    
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
`