import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import createBrowserHistory from 'history'

//VIEWS
import Home from "./views/home";
import Clientes from "./views/cadastros/clientes";
import Enderecos from "./views/cadastros/enderecos";
import Pizzas from "./views/cadastros/pizzas";

//CONTEXT
import { useRotas } from "./context/rotasContext";
import Bebidas from "./views/cadastros/bebidas";
import Outros from "./views/cadastros/outros";
import Configuracoes from "./views/configuracoes";


const Rotas = () => {
  const { currentRoute } = useRotas();
  const history = useNavigate();

  useEffect(() => {
    history(currentRoute);
  }, [currentRoute]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Routes>

      <Route 
        exact 
        path="/" 
        element={<Navigate to="/home" />} />

      <Route 
        exact 
        path="/home" 
        element={<Home />} />

      <Route
        exact
        path="/cad/clientes/*"
        element={<Clientes />}
      />

      <Route
        exact
        path="/cad/endloc/*"
        element={<Enderecos />}
      />
      
      <Route
        exact
        path="/cad/pizzas/*"
        element={<Pizzas />}
      />

      <Route
        exact
        path="/cad/bebidas"
        element={<Bebidas />}
      />

      <Route
        exact
        path="/cad/outros"
        element={<Outros />}
      />

      <Route
        exact
        path="/pedido/*"
        element={<Home />}
      />
      
      <Route
        exact
        path="/conf"
        element={<Configuracoes />}
      />
    </Routes>
  );
};

export default Rotas;
