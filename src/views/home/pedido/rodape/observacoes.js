import React, { useState } from 'react'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { usePedido } from '..'
import { useHome } from '../../../../context/homeContext'
import { useContextMenu } from '../../../../components/ContextMenu'
import { join } from '../../../../util/misc'
import { useHora } from './hora'

export const Observacoes = () => {
    const { curr } = useHome()
    const {mudarObservacoes} = usePedido()
    const {contextMenu} = useContextMenu()
    const {hora} = useHora()

    function openObservacoes(){
        const resp = window.prompt('Digite a observação do pedido', curr.observacoes ?? '')
        resp !== null && resp !== curr.observacoes && mudarObservacoes(resp)
    }

    function add(e){
        mudarObservacoes(join([curr.observacoes, e], ', '))
    }

    function openMenuOpcoes(){
        contextMenu([
            {title: 'Mandar..', click: openMenuOpcoesMandar},
            {title: 'Para às..', click: openMenuOpcoesParaAs},
            {title: 'Avisos..', click: openMenuOpcoesAvisar},
        ])
    }

    function openMenuOpcoesMandar(){
        const opcoes = ['Cartão fidelidade', 'Condimentos', 'Guardanapos']
        .map(e => { return {title: e, click: () => add(`MANDAR ${e}`)} })
        contextMenu(opcoes)
    }

    async function openMenuOpcoesParaAs(){
        const h = await hora(new Date())
        if(h) add(`PARA ÀS ${h}`)
    }

    function openMenuOpcoesAvisar(){
        contextMenu([
            {title: 'Pedido pronto', 
            click: () => add('Avisar quando o pedido estiver pronto')},
            {title: 'Saiu para entrega', 
            click: () => add('Avisar quando sair para entrega')},
            {title: 'Em preparo..', 
            click: () => add('Avisar quando estiver em preparo')},
            {title: 'Próximo de sair', 
            click: () => add('Avisar quando estiver próximo de sair')},
            {title: 'Aguardar ordem', 
            click: () => add('Aguardar o cliente autorizar o preparo')},
        ])
    }

    return (
        <ObservacoesContainer collapsed={!curr.observacoes}>
            <button className={`opcoes`} onClick={openMenuOpcoes}>
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            <button
                type='button'
                className={`observacoes-container`}
                onClick={() => openObservacoes()}
            >
                <label>Observações:</label>
                <p className='observacoes'>{curr.observacoes ? curr.observacoes : 'Adicionar observação.'}</p>
            </button>
        </ObservacoesContainer>
    )
}

const ObservacoesContainer = styled.div`
        display: flex;
        padding: 3px;
        border-top: 1px solid black;
        gap: 5px;
        height: 80px;
        background-color: whitesmoke;
        align-items: center;
        padding: 0 10px;

        .opcoes{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid red;
            vertical-align: center;
            cursor: pointer;
            flex-shrink: 0;
            flex-grow: 0;
        }

        .observacoes-container{
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: none;
            gap: 5px;
            height: 100%;
            overflow: auto;
            cursor: pointer;
            font-weight: 600;
            color: red;
            padding: 2px 0;
            background-color: transparent;

            * {
                width: 100%;
                pointer-events: none;
                text-align: center;
            }
            &:hover {
                color: darkblue;
                font-weight: 600;
            }
            label {
                font-size: 10px;
            }
            .observacoes {
                margin: auto 0;
                font-size: 14px;
                background-color: transparent;
                
                @media (max-width: 550px) {
                    font-size: 12px;
                }
            }
    }

    ${props => !props?.collapsed}{
            height: 65px;
            .opcoes{
                border: 1px solid black;
            }
            .observacoes-container{
                color: black;
                font-weight: normal;
            }
        }   
`
