import React, { useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from './views/home'
import Clientes from './views/cadastros/clientes'
// import createBrowserHistory from 'history'


const Rotas = (props) => {

    const history = useNavigate()
    useEffect(() => {  
        history(props.rotaPrinc)

    },[props.rotaPrinc])


return(
    <Routes> 
        
        <Route exact path="/" element={<Navigate to="/home" />} /> {/*/<Clientes tabInicial={'Cadastro'} />/*/}
        <Route exact path="/home" element={<Home />} />
        <Route exact path='/cad/cli' element={<Clientes tabInicial={'Lista'} />} />
    </Routes>
    )
    
}

export default Rotas



