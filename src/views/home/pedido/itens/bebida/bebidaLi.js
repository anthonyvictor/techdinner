import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faGlassCheers } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { formatLitro, formatReal } from '../../../../../util/Format'
import { join } from '../../../../../util/misc'
import { useContextMenu } from '../../../../../components/ContextMenu'
import { useBebida } from '.'
import { cores } from '../../../../../util/cores'

export const BebidaLi = ({ bebida }) => {
    const { contextMenu } = useContextMenu()
    const {
        ativarDesativar,
        currentSelected,
        setCurrentSelected,
        avancar,
        currentHovered,
        setCurrentHovered,
        currentHoveredRef,
        isHovered,
        isSelected,
        isActive,
        isHoverLocked,
        setIsHoverLocked,
    } = useBebida()

    function openContext() {
        contextMenu([{ title: 'Ativar/Desativar', click: () => ativarDesativar(bebida) }])
    }

    const ImagemOuIcone = () => {
        return (
            <ImagemOuIconeContainer>
                {bebida?.imagem ? (
                    <img src={bebida.imagem} alt='' />
                ) : (
                    <FontAwesomeIcon className='icone' icon={faGlassCheers} />
                )}
            </ImagemOuIconeContainer>
        )
    }

    function getDescricao() {
        let arr = [bebida.nome, bebida.sabor ? bebida.sabor : '', formatLitro(bebida.tamanho)]
        if (join(arr, '').length < 5 || bebida.tipo === 'AGUA')
            arr = [bebida.tipo, bebida.nome, bebida.sabor ?? '', formatLitro(bebida.tamanho)]
        return join(arr, ' ')
    }
    const [clicks, setClicks] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setClicks(0)
        }, 1000)

        if (isActive(bebida)) {
            if (clicks === 2) {
                avancar(bebida)
            } else if (clicks === 1) {
                setCurrentSelected(bebida)
            }
        }

        return () => clearTimeout(timer)
    }, [clicks])

    const [myClassName, setMyClassName] = useState(getClassName())

    useEffect(() => {
        setMyClassName(getClassName())
    }, [currentHovered, currentSelected])

    function getClassName() {
        if (bebida) {
            const hovered = isHovered(bebida) ? ' hovered' : ''
            const selecionado = isSelected(bebida) ? ' selected' : ''
            const clicavel = !isActive(bebida) ? ' inactive' : ''
            return 'bebida' + hovered + selecionado + clicavel
        }
        return 'bebida'
    }

    return (
        <Container
            key={bebida.id}
            ref={isHovered(bebida) ? currentHoveredRef : undefined}
            className={myClassName}
            onMouseEnter={() => !isHoverLocked && setCurrentHovered(bebida)}
            onMouseLeave={() => setIsHoverLocked(false)}
            onClick={() => setClicks(prev => prev + 1)}
            onContextMenu={event => {
                event.preventDefault()
                openContext()
            }}
        >
            <div className='inicio'>
                <ImagemOuIcone />
            </div>

            <div className='centro'>
                <label className='nome'>{getDescricao()}</label>
                <div className='bottom'>
                    <span className='info-secundaria'>
                      <span className='noMobile'>
                        Pre??o: 
                      </span>
                      <span>
                        {formatReal(bebida.valor)}
                      </span>
                    </span>
                    <span className='info-secundaria'>
                      <span className='noMobile'>
                        | Categoria: 
                      </span>
                      <span>
                        {bebida.tipo}
                      </span>
                    </span>
                </div>
            </div>

            <button className='botao' onClick={openContext}>
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>
        </Container>
    )
}

const ImagemOuIconeContainer = styled.div`

        display: flex;
        flex-direction: column;
        width: 40px;
        height: 100%;
        justify-content: center;

        img {
            padding: 2px;
            border-radius: 10%;
            border: 2px solid black;
            flex-grow: 0;
            flex-shrink: 0;
            height: 40px;
            object-fit: scale-down;
            background-color: white;
        }

        .icone {
            font-size: 30px;
            margin: auto;
            width: 100%;
        }

        @media (max-width: 550px){
          width: 30px;

          img{
            height: 30px;
          }
          .icone{
            font-size: 25px;
          }
        }

`

const Container = styled.li`
    user-select: none;
    min-width: 10px;
    display: flex;
    align-items: center;
    padding: 5px;
    gap: 5px;
    border: 1px solid black;
    background-color: ${cores.brancoEscuro};
    flex-basis: 40px;

    &.selected {
        background-color: ${cores.verde};
    }

    &.inactive {
        color: gray;
    }

    * {
        pointer-events: none;
    }

    .ckb {
        pointer-events: fill;
    }

    .inicio {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .centro {
        flex-grow: 2;
    }

    button {
        background-color: transparent;
        border: none;
        outline: none;
        font-size: 20px;
        padding: 5px 15px;
        cursor: pointer;
        pointer-events: fill;
    }

    &.hovered {
        background-color: ${cores.cinzaEscuro};
        * {
            color: white !important;
        }
    }

    .centro {
        .nome {
            font-size: 17px;
            font-weight: 600;
        }
        .bottom {
            * {
                font-size: 13px;
            }
            >*{margin-right: 2px;}

            .info-secundaria{
              *{margin-right: 1px;}
            }
        }
    }

    @media (max-width: 550px) {
        .centro {
            .nome {
                font-size: 12px;
            }
            .bottom {
                * {
                    font-size: 10px;
                }
            }
        }
    }
`
