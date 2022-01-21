import React from "react";
import { BrowserRouter } from "react-router-dom";
import Rotas from "./Rotas";
import MainMenu from "./components/mainMenu";
import Header from "./components/header";
import styled from "styled-components";

import RotasProvider from "./context/rotasContext";
import MainMenuProvider from "./context/mainMenuContext";
import Globals from "./globals";

export default function Base() {
  return (
    <Container>
      <RotasProvider>
        <MainMenuProvider>

          <MainMenu className="invisivel" />

          <div className="topo-base">
            <Header />
            <BrowserRouter className="meio">
              <Rotas />
            </BrowserRouter>
            <Globals />
          </div>

        </MainMenuProvider>
      </RotasProvider>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    .topo-base{
        flex-grow: 2;
        width: 100vh;
    }

    @media(max-width: 400px) {
    .topo-base{
        flex-shrink: 10;
    }
  }
`