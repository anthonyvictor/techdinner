import React from "react";
import Estilo from './style'
import Global from '../../globals'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBars } from '@fortawesome/free-solid-svg-icons'

export default function Header(props) {
    return(
       <Estilo>
           <FontAwesomeIcon className='hamb icone' icon={faBars} onTouchStart={props.toggleAtivo}/>
           <h2>TechDinner 1.0</h2>
            <div>
                <FontAwesomeIcon className="icone" icon={faBell} />
            </div>
       <Global />
       </Estilo>
    )
}

