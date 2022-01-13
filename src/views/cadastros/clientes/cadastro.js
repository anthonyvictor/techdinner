import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Tagger from "../../../components/Tagger";
import * as cores from "../../../context/cores";
import Mapa from "../../../components/Mapa";

import PictureBox from "../../../components/PictureBox";
import { formatEndereco } from "../../../util/Format";

export default function Cadastro(props) {
  const [endereco, setEndereco] = useState({
    logradouro: "427",
    cep: "40170720",
  });

  const [map, setMap] = useState(<Mapa endereco={endereco} />);

  const enderInput = useRef();
  const cepInput = useRef();
  const latlongInput = useRef();

  function procurarEndereco() {
    if (latlongInput.current.value.trim().length === 0) {
      setEndereco({
        logradouro: enderInput.current.value,
        cep: cepInput.current.value,
      });
    } else {
      setMap(<Mapa endereco={endereco} />);
    }
  }

  return (
    <Estilo>
      <div id="top-container">
        <PictureBox img={props.initialImg ? props.initialImg : ""} />

        <div className="id-nome">
          <label>
            {props.cliente && props.cliente.id.length > 0 ? (
              <>Id: {props.cliente.id}</>
            ) : (
              <>Cliente Novo!</>
            )}
          </label>
          <div className="txt nome-section">
            <label htmlFor="nome">Nome:</label>
            <input id="nome" name="nome" type="text" autoFocus />
          </div>
        </div>
      </div>

      <div id="tags-container">
        <Tagger tipo="tel" label={"Contato"} />
        <Tagger label={"Apelidos"} />
      </div>

      <section id="endereco-container">
        <div id="endereco-left">

          <div id="logradouro-container" className="txt">
            <label htmlFor="logradouro">Logradouro:</label>
            <label id="logradouro">{formatEndereco(endereco, false)}</label>
            <button>Alterar</button>
          </div>

          <div id="numero-container" className="txt">
            <label htmlFor="numero">Número:</label>
            <input id="numero" />
          </div>

          <div id="local-container" className="txt">
            <label htmlFor="local">Local da entrega:</label>
            <input
              id="local"
              placeholder="Casa, Edifício, Apartamento, Condomínio, Hospital, Escola..."
            />
            <button>Salvar</button>
          </div>

          <div id="referencia-container" className="txt">
            <label htmlFor="referencia">Ponto de referência:</label>
            <input id="referencia" placeholder="Ao lado de.. Em frente à.." />
          </div>
        </div>

        <div id="endereco-right">{map}</div>
      </section>

      <section id="bottom-container">
        <button id="salvar" type="button">
          Salvar
        </button>
        <button id="limpar" type="button">
          Limpar
        </button>
      </section>
    </Estilo>
  );
}

const Principal = styled.form`
  padding: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${cores.light};

  #tags-container {
    display: flex;
    justify-content: stretch;
    gap: 20px;

    .Tagger {
      width: 50%;
    }
  }

  #top-container {
    display: flex;
    width: 100%;
    height: 120px;
    padding: 5px;
    gap: 5px;

    .id-nome {
      flex-grow: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 15px;

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

  #endereco-container {
    border: 1px solid black;
    padding: 5px;
    display: flex;
    gap: 10px;
    height: 400px;

    #endereco-left {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 5px;

      div{
        flex-grow: 2;
        label{
          display: block;
          width: 100px; 
          min-width: 100px;
        }
      }

      #logradouro-container {
        width: 100%;
        display: flex;

        #logradouro {
          border-bottom: 1px solid black;
          max-width: 100%;
          flex-grow: 2;
        }
      }

      #numero-container {
        width: 50px;
      }
    }

    #endereco-right {
      width: 400px;
    }
  }

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
`;

const Estilo = styled(Principal)`
  @media (max-width: 400px) {
    animation: RollDown linear 0.3s;

    @keyframes RollDown {
      from {
        transform: translateY(-200%);
      }
      to {
        transform: translateY(0%);
      }
    }

    #tags-container {
      flex-direction: column;
      overflow-x: hidden;

      .Tagger {
        width: 100%;
      }
    }

    #endereco-container {
      border: 1px solid black;
      padding: 5px;
      display: flex;
      gap: 10px;
      height: 400px;

      #endereco-left {
        width: 100%;
        * {
          margin-top: 3px;
        }

        #logradouro-container {
          width: 100%;
          display: flex;

          #logradouro {
            border-bottom: 1px solid black;
            max-width: 100%;
            flex-grow: 2;
          }
        }

        #numero-container {
          width: 50px;
        }
      }

      #endereco-right {
        width: 400px;
      }
    }

    .txt {
      label {
        font-size: 16px;
      }
    }
  }
`;
