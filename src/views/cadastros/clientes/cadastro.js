import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Tagger from "../../../components/Tagger";
import * as cores from "../../../util/cores";
// import Mapa from "../../../components/Mapa";

import PictureBox from "../../../components/PictureBox";
import * as Format from "../../../util/Format";
import { isNEU } from "../../../util/misc";
import { useCadCli } from "../../../context/cadClientesContext";
import { NotImplementedError } from "../../../exceptions/notImplementedError";
import CadEnderecoProvider from "../../../context/cadEnderecosContext";
import EndLocLista from "../enderecos/endlocLista";
import EnderecosProvider, { useEnderecos } from "../../../context/enderecosContext";
import LocaisProvider from "../../../context/locaisContext";
import { useClientes } from "../../../context/clientesContext";
import { useAsk } from "../../../context/asksContext";
import { useContextMenu } from "../../../context/contextMenuContext";

export default function Cadastro() {
  const [contato, setContato] = useState('')
  const [tag, setTag] = useState('')
  const {curr, setCurr, limpar} = useCadCli()
  
  const {ask} = useAsk()

  const {clientes} = useClientes()

  function salvar() {
    throw new NotImplementedError();
  }

  const [listaEnd, setListaEnd] = useState(<></>);
  function closeListaEnd(e){
    if(!e || e.currentTarget === e.target){
      setListaEnd(<></>)
    }
  }

  const [selecionado, setSelecionado] = useState({})

  useEffect(() => {
    !isNEU(listaEnd) && closeListaEnd(null)
    if(!isNEU(selecionado)){
      ask({
        title: 'Substituir antigas informações de local da entrega, e número pelas novas também?',
        buttons: [
          {title: 'SIM', click:() => setCurr({...curr, endereco: selecionado})},
          {title: 'NÃO', click:() => setCurr({...curr, endereco: {...curr.endereco, logradouro: selecionado.logradouro, taxa: selecionado.taxa}})}
        ],
        allowCancel: true
      })
    }
  }, [selecionado]) //eslint-disable-line

  function openListaEnd() {
    setListaEnd(
      <div className="endloc-container"
      onClick={(e) => closeListaEnd(e)}>
        <div className="endloc-lista">
          <EnderecosProvider>
            <LocaisProvider>
              <CadEnderecoProvider>
                <EndLocLista itemClick={setSelecionado} />
              </CadEnderecoProvider>
            </LocaisProvider>
          </EnderecosProvider>
        </div>
      </div>
    );
  }

  function checarCttExiste(txt){
    const jatem = clientes.filter(e => e.contato.some(x => Format.formatPhoneNumber(x) === Format.formatPhoneNumber(txt)))
    if(jatem.length > 0){
      alert(`Este número está vinculado a: (${jatem[0].id}) ${jatem[0].nome}`)
      return false
    }else{
      return true
    }
  }

  return (
    <Estilo>
      {listaEnd}
      <div id="top-container">
        <div className="picturebox-container">
          <PictureBox imagem={curr.imagem} nome={curr.nome}
          setImagem={(e) => setCurr({...curr, imagem: e})}  />  
        </div>

        <div className="id-nome">
          <label>{curr.id > 0 ? `Id: ${curr.id}` : "Cliente Novo!"}</label>
          <div className="txt nome-section">
            <label htmlFor="nome">Nome:</label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoFocus
              value={curr.nome}
              onChange={(e) => setCurr({...curr, nome: e.target.value})}
              onBlur={(e) => {
                e.target.value = e.target.value.trim();
              }}
            />
          </div>
        </div>
      </div>

      <div id="tags-container">
        <Tagger
          tipo="tel"
          label={"Contato"}
          state={contato}
          setState={setContato}
          array={curr.contatos ? curr.contatos : []}
          setArray={e => setCurr({...curr, contatos: e})}
          validate={checarCttExiste}
        />

        <Tagger
          label={"Apelidos"}
          state={tag}
          setState={setTag}
          array={curr.tags ? curr.tags : []}
          setArray={e => setCurr({...curr, tags: e})}
        />
      </div>

      <section id="endereco-container">
        <div id="endereco-left">
          <div id="logradouro-container" className="txt">
            <label htmlFor="logradouro">Logradouro:</label>
            <label id="logradouro">
              {Format.formatEndereco(curr.endereco, false, false)}
            </label>
            <button
              type="button"
              onClick={() => {
                openListaEnd();
              }}
            >
              Alterar
            </button>
          </div>

          <div id="numero-container" className="txt">
            <label htmlFor="numero">Número:</label>
            <input
              id="numero"
              placeholder="1600"
              value={isNEU(curr.endereco) ? "" : curr.endereco.numero ?? ''}
              onChange={(e) =>
                setCurr({...curr, endereco: { ...curr.endereco, numero: e.target.value }})
              }
              onBlur={(e) => {
                e.target.value = e.target.value.trim();
              }}
            />
          </div>

          <div id="local-container" className="txt">
            <label htmlFor="local">Local da entrega:</label>
            <textarea
              rows={2}
              id="local"
              placeholder="Casa, Edifício, Apartamento, Condomínio, Hospital, Escola..."
              value={isNEU(curr.endereco) ? "" : curr.endereco.local ?? ''}
              onChange={(e) =>
                setCurr({...curr, endereco: { ...curr.endereco, local: e.target.value }})
              }
              onBlur={(e) => {
                e.target.value = e.target.value.trim();
              }}
            />
            <button
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
              rows={2}
              id="referencia"
              placeholder="Ao lado de.. Em frente à.."
              value={isNEU(curr.endereco) ? "" : curr.endereco.referencia ?? ''}
              onChange={(e) =>
                setCurr({ ...curr, endereco: {...curr.endereco, referencia: e.target.value }})
              }
              onBlur={(e) => {
                e.target.value = e.target.value.trim();
              }}
            />
          </div>

          {curr.endereco && <label id="taxa">{`Taxa: ${Format.formatReal(curr.endereco.taxa ? curr.endereco.taxa : 0)}`}</label>}

        </div>

        <div id="endereco-right">{/* <Mapa endereco={endereco} /> */}</div>
      </section>

      <section id="bottom-container">
        <button id="salvar" type="button" onClick={() => salvar()}>
          Salvar
        </button>
        <button id="limpar" type="button" onClick={() => limpar(true)}>
          Limpar
        </button>
      </section>

      
    </Estilo>
  );
}

