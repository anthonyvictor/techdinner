import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { useContextMenu } from '../../../../../../components/ContextMenu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import * as cores from '../../../../../../util/cores'


export const IngredienteLi = memo(({ingrediente, changeSelected}) => {

    const { contextMenu } = useContextMenu()

    const getClassName = useMemo(() => {
        const tipoAdd = ingrediente.tipoAdd ? ` ${String(ingrediente.tipoAdd).toLocaleLowerCase()}` : ''
        return 'ingrediente' + tipoAdd
    }, [ingrediente])

    function openContextMenuIngr() {
        contextMenu([
            { title: 'Pouco', click: () => checkUncheck('Pouco') },
            { title: 'Bastante', click: () => checkUncheck('Bastante') },
        ])
    }

    function checkUncheck(tipoAdd) {
        if (tipoAdd.toUpperCase() === 'COM' && (ingrediente.tipoAdd || '').toUpperCase() === 'COM') {
            tipoAdd = 'Sem'
        } 
        changeSelected({...ingrediente, tipoAdd: tipoAdd})
    }

  return (
        <Container
        key={ingrediente.id}
        className={getClassName}
        onContextMenu={event => {
            event.preventDefault()
            openContextMenuIngr(ingrediente)
        }}
        onClick={() => checkUncheck('Com')}
    >
        <div className='centro'>
            <label>{ingrediente.nome}</label>
        </div>
        <div className='fim'>
            <button className='option-ingrediente' onClick={() => openContextMenuIngr(ingrediente)}>
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>
        </div>
    </Container>
  )
})


const Container = styled.li`
                border: 1px solid black;
                padding: 5px;
                display: flex;
                align-items: center;
                min-height: 40px;
                cursor: pointer;

                label {
                    pointer-events: none;
                    user-select: none;
                }

                &.com {
                    background-color: ${cores.verde};
                }
                &.pouco {
                    background-color: ${cores.vermelho};
                }
                &.bastante {
                    background-color: ${cores.amarelo};
                }
                &:hover {
                    font-weight: 600;
                }
                .centro {
                    flex-grow: 2;
                }
                .fim {
                    height: 100%;
                    button {
                        height: 100%;
                        width: 60px;
                    }
                }
`
