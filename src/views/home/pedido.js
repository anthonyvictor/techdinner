import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as cores from '../../util/cores'
import { useHome } from '../../context/homeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import * as misc from '../../util/misc';
import * as pedidoUtil from '../../util/pedidoUtil'
import * as Format from '../../util/Format';
import { useContextMenu } from '../../context/contextMenuContext';
import CopyView from '../../components/CopyView';
import * as apis from '../../apis'
import * as msg from '../../util/Mensagens'


function Pedido() {
  const {curr, fechar} = useHome()
  const {contextMenu} = useContextMenu()
  const [mob] = useState(misc.isMobile())

  // const [showCopyView, setShowCopyView] = useState(false)

  const boxCliente = useRef()
  const boxEndereco = useRef()
  const boxAplicativo = useRef()
  const boxItens = useRef()
  const boxPagamento = useRef()

function getPedNum(){
  return '1º Pedido'
}

function whatsappMessage(phoneNumber){
  contextMenu([
    {title: 'Confirmações',
     click: () => contextMenu([{title:'tudo'}])
    }
  ])
  if (phoneNumber !== "") {
    apis.sendWhatsAppMessage(`Olá, ${msg.Cumprimento()}`, phoneNumber);
  }
}

function contatoClick(contato){
  contextMenu([
    {title: 'Copiar', 
    click:() => misc.copiar(Format.formatPhoneNumber(contato)), 
    touch:() => {/*setShowCopyView(true)*/}, 
    enabled: true, visible: true},

    {title: 'Mensagem', 
    click:() => whatsappMessage(contato), 
    enabled: true, visible: true},

    {title: 'Ligar', 
    click:() => {}, 
    enabled: true, visible: mob} 
])
}

  return curr
  ? (
    <Container
    corTipo={!misc.isNEU(curr.tipo) ? cores.tipo(curr.tipo) : 'transparent'}>
      {/* {showCopyView && <CopyView />} */}
      <div className='top-container'>
        <div className='id'>
          {curr.id > 0 ? `Pedido #${curr.id}` : 'Pedido Novo!'}
        </div>
        <div className='data'>
          Data: {curr.dataInic && curr.dataInic.toLocaleDateString("pt-br")}
        </div>
        <div className='tipo'>
          <label>Tipo:</label>
          <button className='tipo-botao'
          style={curr.tipo && {backColor: cores.tipo(curr.tipo)}}
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
          <button className='close' onClick={() => fechar(curr)}>
            <FontAwesomeIcon icon={icons.faTimes} />
          </button>
        </div>
      </div>

      <div className='middle-container'>

        <div ref={boxCliente} className='cliente-container box'>
          <div className='top cliente'>
            <label>CLIENTE</label>
            <button onClick={() => boxCliente.current.classList.toggle('collapsed')}>_</button>
          </div>
          <div className='content'>
            <div className='img-id'>
              {curr.cliente && curr.cliente.imagem
              ? <img src={curr.cliente.imagem} />
              : <FontAwesomeIcon className='icon' icon={icons.faUser} />}
              {curr.cliente && curr.cliente.id
              && <p>{curr.cliente.id}</p>}
            </div>
            <div className='info'>
              <div className='top'>
                {curr.cliente && curr.cliente.id
                && <span className='alert'></span>}
                <span className='nome'>{curr.cliente && curr.cliente.nome
                ? curr.cliente.nome
                : 'SEM CLIENTE!'}</span>
              </div>
              <div className='middle'>
                <label className='tags'>{curr.cliente && curr.cliente.tags
                && curr.cliente.tags.join(', ')}</label>
                {curr.cliente && curr.cliente.id
                ? <label className='pedido'>{getPedNum()}</label>
                : curr.cliente.nome
                ? <label className='sem-cadastro'>Sem cadastro!!</label>
                : <label className='sem-cadastro'>Altere o cliente para liberar ações do pedido.</label>}
              </div>
              <div className='contatos-container'>
                <ul className='contatos'>
                  {curr.cliente && curr.cliente.contato
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

        <div ref={boxEndereco} className='endereco-container box'>
        <div className='top endereco'>
            <label>ENDEREÇO</label>
            <button onClick={() => boxEndereco.current.classList.toggle('collapsed')}>_</button>
          </div>
        </div>

        <div ref={boxAplicativo} className='aplicativo-container box hidden'>
        <div className='top aplicativo'>
            <label>APLICATIVO</label>
            <button onClick={() => boxAplicativo.current.classList.toggle('collapsed')}>_</button>
          </div>
        </div>

        <div ref={boxItens} className='itens-container box'>
        <div className='top itens'>
            <label>ITENS</label>
            <button onClick={() => boxItens.current.classList.toggle('collapsed')}>_</button>
          </div>
        </div>

        <div ref={boxPagamento} className='pagamento-container box'>
        <div className='top pagamento'>
            <label>PAGAMENTO</label>
            <button onClick={() => boxPagamento.current.classList.toggle('collapsed')}>_</button>
          </div>
        </div>

      </div>

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
height: calc(100vh - 50px) ;
overflow: hidden;
user-select: none;

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
    .tipo-botao{
      border: none;
      background-color: transparent;
      margin-left: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      padding: 5px;
      /* *{vertical-align: top;} */
      /* width: 50px; */
      cursor: pointer;

      &:hover{
        *{
        color: black;
      }
      }
      *{
        pointer-events: none;
        color: ${props => props.corTipo};
        font-size: 15px;
        font-weight: 600;
      }
    }
  }
  .botoes{
    flex-grow: 0;
    width: 120px;
    display: flex;
    gap: 2px;

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
      label{
        flex-grow: 2;
        text-align: center;
        vertical-align: middle;
        line-height: 30px;
        cursor: pointer;
        &:hover{
          font-size: 17px;
          font-weight: 600;
        }
      }
      button{
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
    min-height: 150px;
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
          padding: 0 10px;
          overflow-x: auto;
          display: flex;
          .contatos{
            gap: 10px;
            flex-shrink: 0;
            flex-grow: 0;
            list-style: none;
            display: flex;
            li{
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
}

.bottom-container{
  border-top: 1px solid black;
  flex-basis: 60px;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: whitesmoke;
  display: flex;
  gap: 10px;
  padding: 5px 10px;

  .bot-button{
    height: 100% ;
    flex-grow: 1;
    border: 2px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
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
`



