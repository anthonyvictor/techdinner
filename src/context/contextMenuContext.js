import React, { createContext, useContext, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';
import * as cores from '../util/cores'

const ContextMenuContext = createContext()

function ContextMenuProvider({children}) {
    const [obj, setObj] = useState(null)
    const [component, setComponent] = useState(null)

    function fechar(e){
        if(e === true || e.target === e.currentTarget){
            setComponent(null);
            setObj(null)
        }
    }

    /**
     * 
     * @param {object} obj 
     * Objeto precisa ser um array contendo objetos com: 
     * {title: 'Nome do botão', 
     * click: função que o botão executará,
     * enabled: se estará clicável,
     * visible: se estará visível}
     */
    function contextMenu(_obj, event=null){
        if(event){event.preventDefault()}
        setObj(_obj)
    }

    useEffect(() => {
            setComponent(obj ? <ContextMenu /> : null);
    }, [obj])
    return (
        <ContextMenuContext.Provider value={{obj, contextMenu, fechar}}>
            {children}
            {component}
        </ContextMenuContext.Provider>
    )
}

export default ContextMenuProvider;

export const useContextMenu = () => {
    return useContext(ContextMenuContext)
}


function ContextMenu() {

    const {obj, fechar} = useContextMenu()
    function itemClick(e){
        fechar(true);
        e.click();
    }

    function itemTouch(event, e){
        if(e.touch){
            event.preventDefault()
            fechar(true)
            e.touch();
        }
    }

    function getClassName(e){
        const visible = (e.visible === false) ? 'hidden' : null
        const enabled = (e.enabled === false) ? 'disabled' : null
        return [visible,enabled].filter(i => i !== null).join(' ')  ?? undefined
    }

    return (
      <Container onMouseDown={fechar}>
        <div className="context-menu-container">
            
            <p className='titulo'>Menu</p>

            <div className="botoes">
                {obj.map((e, i) => 
                !e.text 
                    ? <button key={i} className={getClassName(e)}
                onClick={() => itemClick(e)}
                onTouchStart={(event) => itemTouch(event, e)}
                >{e.title}</button>
                : <CopyToClipboard key={i} text={e.text} onCopy={() => fechar(true)} >
                    <button className={getClassName(e)}>{e.title}</button>
                </CopyToClipboard>
                )}
            </div>

          <p className="rodape">TechDinner - Sistema de pedidos</p>
        </div>
      </Container>
    );
      
  }

const Container = styled.div`
    width: 100vw;
    height: 100%;
    position: absolute;
    z-index: 999;
    background-color: rgba(0,0,0,.6);
    display: flex;
    justify-content: center;
    align-items: center;

    @keyframes aparecer{
        from{opacity: 0}
        to{opacity: 1}
    } 

    .context-menu-container{
        width: min(80vw, 400px);
        min-height: 200px;
        max-height: 80vh;
        display: flex;
        align-items: center;
        flex-direction: column;
        background-color: ${cores.branco};
        padding: 10px 20px;
        border-radius: 20px;
        box-shadow: 2px 2px 10px rgba(0,0,0,.8);
        animation: aparecer .2s linear;
        gap: 5px;
        user-select: none;

        .titulo{
            display: block;
            width: 100% ;
            text-align: center; 
            align-items: center;
            color: gray;
        }

        .botoes{
            display: flex;
            flex-direction: column;
            width: 100% ;
            list-style: none;
            gap: 5px;
            margin-bottom: 10px;
            
            button{
                height: 50px;
                flex-grow: 2;
                background-color: ${cores.cinzaEscuro};
                color: white;
                outline: none;
                border: 1px solid black;
                border-radius: 5px;
                font-size: 18px;

                &.hidden{
                    display: none;
                }

                &.disabled{
                    pointer-events: none;
                    background-color: ${cores.cinza};
                }

                &:not(.disabled):hover {
                    color: ${cores.amarelo};
                    cursor: pointer;
                }
            }
        }

        .rodape{
            width: 100% ;
            padding: 10px;
            border-top: 1px solid gray;
            text-align: center;
            font-size: 10px;
            color: gray;
            padding: 0 10px;
        }
    }
`