const Principal = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 5px;
  overflow-y: auto;
  position: relative;
  width: 100% ;

  @keyframes aparecer{
    from{opacity: 0}
    to{opacity: 1}
  }

  .endloc-container {
    position: absolute;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.8);
    width: 100% ;
    height: 100% ;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    animation: aparecer .3s ease-out;

    .endloc-lista {
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
  }

  #top-container {
    display: flex;
    width: 100%;
    flex-basis: 120px;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 5px;
    gap: 5px;
    height: 120px;

    .picturebox-container{
      width: 150px;
      height: 100% ;
      flex-grow: 0;
      flex-shrink: 0;
    }

    .id-nome {
      flex-grow: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 15px;

      .txt {
        display: flex;
        user-select: none;

        gap: 5px;

        * {
          font-size: 16px;
        }

        input {
          flex-grow: 2;
        }
      }

      label {
        user-select: none;
      }

      .nome-section {
        height: 50px;
        width: 100%;
        flex-direction: column;
        gap: 2px;
      }
    }
  }

  #tags-container {
    display: flex;
    justify-content: stretch;
    gap: 20px;
    height: auto;

    .Tagger {
      width: 50%;
    }
  }

  #endereco-container {
    border: 1px solid black;
    padding: 5px;
    display: flex;
    gap: 10px;
    max-height: 220px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);

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
          padding: 5px 0;
          font-family: sans-serif;
          resize: none;
        }
        button {
          width: 70px;
          height: 100%;
          cursor: pointer;
        }
      }

      #logradouro-container {
        width: 100%;
        flex-basis: 90px;
        display: flex;

        #logradouro {
          border-bottom: 1px solid black;
          max-width: 100%;
          flex-grow: 2;
          overflow-y: auto;
          user-select: text;
        }
      }

      #taxa{
        display: block;
        width: 100% ;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
      }
    }

    #endereco-right {
      display: none;
      width: 400px;
    }
  }

  #bottom-container {
    display: flex;
    height: 60px;
    gap: 30px;
    padding: 6px;
    flex-grow: 1;
    flex-shrink: 0;
    button {
      font-size: 20px;
      cursor: pointer;
      outline: none;
      border: 1.5px solid black;
    }
    #salvar {
      flex-grow: 3;
      background-color: ${cores.verde};
    }
    #limpar {
      flex-grow: 1;
      background-color: ${cores.vermelho};
    }
  }
`;

const Estilo = styled(Principal)`
  @media (max-width: 550px) {
    display: block;
    
    
    #top-container {
    display: flex;
    width: 100%;
    flex-basis: 120px;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 5px;
    gap: 5px;
    height: 120px;

    .picturebox-container{
      width: 110px;
      height: 100% ;
      flex-grow: 0;
      flex-shrink: 0;
    }

    .id-nome {
      flex-grow: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 15px;

      

      .nome-section {
        height: 50px;
        width: 100%;
        flex-direction: column;
        gap: 2px;
      }
    }
  }

    .endloc-container{
      display: flex;
      position: absolute;
      width: 100%;
      height: 100vh;

      .endloc-lista{
        height: min(60%, 600px);
      }

    }


    & > :not(:last-child) {
      margin-bottom: 10px;
    }
    

    #tags-container {
      flex-direction: column;
      overflow-x: hidden;
      flex-shrink: 0;

      .Tagger {
        width: 100%;
      }
    }

    #endereco-container {
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

        div {
          display: flex;

          label {
            display: inline-block;
            vertical-align: middle;
            width: 90px;
            min-width: 90px;
          }
        }

        #logradouro-container {
          width: 100%;
          display: flex;

          #logradouro {
            max-width: 100%;
            max-height: 100%;
          }
        }

        #local-container,
        #referencia-container {
          height: 100px;

          button {
            display: none;
          }
        }

        textarea {
        }
      }

      #endereco-right {
        display: none;
        width: 100%;
      }
    }

    /* .txt {
      label {
        
        font-size: 16px;
      }
    } */



    .txt {
        display: flex;
        user-select: none;
        gap: 5px;
      
        * {
          font-size: 16px;
        }

        input {
          flex-grow: 2;
          width: 100%;
        }
      }

      label {
        user-select: none;
      }

  }
`;
