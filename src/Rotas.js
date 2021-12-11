import React from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from './views/home'
import CadCli from './views/cadastros/clientes'



const Rotas = (props) => {
    // const navigate = useNavigate();
    // navigate('/'+ props.rotaPrinc)
return(
    <Routes>
        
        <Route exact path="/" element={<Navigate to="/home" />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path='/cad/cli' element={<CadCli />} />
    </Routes>
    )
    
}

export default Rotas



