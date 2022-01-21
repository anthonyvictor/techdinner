import React from "react";
import Estilo from './style'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBars } from '@fortawesome/free-solid-svg-icons'
import { useMainMenu } from "../../context/mainMenuContext";

export default function Header(props) {
    const { toggleAtivo } = useMainMenu()
    return(
       <Estilo>
           <FontAwesomeIcon className='hamb icone' icon={faBars} 
           onTouchStart={toggleAtivo}/>

           <h2>TechDinner 1.0</h2>
           
            <div>
                <FontAwesomeIcon className="icone" icon={faBell} />
            </div>
            
       </Estilo>
    )
}

