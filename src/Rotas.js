import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import createBrowserHistory from 'history'

//VIEWS
import Home from "./views/home";
import Clientes from "./views/cadastros/clientes";
import Enderecos from "./views/cadastros/enderecos";

//CONTEXT
import { useRotas } from "./context/rotasContext";

const Rotas = () => {
  const { currentRoute } = useRotas();
  const history = useNavigate();

  useEffect(() => {
    history(currentRoute);
  }, [currentRoute]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Routes>
      <Route exact path="/home" element={<Home />} />

      <Route exact path="/" element={<Navigate to="/home" />} />

      <Route
        exact
        path="/cad/cli/*"
        element={<Clientes />}
      />

      <Route
        exact
        path="/cad/end/endloc/*"
        element={<Enderecos />}
      />
      
    </Routes>
  );
};

export default Rotas;
