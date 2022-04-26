import React, { useState, useEffect, useMemo } from 'react';
import {formatEndereco, formatReal} from "../../../util/Format";
import { isNEU } from "../../../util/misc";
import { enderecoToUrl } from '../../../apis'
import styled from 'styled-components';
import CadEnderecoProvider from "../../../context/cadEnderecosContext";
import EndLocLista from "../enderecos/endlocLista";
import EnderecosProvider from "../../../context/enderecosContext";
import * as cores from "../../../util/cores";
import { useAsk } from "../../../components/Ask";
import { NotImplementedError } from '../../../exceptions/notImplementedError';

// import { Container } from './styles';

function Endereco({endereco, setEndereco, children}) {

    // const memoNumero = () => endereco?.numero ?? '', [endereco?.numero])
    const memoTaxa = useMemo(() => formatReal(endereco?.bairro?.taxa ? endereco.bairro.taxa : 0), [endereco?.bairro?.taxa])
    const memoTemCep = useMemo(() => isNEU(endereco?.cep), [endereco?.cep])
    const memoEnderecoFormatted = useMemo(() => formatEndereco(endereco, false, false), [endereco?.cep])
    // const memoLocal = useMemo(() => endereco?.local ?? '', [endereco?.local])
    // const memoReferencia = useMemo(() => endereco?.referencia ?? '', [endereco?.referencia])

    const {ask} = useAsk()
    const [mapa, setMapa] = useState(null)
    
    useEffect(() => {
        if(!memoTemCep){
            {enderecoToUrl(endereco)
              .then(url => setMapa(
                <div className='mapa'>
                  <div className="mapouter">
                    <div className="gmap_canvas">
                      <iframe title='mapa' id="gmap_canvas"
                        src={`${url}&t=&z=16&ie=UTF8&iwloc=A&output=embed`} 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight="0" 
                        marginWidth="0"
                        align="middle">
                      </iframe>
                    </div>
                  </div>
                </div>
            ))
          .catch((e) => {
              setMapa(null)
              throw new Error(e)
          })} 
          }else{
            setMapa(null)
          }
      },[memoEnderecoFormatted])


    const [selecionado, setSelecionado] = useState({})
    useEffect(() => {
        !isNEU(listaEnd) && closeListaEnd(null)
        if(!isNEU(selecionado)){
        if(([endereco.numero, endereco.local, endereco.referencia].join('') !== '')){
            ask({
            title: 'Substituir antigas informações de local da entrega, e número pelas novas também?',
            buttons: [
                {title: 'SIM', click:() => setEndereco(selecionado)},
                {title: 'NÃO', click:() => setEndereco({logradouro: selecionado.logradouro, taxa: selecionado.taxa})}
            ],
            allowCancel: true
            })
        }else{
            setEndereco(selecionado)
        }
        }
    }, [selecionado]) //eslint-disable-line

    const [listaEnd, setListaEnd] = useState(<></>);
    function closeListaEnd(e){
      if(!e || e.currentTarget === e.target){
        setListaEnd(<></>)
      }
    }
    function openListaEnd() {
        setListaEnd(
          <EndLocListaContainer 
          onClick={(e) => closeListaEnd(e)}>
            <div className="endloc-lista">
              <EnderecosProvider>
                  <CadEnderecoProvider>
                    <EndLocLista itemClick={setSelecionado} />
                  </CadEnderecoProvider>
              </EnderecosProvider>
            </div>
            
          </EndLocListaContainer>
        );
      }

  return (
    <Container id="endereco-container">
        <div id="endereco-left">
        <div id="logradouro-container" className="txt">
            <label htmlFor="logradouro">Logradouro:</label>
            <div className='logradouro-button-container'>
              <label id="logradouro">{memoEnderecoFormatted}</label>
              <button className="logradouro-button"
              type="button"
              onClick={() => {
                openListaEnd();
              }}
              >
              Alterar
              </button>
            </div>
        </div>

        <div id="numero-container" className="txt">
            <label htmlFor="numero">Número:</label>
            <input
            id="numero"
            placeholder="1600"
            disabled={memoTemCep}
            value={endereco?.numero ?? ''}
            onChange={(e) =>
              {
                setEndereco({numero: e.target.value.toUpperCase()})
              }
            }
            onBlur={(e) => {
              e.target.value = e.target.value.trim();
            }}
            />
        </div>

        <div id="local-container" className="txt">
            <label htmlFor="local">Local da entrega:</label>
            <textarea
            disabled={memoTemCep}
            rows={2}
            id="local"
            placeholder="Casa, Edifício, Apartamento, Condomínio, Hospital, Escola..."
            value={endereco?.local ?? ''}
            onChange={(e) =>
              setEndereco({local: e.target.value.toUpperCase()})
            }
            onBlur={(e) => {
              e.target.value = e.target.value.trim();
            }}
            />
            <button disabled
            type="button"
            onClick={(e) => {
              throw new NotImplementedError();
            }}
            >
            Salvar
            </button>
        </div>

        <div id="referencia-container" className="txt">
            <label htmlFor="referencia">Ponto de referência:</label>
            <textarea
            disabled={memoTemCep}
            rows={2}
            id="referencia"
            placeholder="Ao lado de.. Em frente à.."
            value={endereco?.referencia ?? ''}
            onChange={(e) =>
              setEndereco({referencia: e.target.value.toUpperCase()})
            }
            onBlur={(e) => {
              e.target.value = e.target.value.trim();
            }}
            />
        </div>

        {endereco && <label id="taxa">{`Taxa: ${memoTaxa}`}</label>}

        </div>

        <div id="endereco-right">
            {mapa}
        </div>
        {children}
        {listaEnd}
    </Container>
  )
}

