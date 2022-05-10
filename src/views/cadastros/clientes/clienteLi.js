import React, { memo } from 'react'
import styled from 'styled-components'
import { sendWhatsAppMessage } from '../../../apis'
import { useImageViewer } from '../../../components/ImageViewer'
import { useMessage } from '../../../components/Message'
import { useCadListaClientes } from '.'
import { useClientes } from '../../../context/clientesContext'
import { formatEndereco, formatPhoneNumber, formatReal } from '../../../util/Format'
import { Cumprimento } from '../../../util/Mensagens'
import { isNEU } from '../../../util/misc'
import { useListaClientes } from './lista'
import { cores } from "../../../util/cores";
import { useContextMenu } from '../../../components/ContextMenu'

const ClienteLi2 = ({ cliente }) => {
    const {edit, select} = useCadListaClientes()
    const { currentHovered, setCurrentHovered, currentHoveredRef } = useListaClientes()
    const { message } = useMessage()
    const { imageView } = useImageViewer()
    const { contextMenu } = useContextMenu()
    const { excluir } = useClientes()

    function handleContextMenu(e) {
        e.preventDefault()
        openContextMenu()
    }

    const c_all = cliente => {
        return `Cliente: ${cliente.nome}
        \nContato: ${cliente.contato.join(', ')}
        \nEndereço: ${formatEndereco(cliente.endereco, false, true)}`
    }

    function openContextMenu() {
        contextMenu([
            { title: 'Editar', click: () => edit(cliente), enabled: true, visible: true },

            { title: 'Copiar', click: () => openContextCopiar(cliente), enabled: true, visible: true },

            { title: 'Mensagem', click: () => openContextMensagem(cliente), enabled: true, visible: true },

            { title: 'Excluir', click: () => handleExcluir(cliente), enabled: true, visible: true },

            { title: 'Ver imagem', click: () => verImagem(), enabled: cliente.imagem, visible: true },
        ])
    }

    function openContextCopiar() {
        contextMenu([
            { title: 'iD', text: cliente.id, enabled: true, visible: true },

            { title: 'Nome', text: cliente.nome, enabled: true, visible: true },

            { title: 'Contato', text: cliente.contato.join(', '), enabled: true, visible: true },

            {
                title: 'Endereço',
                text: formatEndereco(cliente.endereco, true, true),
                enabled: true,
                visible: !!cliente.endereco,
            },

            { title: 'Tudo', text: c_all(cliente), enabled: true, visible: !!cliente.endereco },
        ])
    }

    function whatsappMessage(phoneNumber) {
        if (phoneNumber !== '') {
            sendWhatsAppMessage(`Olá, ${Cumprimento()}`, phoneNumber)
        }
    }

    function openContextMensagem() {
        if (cliente.contato.length > 1) {
            contextMenu(
                cliente.contato.map(e => {
                    return {
                        title: formatPhoneNumber(e, false),
                        click: () => whatsappMessage(e),
                        enabled: true,
                        visible: true,
                    }
                })
            )
        } else {
            whatsappMessage(cliente.contato[0])
        }
    }

    function handleMouseEnter(e) {
        e.preventDefault()
        setCurrentHovered(cliente)
    }
    function handleMouseLeave(e) {
        e.preventDefault()
    }

    async function handleExcluir(cliente) {
        if (cliente.pedidos && Number.parseInt(cliente.pedidos) > 0) {
            message('error', 'Impossível excluir, este cliente já realizou pedidos!')
        } else if (
            window.confirm('Deseja REALMENTE excluir este cliente? Seus dados serão PERMANENTEMENTE apagados.')
        ) {
            try {
                await excluir(cliente)
            } catch (err) {
                console.error(err)
                message('error', 'Ocorreu um erro ao excluir o cliente!')
            }
        }
    }

    function verImagem() {
        imageView({
            title: cliente.nome,
            image: cliente.imagem,
        })
    }

    return (
        <Container
            key={cliente.id}
            className={`cliente${(currentHovered?.id === cliente.id) ? ' hovered' : ''}`}
            onContextMenu={handleContextMenu}
            onDoubleClick={() => select(cliente)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={currentHovered?.id === cliente.id ? currentHoveredRef : undefined}
            >
            <div className='inicio'>
                {cliente.imagem && <img src={cliente.imagem} alt='imagem' onClick={() => verImagem()} />}
                <label className={`id${isNEU(cliente.valorGasto) ? ' novo' : ''}`}>{cliente.id}</label>
            </div>

            <div className='centro'>
                <div className='info'>
                    <label className='nome'>{cliente.nome}</label>
                    <span className='contato'>, {cliente.contato.map(e => formatPhoneNumber(e)).join(', ')}</span>
                    <span className='tags'>{!isNEU(cliente.tags) && ', ' + cliente.tags.join(', ')}</span>

                    <p className='endereco'>{formatEndereco(cliente.endereco, true, true)}</p>

                    <div className='bottom-info'>
                        {cliente.endereco?.taxa > 0 && <span>Taxa: {formatReal(cliente.endereco.taxa)}</span>}

                        {!isNEU(cliente.pedidos) && cliente.pedidos > 0 && <span>Pedidos: {cliente.pedidos}</span>}

                        {!isNEU(cliente.valorGasto) && cliente.valorGasto > 0 && (
                            <span>{formatReal(cliente.valorGasto)}</span>
                        )}

                        {!isNEU(cliente.ultPedido) && <span>Últ. pedido: {cliente.ultPedido}</span>}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export const ClienteLi = memo(ClienteLi2, areEqual)
    
function areEqual(prevProps, nextProps) {
   return (
    prevProps?.cliente?.id === nextProps?.cliente?.id
   )
  }

const Container = styled.li`
      display: flex;
      align-items: center;
      padding: 5px;
      gap: 3px;
      border: 1px solid black;
      background-color: ${cores.brancoEscuro};
      flex-basis: 70px;
      flex-shrink: 1;
      
      * {
          pointer-events: none;
        }
        
        &.hovered {
            background-color: ${cores.cinzaEscuro};
            * {
                color: white !important;
            }
            
            
        }
        
        
        .inicio {
            font-size: 10px;
            min-width: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            
            .id {
                user-select: none;
                &.novo {
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
                height: 40px;
                object-fit: cover;
                background-color: transparent;
                cursor: pointer;
                pointer-events: fill;
            }
        }
        
        .centro {
            user-select: none;
            flex-grow: 2;
            .info {
                flex-grow: 2;
                .nome {
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

                .endereco{
                    font-size: 11px;
                }
                
                .bottom-info {
                    *{font-size: 10px;}
                    font-style: italic;
                    span:after {
                        content: ' | ';
                    }
                    
                    span:last-child:after {
                        content: '';
                    }
                }
            }
        }
        
        @media (max-width: 550px) {
            padding: 3px 2px;
            /* flex-basis: 70px; */
            flex-shrink: 0.6;
            align-items: stretch;
            
            .inicio {
                img {
                    width: 30px;
                    height: 30px;
                }
            }
            
            .centro {
                overflow: hidden;
                .info {
                overflow-x: auto;
                pointer-events: fill;
                margin: 2px 0;
                .nome {
                    font-size: 11px !important;
                }
                .endereco {
                    width: max-content;
                    font-size: 9px;
                    max-height: 10px;
                    line-height: 10px;
                    overflow-x: auto;
                }
                .bottom-info {
                    * {
                        font-size: 9px;
                    }
                }
            }
        }
    }
`
