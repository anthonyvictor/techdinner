import React, { createContext, useContext, useEffect, useState } from 'react'
import { formatEndereco, formatCEP, formatReal } from '../../../../util/Format'
import { isNEU, join } from '../../../../util/misc'
import { useContextMenu } from '../../../../components/ContextMenu'
import { Entregadores } from './entregadores'
import { Endereco } from './endereco'
import { Mapa } from './mapa'
import { useHome } from '../../../../context/homeContext'
import { box } from '../box'
import * as cores from '../../../../util/cores'
import { usePedido } from "..";
import styled from 'styled-components'

const BoxEnderecoContext = createContext()

export const BoxEndereco = () => {
    const [showMapa, setShowMapa] = useState(false)
    const {curr} = useHome()

    if(curr?.tipo === 'ENTREGA') return (
        <BoxEnderecoContext.Provider value={{
            showMapa, setShowMapa
        }}>
            <BoxEndereco2 />
        </BoxEnderecoContext.Provider>

    )
    return (<></>)
}

export const useBoxEndereco = () => {
    return useContext(BoxEnderecoContext)
}

const BoxEndereco2 = () => {
    const { mudarEndereco, mudarTaxa, mudarEntregador } = usePedido()
    const {curr, entregadorPadrao, openSelectBox} = useHome()
    const { contextMenu } = useContextMenu()
    const [taxaDiferente, setTaxaDiferente] = useState(false)
    const [entegadorDiferente, setEntregadorDiferente] = useState(false)
    const {showMapa} = useBoxEndereco()

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [fixedSize, setFixedSize] = useState('')
    const [myClassName, setMyClassName] = useState(undefined)

    useEffect(() => {
        getMyClassName()
    }, [isCollapsed, fixedSize])

    useEffect(() => {
        getFixedSize()
    }, [showMapa])

    useEffect(() => {
        getTaxaDiferente()
    }, [curr?.endereco?.taxa])

    useEffect(() => {
        getEntregadorDiferente()
    }, [curr?.endereco?.entregador])

    const toggleIsCollapsed = () => {
        setIsCollapsed(prev => !prev)
    } 

    const getFixedSize = () => {
        const newSize = showMapa ? 'superlarge' : ''
        setFixedSize(newSize) 
    }

    function getMyClassName() {
        const base = 'box'
        const collapsed = isCollapsed ? 'collapsed' : ''
        const size = !isCollapsed ? fixedSize : ''
        setMyClassName(join([base, collapsed, size], ' '))
    }

    const getTaxaDiferente = () => {
        setTaxaDiferente(curr?.endereco?.taxa !== curr?.endereco?.bairro?.taxa)
    }

    const getEntregadorDiferente = () => {
        setEntregadorDiferente(entregadorPadrao && curr?.endereco?.entregador?.id !== entregadorPadrao.id)
    }

    const getNumero = (withPrefix = false) => {
        return isNEU(curr?.endereco.local) && !isNEU(curr?.endereco.numero) 
        ? `${withPrefix ? 'nº ' : ''}${curr?.endereco.numero}` : ''
    }

    const getTextoFormatado = obj => {
        return formatEndereco(obj, false, true, false)
    }

    function openPromptTaxa(){
        const resposta = window.prompt('Digite o valor da taxa de entrega', curr?.endereco?.taxa)
        if (isNaN(Number(resposta)) || resposta < 0) {
            window.confirm('Valor inválido, Digitar novamente?') && openPromptTaxa()
        } else if (!isNEU(resposta)) {
            mudarTaxa(resposta)
        }
    }

    function openMenu() {
        contextMenu([
            {
                title: 'Endereço',
                click: () => openSelectBoxEndereco(),
            },
            {
                title: 'Taxa de entrega',
                click: () => openPromptTaxa(),
                visible: !!curr?.endereco?.cep,
            },
            {
                title: 'Entregador',
                click: () => openSelectBoxEntregador(),
                visible: !!curr?.endereco?.cep,
            },
        ])
    }

    function openSelectBoxEndereco() {
        openSelectBox(<Endereco callback={mudarEndereco} />)
    }    

    function openSelectBoxEntregador() {
        openSelectBox(<Entregadores callback={mudarEntregador} />)
    }

    if (curr?.tipo === 'ENTREGA')
        return (
            <Container className={myClassName}>

                <div className='top endereco'>
                    <button className='principal' onClick={() => openMenu()}>ENDEREÇO</button>
                    <button className='secondary' onClick={() => toggleIsCollapsed()}>_</button>
                </div>

                    {curr?.endereco && (
                        <div className='content'>
                            <div className='info'>
                                <div className='top'>
                                    <strong>
                                        {getTextoFormatado({
                                            local: curr?.endereco.local,
                                            numero: getNumero(),
                                        })}
                                    </strong>

                                    <label className={`${isNEU(curr?.endereco.local) ? 'large' : undefined}`}>
                                        {formatEndereco(curr?.endereco, false, false, false)}
                                    </label>

                                    <h5>
                                        {getTextoFormatado({
                                            numero: getNumero(true),
                                            referencia: curr?.endereco.referencia,
                                        })}
                                    </h5>

                                    <div className='bottom'>
                                        <p>Cep: {formatCEP(curr?.endereco.cep)}</p>
                                    </div>
                                </div>

                                <div className='bottom'>
                                    <label
                                        className={taxaDiferente ? 'alert' : undefined}
                                        title={taxaDiferente ? 'Taxa atual diferente da original!' : ''}
                                    >
                                        Taxa: {formatReal(curr?.endereco.taxa)}
                                    </label>

                                    <label
                                        className={entegadorDiferente ? 'alert' : undefined}
                                        title={entegadorDiferente ? 'Entregador diferente do padrão!' : ''}
                                    >
                                        Entregador: {curr?.endereco.entregador.nome}
                                    </label>
                                </div>
                            </div>
                            <Mapa />
                        </div>
                    )}
          </Container>
        )

    return null
}

const Container = styled(box)`

>.top{background-color: ${cores.azul}}
    

        &.large:not(.collapsed) {
            min-height: 400px;
        }

        &:not(.collapsed) {
            .content {
                .info {
                    flex-grow: 2;
                }
            }
        }

        .content {
            flex-grow: 2;
            padding: 5px;
            display: flex;
            flex-direction: column;
            gap: 5px;

            .info {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .top {
                    margin: auto 0;
                    flex-direction: column;
                    flex-grow: 0;
                    flex-shrink: 0;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    overflow: auto;
                    max-height: 80px;
                    > * {
                        display: block;
                        text-align: middle;
                        margin-top: auto;
                        margin-bottom: auto;
                    }
                    strong {
                        margin-top: auto;
                        font-size: 16px;
                    }
                    label {
                        font-size: 13px;
                        &.large {
                            font-size: 18px;
                        }
                    }
                    p {
                        text-align: center;
                        margin: 0 auto;
                        font-size: 12px;
                    }
                    @media (max-width: 550px) {
                        strong {
                            font-size: 13px;
                        }
                        label {
                            font-size: 12px;
                        }
                        p {
                            font-size: 11px;
                        }
                    }
                }
                .bottom {
                    display: flex;
                    justify-content: space-between;
                    > label {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 10px;
                        height: 30px;
                        padding: 0 10px;
                        background-color: transparent;
                        border: none;
                        font-size: 15px;

                        &.alert {
                            color: red;
                            font-weight: 600;
                            pointer-events: fill;
                        }
                    }
                }
            }
        }
    
`
