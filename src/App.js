import React from 'react';
import Login from './views/login' 
import { useAuth } from './auth'
import { isNEU } from './util/misc';

import { BrowserRouter } from "react-router-dom";
import Rotas from "./Rotas";
import MainMenu from "./components/mainMenu";
import Header from "./components/header";
import styled from "styled-components";

import RotasProvider from "./context/rotasContext";
import MainMenuProvider from "./context/mainMenuContext";
import Globals from "./globals";
import AskProvider from "./context/asksContext";
import ContextMenuProvider from "./context/contextMenuContext";

function App() {

  const {user} = useAuth()

  return(
   !isNEU(user) 
      ? (
        <Container>
        <BrowserRouter >
        <AskProvider>
          <ContextMenuProvider>
            <RotasProvider>
              <MainMenuProvider>
                <MainMenu className="invisivel" />
  
                <div className="topo-base">
                  <Header />
                  <Rotas className="meio" />
                  <Globals />
                </div>
              </MainMenuProvider>
            </RotasProvider>
          </ContextMenuProvider>
        </AskProvider>
        </BrowserRouter>
      </Container>
      ):(
        <Login />
      )
    
  ) 
}

export default App;


const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh ;
  overflow: hidden;
  
  > .topo-base {
    width: 100% ;
    display: flex;
    flex-direction: column;
    
  }

  

  
`;