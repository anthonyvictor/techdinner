import React, { useEffect, useState } from 'react';
import Login from './views/login' 
import { isNEU } from './util/misc';

import { BrowserRouter } from "react-router-dom";
import Rotas from "./Rotas";
import MainMenu from "./components/mainMenu";
import Header from "./components/header";
import styled from "styled-components";

import RotasProvider from "./context/rotasContext";
import MainMenuProvider from "./context/mainMenuContext";
import Globals from "./globals";
import { cores } from './util/cores'
import ApiProvider, { useApi } from './api';

import ContextMenuProvider from "./components/ContextMenu";
import ImageViewerProvider from './components/ImageViewer';
import AskProvider from "./components/Ask";
import MessageProvider from './components/Message';
import { ValuerProvider } from './components/Valuer';
import { PayerProvider } from './views/home/pedido/pagamento/payer';
import { HoraProvider } from './views/home/pedido/rodape/hora';
import { InternetCheckerProvider } from './components/InternetChecker';
import { Refreshing } from './components/refreshing';

// import { QueryClientProvider } from 'react-query';

function App() {
  return (
    <InternetCheckerProvider>
      <MessageProvider>
        <BrowserRouter >
          {/* <QueryClientProvider> */}
            <ApiProvider>
              <App2 />
            </ApiProvider>
          {/* </QueryClientProvider>   */}
        </BrowserRouter >
      </MessageProvider>
    </InternetCheckerProvider>
  )
}

function App2() {

  const {user, isLoading} = useApi()
  const [preLoad, setPreLoad] = useState(true)

  useEffect(() => {
    if(!isLoading) setPreLoad(false)
  }, [isLoading])

  if(isLoading || preLoad) return <Refreshing />

  if(isNEU(user)) return <Login />

  return(
    <Container>
        <HoraProvider>
          <AskProvider>
            <ValuerProvider>
              <ContextMenuProvider>
                <ImageViewerProvider>
                  <PayerProvider>
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
                  </PayerProvider>
                </ImageViewerProvider>
              </ContextMenuProvider>
            </ValuerProvider>
          </AskProvider>
        </HoraProvider>
    </Container>
  ) 
}

export default App;

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh ;
  overflow: hidden;
  /* position: relative; */
  @media print{
        /* :not(.print-area){
          display: none;
        } */
        .print-area{
            display: block;
            position: absolute;
            z-index: 999;
            border: none;
            width: 100%;
            top: 0;
            left: 0;

        }
    }

    @media (max-width: 550px){
      .noMobile{
        display: none;
      }
    }
  
  > .topo-base {
    width: 100% ;
    display: flex;
    flex-direction: column;
    /* position: relative; */
  }

  

  
`;