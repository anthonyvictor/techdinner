import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Tagger from "../../../components/Tagger";
import * as cores from "../../../util/cores";
import PictureBox from "../../../components/PictureBox";
import * as Format from "../../../util/Format";
import { isMobile, isNEU } from "../../../util/misc";
import { useCadCli } from "../../../context/cadClientesContext";
import { useClientes } from "../../../context/clientesContext";
import { useContextMenu } from "../../../components/ContextMenu";
import * as apis from '../../../apis'
import axios from "axios";
import { useRotas } from "../../../context/rotasContext";
import Endereco from "./endereco";



export default function Cadastro(props) {
  const {setCurrentRoute} = useRotas()
  const [contato, setContato] = useState('')
  const [tag, setTag] = useState('')
  const {curr, setCurr, limpar, images, setImages, imagem, setImagem} = useCadCli()
  const {clientes, refresh} = useClientes()

  async function salvar() {
    let ctt = [...curr.contato.map(c => Format.formatNumber(c))]
    let tg = [...curr.tags]
    if(isNEU(curr?.nome)){
      alert('Insira o nome do cliente')
    }else if(isNEU(curr.contato)){
      alert('Adicione um número para contato')
    }else{
      if(contato.length > 7){
        if(window.confirm(`Adicionar o número ${Format.formatPhoneNumber(contato)}?`)){
          if(checarCttExiste(contato)){
          ctt.push(Format.formatNumber( Format.formatPhoneNumber(contato, true) ))
          }else{return}
        }
      }
  
      if(!isNEU(tag)){
        if(window.confirm(`Adicionar a tag ${tag}?`)){
          tg.push(tag)
        }
      }
      let _img = null //await validateImage()
      const payload = {
        cliente: {
          ...curr,
          nome: curr.nome.toUpperCase(),
          imagem: _img, //Format.convertFileToBase64(imagem), 
          contato: ctt,
          tags: tg,

        }
      }
  
      axios({
        url: `${process.env.REACT_APP_API_URL}/clientes/salvar`,
        method: 'post',
        data: payload
      }).then((e) => {
          refresh(e.data)
          if(props.retorno){
            props.retorno(e.data)
          }else{
            listar()
          }  
      }).catch(e => {
        alert(`Erro: ${e} stack: ${e.stack}`)
      })
    }  
    

  }

  function listar() {
    limpar()
    setCurrentRoute(props.tabs[0])
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

  useEffect(() => {
    (curr && curr.id) && setImagem(images.filter(e => e.id === curr.id)[0]?.imagem ?? curr.imagem)
  },[curr])

 function validateImage(){
  let img = imagem
 if(imagem){
  if(typeof img === 'string' && img.includes('blob:')) {
    //async
    // img = await getFileFromUrl(img, 'imagem.jpg')
    // console.log(typeof img, img)
    // img = await Format.convertImageToBase64(img)
  }
  console.log(typeof img, img)
  if(typeof img === 'object') img = Format.convertImageToBase64(img)
 }
  return img
}

async function getFileFromUrl(url, name, defaultType = 'image/jpeg'){
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}

  return (
    <Estilo className="cadastro-clientes">
      <div id="top-container">
        <div className="picturebox-container">
          <PictureBox imagem={validateImage()} nome={curr.nome}
          setImagem={(e) => setImagem(e)}  />  
        </div>

        <div className="id-nome">
          <label>{curr.id > 0 ? `Id: ${curr.id}` : "Cliente Novo!"}</label>
          <div className="txt nome-section">
            <label htmlFor="nome">Nome:</label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoFocus={!isMobile()}
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
          array={curr.contato ? curr.contato : []}
          setArray={e => setCurr({...curr, contato: e})}
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

      <Endereco endereco={curr.endereco} setEndereco={(obj) => setCurr({...curr, endereco: { ...curr.endereco, ...obj }})} />

      <section id="bottom-container">
        <button id="salvar" type="button" 
        onClick={() => salvar()}>
          Salvar
        </button>
        <button id="limpar" type="button" 
        onClick={() => {
          setImagem(null)
          limpar(true)
        }}>
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

  #bottom-container {
    display: flex;
    min-height: 60px;
    gap: 30px;
    padding: 6px;
    flex-grow: 0;
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
          /* display: flex; */
          height: 70px;
          #logradouro {
            max-width: 100%;
            height: 100%;
            /* max-height: 100%; */
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
