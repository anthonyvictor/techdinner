import React, { useRef, useState } from 'react'
import {Sidebar} from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBorderAll, faChartPie, faCog, faPizzaSlice, faQuestion, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'

import { useMainMenu } from '../../context/mainMenuContext'

import SubMenu from './subMenu'
import { useApi } from '../../api'

export default function MainMenu(){
    const {user} = useApi()
    const {ativo, logo, toggleAtivo, changeRoute} = useMainMenu()
    const sidebarRef = useRef()

    const [subMenu, setSubMenu] = useState(null)
    function openSubMenu(e){
        let arr = null
        let nome = e.target.getAttribute('name')

            if(subMenu){
                if(subMenu.props.arr.nome === nome){
                    setSubMenu(null)
                    return
                }
            }
    

        switch(nome){
            case 'cad':
                arr = {
                    nome: nome, views: [
                    {titulo: 'Clientes', link: '/cad/clientes/lista'},
                    {titulo: 'Endereços', link: '/cad/endloc/lista'},
                    {titulo: 'Pizzas', link: '/cad/pizzas/sabores'},
                    {titulo: 'Bebidas', link: '/cad/bebidas'},
                    {titulo: 'Outros', link: '/cad/outros'}
                ]}
                break
            default:
                arr = null
                break
        }

        setSubMenu(
            <SubMenu posi={{...sidebarRef.current.getBoundingClientRect(), 
                top: e.target.getBoundingClientRect().top + 20,
                left: e.target.getBoundingClientRect().right + 
                e.target.getBoundingClientRect().left }} 
                arr={arr}
                setSubMenu={setSubMenu} />
        )
    }

    function openView(e){
        setSubMenu(null)
        changeRoute(e.target.getAttribute('name'))
    }

    function sair(e){
        if(e.target == e.currentTarget){
            if(window.confirm('Deseja realmente sair?')){
                localStorage.setItem('user',null)
                localStorage.setItem('password',null)
                window.location.reload()
            }
        }
    }

    return (
        <Sidebar ref={sidebarRef} className={ativo ? 'ativo' : undefined}>
            <div className="topo">

                <div className="botao" onClick={e => {
                    setSubMenu(null)
                    toggleAtivo(e)
                }}>
                    <FontAwesomeIcon className='icone' icon={faBars}/>
                    <p>Menu</p>
                </div>

                <img src={logo} 
                alt="Logo TechDinner" 
                title="Home - TechDinner"
                onClick={() => window.location.reload()}/>
                
            </div>

            <div className="meio">

                <div className="botao" name='home' title="Home" 
                onClick={e => openView(e)}>
                    <FontAwesomeIcon className='icone' icon={faBorderAll}/>
                    <p>Pedidos</p>
                </div>
                
                <div className="botao" name='cad' title="Cadastros" 
                onClick={(e) => openSubMenu(e)}>
                    <FontAwesomeIcon className='icone' icon={faPizzaSlice}/>
                    <p>Cadastros</p>
                </div>

                {/* changeRoute/*.bind(this) */}
                <div className="botao" name='rel' title="Relatórios" 
                onClick={e => openView(e)}>
                    <FontAwesomeIcon className='icone' icon={faChartPie}/>
                    <p>Relatórios</p>
                </div>

                <div className="botao" name='conf' title="Configurações" 
                onClick={e => openView(e)}>
                <FontAwesomeIcon className='icone' icon={faCog}/>
                    <p>Configurações</p>
                </div>

                <div className="botao" name='help' title="Ajuda" 
                onClick={changeRoute}>
                    <FontAwesomeIcon className='icone' icon={faQuestion}/>
                    <p>Ajuda</p>
                </div>

            </div>

            <div className="rodape">
                <FontAwesomeIcon className='icone' icon={faUser}/>
                <div>
                    <p className='title'>{user.name}</p>
                    <p>{user?.enterprise?.name}</p>
                </div>
                <button className='sair' onClick={sair}>
                    <FontAwesomeIcon className='icone icone-sair' icon={faSignOutAlt} />
                </button>
            </div>

            <span className='fundo' onClick={toggleAtivo}>

            </span>
            {subMenu}
        </Sidebar>
    )
}

