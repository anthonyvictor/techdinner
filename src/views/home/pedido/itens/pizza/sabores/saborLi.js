import React, { memo, useState, useMemo, useEffect, useCallback } from 'react'
import { usePizza } from '..'
import { useContextMenu } from '../../../../../../components/ContextMenu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { formatAbrev } from '../../../../../../util/Format'
import * as cores from '../../../../../../util/cores'
import { equals } from '../../../../../../util/misc'
import styled from 'styled-components'

export const SaborLi = ({sabor}) => {
    const { contextMenu } = useContextMenu()
    const { 
        saborHovered, setSaborHovered, saborHoveredRef, 
        checkUncheck, getIsSelected,
        isHoverLocked, setIsHoverLocked,
        replaceSabor, getIngredientesDescritos, saboresSelected,
        ingredientesComponentResult, setIngredientesComponentResult,
        abrirIngredientesComponent, fecharIngredientesComponent, 
        ativarDesativar
    } = usePizza()
    const [myClassName, setMyClassName] = useState(getClassName())

    useEffect(() => {
        if(ingredientesComponentResult && ingredientesComponentResult.saborId === sabor.id){
            confirmarIngredientes()
            setIngredientesComponentResult(null)
        }
    }, [ingredientesComponentResult])

    useEffect(() => {setMyClassName(getClassName())}, [saborHovered, ])

    function isActive (){return saborHovered && equals(saborHovered.id, sabor.id)}

    function getClassName () {
        if (sabor) {
            const ativo = isActive() ? ' ativo' : ''
            const selecionado = getIsSelected(sabor) ? ' selecionado' : ''
            const clicavel = !sabor.ativo ? ' inactive' : ''
            return 'sabor' + ativo + selecionado + clicavel
        }
        return 'sabor'
    }

    function openContext() {
        contextMenu([
            { title: 'Editar', click: () => abrirIngredientesComponent(sabor), enabled: !!sabor.ativo},
            { title: 'Ativar/Desativar', click: () => ativarDesativar(sabor) },
            { title: 'Remover', click: () => checkUncheck(sabor, false), enabled: getIsSelected(sabor) },
        ])
    }

    const confirmarIngredientes = () => {
        const novoSabor = { ...sabor, ingredientes: ingredientesComponentResult.ingredientes }
        if (getIsSelected(sabor)) {
            replaceSabor(sabor, novoSabor)
        } else {
            checkUncheck(novoSabor, true)
        }
        fecharIngredientesComponent()
    }

    const editar = () => {
        if(!!sabor.ativo) abrirIngredientesComponent(sabor)
    }

    return (
        <Container
            ref={isActive() ? saborHoveredRef : undefined}
            key={sabor.id}
            className={myClassName}
            onDoubleClick={() => editar()}
            onMouseEnter={() => !isHoverLocked && setSaborHovered(sabor)}
            onMouseLeave={() => setIsHoverLocked(false)}
            onContextMenu={event => {
                event.preventDefault()
                openContext(sabor)
            }}
        >
            <div className='inicio'>
                <p className='numero'>{sabor.numero}º</p>
                <input
                    type={'checkbox'}
                    defaultChecked={getIsSelected(sabor)}
                    onChange={event => {
                        if (event.target.checked) {
                            checkUncheck(sabor, true)
                            event.target.checked = false
                        } else {
                            checkUncheck(sabor, false)
                        }
                    }}
                ></input>
            </div>
            <div className='centro'>
                <section>
                    <span className='tipo' style={{ color: sabor.tipo.cor }}>
                        {`(${formatAbrev(sabor.tipo.nome)}) `}
                    </span>
                    <span className='nome'>{sabor.nome}</span>
                </section>
                <p className='ingredientes'>{getIngredientesDescritos(sabor)}</p>
            </div>
            <button className='botao' onClick={() => openContext(sabor)}>
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>
        </Container>
    )
}

const Container = styled.li`
        display: flex;
        align-items: center;
        padding: 5px;
        gap: 5px;
        border: 1px solid black;
        background-color: ${cores.brancoEscuro};
        flex-basis: 70px;

        @media (max-width: 550px){
            padding: 2px;
            gap: 2px;
            flex-basis: 60px;
        }

        * {
            pointer-events: none;
        }
        .inicio {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;

            .numero {
                font-size: 10px;
                font-style: italic;
            }
            input {
                pointer-events: all;
                width: 30px;
                height: 30px;
                cursor: pointer;
                @media (max-width: 550px){
                    width: 20px;
                    height: 20px;
                }
            }
        }
        .centro {
            flex-grow: 2;

            span {
                font-weight: 600;
                font-size: 17px;
                
                @media (max-width: 550px){
                    font-size: 13px;

                }
            }
            
            .tipo{
                font-weight: 900;
                font-style: italic;
                -webkit-text-stroke: .3px ${cores.brancoDark};
            }

            .ingredientes {
                font-size: 13px;
                font-weight: 600;
                font-style: italic;
                @media (max-width: 550px){
                    font-size: 9px;
                    font-weight: 300;
                }
            }
        }
        button {
            background-color: transparent;
            border: none;
            outline: none;
            font-size: 20px;
            padding: 5px 15px;
            cursor: pointer;
            pointer-events: fill;

            @media (max-width: 550px){
                font-size: 15px;
                padding: 2px 10px;
            }
        }
        &.ativo {
            background-color: ${cores.cinzaEscuro};
            * {
                color: white;
            }
        }
        &.selecionado {
            background-color: ${cores.verde};
            * {
                color: white;
            }
            &.ativo {
                background-color: lime;
            }
        }
        &.inactive {
            
            input {
                pointer-events: none;
            }
            /* button {
                pointer-events: none;
            }
            * {
                pointer-events: none;
            } */
            * {
                color: gray;
            }
        }
`
