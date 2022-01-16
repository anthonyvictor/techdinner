import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Tagger from "../../../components/Tagger";
import * as cores from "../../../context/cores";
import Mapa from "../../../components/Mapa";

import PictureBox from "../../../components/PictureBox";
import { formatEndereco } from "../../../util/Format";
import { isNEU, sleep } from "../../../util/misc";

export default function Cadastro(props) {
  let end1 = {
    logradouro: "Ladeira do Jardim Zoológico Ladeira do Jardim Zoológico",
    local: "Pizzaria Delicia da Bahia",
    numero: 427,
    cep: "40170720",
    bairro: "Ondina",
    referencia: "Na pracinha do Zoológico, prox. a igreja Maanaim",
    taxa: 2,
  };

  let end2 = {
    logradouro: "427",
    cep: "40170720",
  };

  // useEffect(() => {
  //   return () => {
  //     if (contato !== "" || tag !== "") {
  //       alert("TEM TEXTO FDP");
  //     }
  //   };
  // });

  const [imagem, setImagem] = useState(
    "https://exame.com/wp-content/uploads/2016/09/size_960_16_9_zuckerberg-sorriso-460-jpg.jpg"
  );
  const [nome, setNome] = useState("João Goularte");

  //Valor dos input
  const [contato, setContato] = useState("");
  const [tag, setTag] = useState("");

  //Arrays de tags
  const [tags, setTags] = useState(["Paulinha Abelha"]);
  const [contatos, setContatos] = useState(["988554455", "988885555"]);

  const [endereco, setEndereco] = useState(end1);

  function salvar() {}
  function limpar() {
    const res = window.confirm("Limpar formulário?")
    if(res) {
      setImagem('');
      setNome("");
      setContato("");
      setTag("");
      setTags([]);
      setContatos([]);
      setEndereco({});
    }
  }
  let timeout = null;
  function alterarEndereco(obj) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      setEndereco({ ...endereco, ...obj });
    }, 1000);
  }

  // useEffect(() => {
  //   console.log("Novo end:", endereco);
  // }, [endereco]);

  return (
    <Estilo>
      <div id="top-container">
        <PictureBox imagem={imagem} setImagem={setImagem} nome={nome} />

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
            <input
              id="nome"
              name="nome"
              type="text"
              autoFocus
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
              }}
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
          array={contatos}
        />
        <Tagger label={"Apelidos"} state={tag} setState={setTag} array={tags} />
      </div>

      <section id="endereco-container">
        <div id="endereco-left">
          <div id="logradouro-container" className="txt">
            <label htmlFor="logradouro">Logradouro:</label>
            <label id="logradouro">
              {formatEndereco(endereco, { withTaxa: false, withLocal: false })}
            </label>
            <button type="button">Alterar</button>
          </div>

          <div id="numero-container" className="txt">
            <label htmlFor="numero">Número:</label>
            <input
              id="numero"
              placeholder="1600"
              value={isNEU(endereco) ? '' : endereco.numero}
              onChange={(e) => {
                alterarEndereco({ numero: e.target.value.trim() });
              }}
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
              value={isNEU(endereco) ? '' : endereco.local}
              onChange={(e) => {
                alterarEndereco({ local: e.target.value.trim() });
              }}
              onBlur={(e) => {
                e.target.value = e.target.value.trim();
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                alert(e.target,'notImplemented')
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
              value={isNEU(endereco) ? '' : endereco.referencia}
              onChange={(e) => {
                alterarEndereco({ referencia: e.target.value.trim() });
              }}
              onBlur={(e) => {
                e.target.value = e.target.value.trim();
              }}
            />
          </div>
        </div>

        <div id="endereco-right">
          <Mapa endereco={endereco} />
        </div>
      </section>

      <section id="bottom-container">
        <button id="salvar" type="button" onClick={() => salvar()}>
          Salvar
        </button>
        <button id="limpar" type="button" onClick={() => limpar()}>
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
  justify-content: stretch;
  gap: 10px;
  background-color: ${cores.light};
  overflow-y: auto;

  #top-container {
    display: flex;
    width: 100%;
    flex-basis: 120px;
    padding: 5px;
    gap: 5px;

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
        }
      }
    }

    #endereco-right {
      display: none;
      width: 400px;
    }
  }

  #bottom-container {
    display: flex;
    max-height: 70px;

    /* position: fixed;
    bottom: 0;
    width: 100%; */
    gap: 30px;
    padding: 10px;
    flex-grow: 1;
    button {
      font-size: 20px;
      cursor: pointer;
    }
    #salvar {
      flex-grow: 3;
    }
    #limpar {
      flex-grow: 1;
    }
  }
`;

const Estilo = styled(Principal)`
  @media (max-width: 400px) {
    animation: RollDown linear 0.3s;
    display: block;
    & > :not(:last-child) {
      margin-bottom: 10px;
    }
    overflow-y: auto;

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
    #bottom-container {
      height: 90px;
    }
  }
`;