export default Endereco;


const Container = styled.section`
    border: 1px solid black;
    padding: 5px;
    display: flex;
    flex-grow: 2;
    gap: 10px;
    min-height: 10px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    overflow: auto;
    width: 100%;

    #endereco-left {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 5px;

      * {
        font-size: 16px;
      }

      div {
        flex-grow: 2;
        height: 40px;
        display: flex;
        align-items: center;
        gap: 5px;
        label {
          display: block;
          width: 100px;
          min-width: 100px;
        }
        input,
        textarea {
          flex-grow: 2;
          flex-shrink: 2;
          height: 100%;
          padding: 5px;
          font-family: sans-serif;
          resize: none;
          border-radius: 5px;
          border: 1px solid gray;
        }
        button {
          width: 70px;
          height: 100%;
          cursor: pointer;
        }
      }

      #logradouro-container {
        width: 100%;
        flex-basis: minmax(max-content, 80px);
        display: flex;
        flex-grow: 0;

        #logradouro {
          border: 1px solid gray;
          height: 40px;
          max-width: 100%;
          flex-grow: 2;
          overflow-y: hidden;
          overflow-x: auto;
          user-select: text;
          background-color: whitesmoke;
          border-radius: 2px;
          display: flex;
          align-items: center;
          line-height: 100%;
        }
        .logradouro-button{
          flex-grow: 0;
          height: 100%;
        }

      }

      #numero-container{
        flex-grow: 0;
      }

      #taxa{
        display: block;
        width: 100% ;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
      }

      @media (max-width: 550px){
        .logradouro-button-container{
        display: flex;
        width: 100%;
        label{
          flex-grow: 1;
        }
      }
      }
    }

    #endereco-right {
      width: 400px;
      display: flex;

        .mapouter{
        width: 100% ;
        height: 100% ;
        overflow: hidden;
        border: 1px solid black;
        border-radius: 10px;
      }
      .gmap_canvas {
        height: 100%;
        overflow:hidden;
        background:none!important;
      }
      iframe{
        height: 100% ;
        width: 100% ;
      }

      }


      @media (max-width: 550px){
    
      border: 1px solid black;
      padding: 5px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: max-content;
      max-height: max-content;

      #endereco-left {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
        height: 100%;

        div {
          display: flex;

          label {
            display: inline-block;
            vertical-align: middle;
            width: 90px;
            min-width: 90px;
            font-size: 10px;
          }
        }

        #logradouro-container {
          width: 100%;
          height: 70px;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;

          #logradouro {
            max-width: 100%;
            height: 100%;
            font-size: 12px;
            /* max-height: 100%; */
          }
        }

        #numero-container{
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;

          input{
            font-size: 12px;
            width: 100%;
          } 
        }

        #local-container,
        #referencia-container {
          height: 100px;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;
          
          button {
            display: none;
          }
        }

        textarea {
          width: 100%;
          font-size: 12px;
        }
      }

      #endereco-right {
        display: none;
        width: 100%;
      }
    
      }
  
`

const EndLocListaContainer = styled.div`
    position: absolute;
    z-index: 999;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.8);
    width: 100% ;
    height: 100% ;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    animation: aparecer .3s ease-out;

    .endloc-lista {
      border-radius: 20px; 
      height: 80%;
      width: min(600px, 90%);
      flex-grow: 0;
      flex-shrink: 0;
      background-color: ${cores.branco};
      padding: 5px;
      border: 2px solid black;
      display: flex;
      flex-direction: column;
      justify-content: stretch;
      > div{
        position: relative;
        height: 100%;
      }
    }


    @media (max-width: 550px){
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      

      .endloc-lista{
        position: relative;
        height: 80%;
        width: 90%;
      }

    }
  
`