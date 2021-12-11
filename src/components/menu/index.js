import React, { useState } from 'react'
import {Sidebar} from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBorderAll, faChartPie, faCog, faPizzaSlice, faQuestion, faUser } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../auth'
export default function Menu(props){

    const {user} = useAuth()

    return (
        <Sidebar className={props.ativo == false ? null : 'ativo'}>
            <div className="topo">
                <div className="botao" onClick={props.toggleAtivo}>
                    <FontAwesomeIcon className='icone' icon={faBars}/>
                    <p>Menu</p>
                </div>
                <img src={props.logo} alt="Logo TechDinner" title="Home - TechDinner"/>
                
            </div>

            <div class="meio">
                <div class="botao" name='home' title="Home" onClick={(e) => props.openMenu(this)}>
                    <FontAwesomeIcon className='icone' icon={faBorderAll}/>
                    <p>Pedidos</p>
                </div>
                <div class="botao" name='cad/cli'k title="Cadastros" onClick={props.openMenu}>
                    <FontAwesomeIcon className='icone' icon={faPizzaSlice}/>
                    <p>Cadastros</p>
                </div>
                <div class="botao" name='rel' title="Relatórios" onClick={props.openMenu/*.bind(this)*/}>
                    <FontAwesomeIcon className='icone' icon={faChartPie}/>
                    <p>Relatórios</p>
                </div>
                <div class="botao" name='conf' title="Configurações" onClick={props.openMenu}>
                <FontAwesomeIcon className='icone' icon={faCog}/>
                    <p>Configurações</p>
                </div>
                <div class="botao" name='help' title="Ajuda" onClick={props.openMenu}>
                    <FontAwesomeIcon className='icone' icon={faQuestion}/>
                    <p>Ajuda</p>
                </div>
            </div>

            <div class="rodape">
                <FontAwesomeIcon className='icone' icon={faUser}/>
                <div>
                    <p className='title'>{user.name}</p>
                    <p>{user.enterprise}</p>
                </div>
            </div>

            <span className='fundo' onClick={props.toggleAtivo}>

            </span>
        </Sidebar>
    )
}

